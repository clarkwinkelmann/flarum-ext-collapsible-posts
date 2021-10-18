import {extend, override} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import PostControls from 'flarum/forum/utils/PostControls';
import CommentPost from 'flarum/forum/components/CommentPost';

const expandedPostIds: string[] = [];

app.initializers.add('clarkwinkelmann-collapsible-posts', () => {
    extend(PostControls, 'moderationControls', function (items: ItemList, post: Post) {
        if (!post.attribute('canCollapse')) {
            return;
        }

        const isCollapsed = post.attribute('isCollapsed');

        items.add('collapse', Button.component({
            icon: isCollapsed ? 'fas fa-arrows-alt-v' : 'fas fa-compress-alt',
            onclick() {
                // Add the soon to be collapsed post to the list so the stream doesn't collapse right after click
                // (and would show multiple buttons one below another)
                if (expandedPostIds.indexOf(post.id()) === -1) {
                    expandedPostIds.push(post.id());
                }

                post.save({
                    isCollapsed: !isCollapsed,
                }).then(() => {
                    m.redraw();
                });
            },
        }, app.translator.trans('clarkwinkelmann-collapsible-posts.forum.postControl.' + (isCollapsed ? 'uncollapse' : 'collapse'))));
    });

    extend(CommentPost.prototype, 'headerItems', function (this: CommentPost, items: ItemList) {
        // @ts-ignore missing type-hint in Flarum
        const {post} = this.attrs;

        if (post.attribute('isCollapsed')) {
            items.add('collapsed', m('span.CollapsedPostBadge', app.translator.trans('clarkwinkelmann-collapsible-posts.forum.badge.post')));
        }
    });

    extend(CommentPost.prototype, 'oninit', function (this: CommentPost) {
        // @ts-ignore missing type-hint in Flarum
        const {post} = this.attrs;

        this.subtree!.check(
            () => post.attribute('isCollapsed'),
            () => expandedPostIds.indexOf(post.id()) === -1
        );
    });

    override(CommentPost.prototype, 'view', function (this: CommentPost, original: any) {
        // @ts-ignore missing type-hint in Flarum
        const {post} = this.attrs;

        if (post.attribute('isCollapsed') && expandedPostIds.indexOf(post.id()) === -1) {
            return m('.CollapsedPost', [
                m('.CollapsedPostText', app.translator.trans('clarkwinkelmann-collapsible-posts.forum.stream.hidden', {
                    count: post.attribute('collapsedCount') + 1,
                })),
                Button.component({
                    className: 'Button',
                    onclick() {
                        expandedPostIds.push(post.id());

                        const discussion = post.discussion();

                        app.store
                            .find('collapsed-posts', {
                                filter: {discussion: discussion.id()},
                                page: {after: post.number()},
                            })
                            .then((expandedPosts: Post[]) => {
                                console.log(expandedPosts);

                                expandedPosts.slice().reverse().forEach((expandedPost, index) => {
                                    // If the last post doesn't have a collapseCount value of zero, it means there will be more posts to expand
                                    // so we don't expand it automatically
                                    if (index === 0 && expandedPost.attribute('collapsedCount') > 0) {
                                        return;
                                    }

                                    expandedPostIds.push(expandedPost.id());
                                });

                                const postStore = discussion.data.relationships.posts.data as { type: string, id: string }[];

                                const existingIds = postStore.map(link => link.id);
                                const index = existingIds.indexOf(post.id());

                                if (index !== -1) {
                                    const newPosts = expandedPosts.filter(expandedPost => existingIds.indexOf(expandedPost.id()) === -1).map(expandedPost => {
                                        return {
                                            type: 'posts',
                                            id: expandedPost.id(),
                                        };
                                    });

                                    // Add all posts from the response after the post on which we clicked expand
                                    // we'll skip any post that is already in the list, which likely includes the first one
                                    postStore.splice(index + 1, 0, ...newPosts);

                                    //TODO: update stream end index

                                    const stream = app.current.get('stream');

                                    if (stream) {
                                        // Going to post forces a stream update and also nicely aligns the expanded post with the viewport
                                        stream.goToNumber(post.number());
                                    }
                                }
                            });
                    },
                }, app.translator.trans('clarkwinkelmann-collapsible-posts.forum.stream.load')),
            ]);
        } else {
            return original();
        }
    });

    /*Discussion.prototype.originalPostIds = Discussion.prototype.postIds;

    override(Discussion.prototype, 'postIds', function (this: Discussion, original: () => string[]) {
        // Cast IDs to string for comparison
        const collapsedIds = (this.attribute('collapsedIds') as number[]).map(id => id + '');

        const allIds = original();
        //console.log(allIds, collapsedIds);
        return allIds.filter(id => collapsedIds.indexOf(id) === -1 || expandedPostIds.indexOf(id) !== -1);
    });*/
});
