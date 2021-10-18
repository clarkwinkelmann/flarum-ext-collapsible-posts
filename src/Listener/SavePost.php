<?php

namespace ClarkWinkelmann\CollapsiblePosts\Listener;

use ClarkWinkelmann\CollapsiblePosts\Job\UpdateCollapseCount;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Support\Arr;

class SavePost
{
    protected $queue;

    public function __construct(Queue $queue)
    {
        $this->queue = $queue;
    }

    public function handle(Saving $event)
    {
        $attribute = (array)Arr::get($event->data, 'attributes');

        if (Arr::exists($attribute, 'isCollapsed')) {
            $event->actor->assertCan('collapse', $event->post);

            $event->post->collapsed_reason = Arr::exists($attribute, 'isCollapsed') ? 'offtopic' : null;

            $event->post->afterSave(function (Post $post) {
                $this->queue->push(new UpdateCollapseCount($post->discussion));
            });
        }
    }
}
