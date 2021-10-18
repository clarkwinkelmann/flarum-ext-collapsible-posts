<?php

namespace ClarkWinkelmann\CollapsiblePosts\Job;

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class UpdateCollapseCount implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $discussion;

    public function __construct(Discussion $discussion)
    {
        $this->discussion = $discussion;
    }

    public function handle()
    {
        $previousPost = null;
        $collapsedCount = 0;

        // Start from bottom so we don't need to keep track of which was the first post of a series
        $this->discussion->posts()->orderBy('created_at', 'desc')->each(function (Post $post) use (&$previousPost, &$collapsedCount) {
            if ($collapsedCount > 0) {
                if ($post->collapsed_reason) {
                    $post->collapsed_count = $collapsedCount;
                    $post->collapsed_hidden = true;
                    $collapsedCount++;
                } else {
                    $previousPost->collapsed_hidden = false;
                    $collapsedCount = 0;
                }
            } else if ($post->collapsed_reason) {
                $post->collapsed_count = 0;
                $post->collapsed_hidden = true;
                $collapsedCount = 1;
            } else {
                $post->collapsed_count = null;
                $post->collapsed_hidden = false;
            }

            if ($previousPost) {
                // Save the previous one, that way there's no double count update for the first in a row
                $previousPost->save();
            }

            $previousPost = $post;
        });

        if ($previousPost) {
            $previousPost->save();
        }
    }
}
