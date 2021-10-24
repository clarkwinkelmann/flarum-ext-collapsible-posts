<?php

namespace ClarkWinkelmann\CollapsiblePosts;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;

class PostAttributes
{
    public function __invoke(PostSerializer $serializer, Post $post): array
    {
        return [
            'collapsedReason' => $post->collapsed_reason,
            'collapsedCount' => $post->collapsed_count,
            'canCollapse' => $serializer->getActor()->can('collapse', $post),
        ];
    }
}
