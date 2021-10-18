<?php

namespace ClarkWinkelmann\CollapsiblePosts\Visibility;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Arr;

class PostScope
{
    public function __invoke(User $actor, Builder $query)
    {
        foreach ($query->getQuery()->columns as $column) {
            // This is a way for us to bypass the logic from below
            // By adding this column to the SELECT clause, it will have no impact on the output, but we can read it here
            if ($column instanceof Expression && $column->getValue() === "'1' as collapsed_include_hidden") {
                return;
            }
        }

        foreach ($query->getQuery()->wheres as $where) {
            // Because there's no way to extend ShowDiscussionController::loadPostIds or ::loadPosts we have to hack our way
            // through the visibility scope. But changing the visibility scope also affects ShowPostController and other extensions
            // So we'll do it in a way that only affects the query when done through $discussion->posts()->whereVisibleTo()
            // This is achieved by looking for the where clause added by the HasMany relationship
            // There are actually two wheres with the column, one for the ID and one for not-null. We'll react to either then break
            // This also impacts the DiscussionFilter used in PostStreamState::loadNearNumber, but that's actually desirable
            // TODO: impacted by table prefixes?
            if (Arr::get($where, 'column') === 'posts.discussion_id') {
                $query->where('collapsed_hidden', false);

                break;
            }
        }
    }
}
