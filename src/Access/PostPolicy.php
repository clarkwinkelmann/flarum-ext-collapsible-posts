<?php

namespace ClarkWinkelmann\CollapsiblePosts\Access;

use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class PostPolicy extends AbstractPolicy
{
    public function collapse(User $actor, Post $post): bool
    {
        return $actor->hasPermission('clarkwinkelmann-collapsible-posts.collapse') && $post instanceof CommentPost;
    }
}
