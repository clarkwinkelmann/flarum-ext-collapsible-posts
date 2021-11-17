# Collapsible Posts

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-collapsible-posts/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-collapsible-posts.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-collapsible-posts) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-collapsible-posts.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-collapsible-posts) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

This extension allows collapsing some posts, so they don't clutter the discussion, while still keeping them accessible.

Multiple collapse reasons can be created in the admin page.
By default an "off-topic" reason message is offered.

When multiple posts that follow each other are collapsed for the same reason, a collapse series is created.
A series can be expanded back by group of 20 posts.

The collapse state is purely visual and doesn't prevent the user from editing or deleting their post for example.

The extension uses a solution that's a bit hacky, so there might be incompatibilities with other extensions and it might break during minor Flarum updates.

Known/expected issues:

- You cannot permalink collapsed posts.
- Search engines probably won't be able to index collapsed posts.
- Users of the REST API and noscript pages will only see the first post of a collapsed series.
- If some posts in a discussion aren't visible to everyone (deleted, under approval, shadow hidden, etc.) a collapse series might be broken in 2 for reasons the visitor cannot see. This shouldn't break the navigation but not all combinations have been tested.
- Using database table prefixes might break the extension.

## Installation

    composer require clarkwinkelmann/flarum-ext-collapsible-posts

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-collapsible-posts)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-collapsible-posts)
- [Discuss](https://discuss.flarum.org/d/29483)
