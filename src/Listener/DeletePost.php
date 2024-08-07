<?php

namespace ClarkWinkelmann\CollapsiblePosts\Listener;

use ClarkWinkelmann\CollapsiblePosts\Job\UpdateCollapseCount;
use Flarum\Post\Event\Deleted;
use Illuminate\Contracts\Queue\Queue;

class DeletePost
{
    protected $queue;

    public function __construct(Queue $queue)
    {
        $this->queue = $queue;
    }

    public function handle(Deleted $event)
    {
        $discussion = $event->post->discussion;

        // The relationship should still be able to load, but just in case we don't want to crash everything
        if (!$discussion) {
            return;
        }

        $this->queue->push(new UpdateCollapseCount($discussion));
    }
}
