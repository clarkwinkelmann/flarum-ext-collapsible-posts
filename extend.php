<?php

namespace ClarkWinkelmann\CollapsiblePosts;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Extend;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/collapsed-posts', 'collapsed-posts', Controller\ListCollapsedPosts::class),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->attributes(PostAttributes::class),

    (new Extend\Event())
        ->listen(Saving::class, Listener\SavePost::class),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\PostPolicy::class),

    (new Extend\ModelVisibility(Post::class))
        ->scope(Visibility\PostScope::class),
];
