<?php

use Flarum\Database\Migration;

return Migration::addColumns('posts', [
    // Stores the manual or automated state
    'collapsed_reason' => ['string', 'length' => 100, 'nullable' => true],
    // Will be used to know how many more hidden posts follow the current post
    // The value might include posts the user cannot see (deleted, shadow ban, etc)
    // so it's why we repeat it on all posts, so we don't need to recalculate after skipping n visible posts
    'collapsed_count' => ['integer', 'unsigned' => true, 'nullable' => true],
    // Will be used to filter the initial page load
    'collapsed_hidden' => ['boolean', 'default' => false, 'index' => true],
]);
