<?php

namespace ClarkWinkelmann\CollapsiblePosts\Listener;

use ClarkWinkelmann\CollapsiblePosts\Job\UpdateCollapseCount;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class SavePost
{
    protected $queue;
    protected $validation;
    protected $settings;

    public function __construct(Queue $queue, Factory $validation, SettingsRepositoryInterface $settings)
    {
        $this->queue = $queue;
        $this->validation = $validation;
        $this->settings = $settings;
    }

    public function handle(Saving $event)
    {
        $attribute = (array)Arr::get($event->data, 'attributes');

        if (Arr::exists($attribute, 'collapsedReason')) {
            $event->actor->assertCan('collapse', $event->post);

            $allowedReasons = json_decode($this->settings->get('collapsible-posts.reasons'));
            $allowedReasonKeys = is_array($allowedReasons) ? Arr::pluck($allowedReasons, 'key') : [];

            $this->validation->make([
                'reason' => Arr::get($attribute, 'collapsedReason'),
            ], [
                'reason' => ['nullable', Rule::in($allowedReasonKeys)],
            ])->validate();

            $event->post->collapsed_reason = Arr::get($attribute, 'collapsedReason');

            $event->post->afterSave(function (Post $post) {
                $this->queue->push(new UpdateCollapseCount($post->discussion));
            });
        }
    }
}
