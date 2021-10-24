import {extend, override} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Post from 'flarum/common/models/Post';
import PostControls from 'flarum/forum/utils/PostControls';
import CommentPost from 'flarum/forum/components/CommentPost';
import CollapseModal from './components/CollapseModal';
import ExpandedStore from './utils/ExpandedStore';
import retrieveTranslation from './utils/retrieveTranslation';

app.initializers.add('clarkwinkelmann-collapsible-posts', () => {
    extend(PostControls, 'moderationControls', function (items: ItemList, post: Post) {
        if (!post.attribute('canCollapse')) {
            return;
        }

        items.add('collapse', Button.component({
            icon: 'fas fa-arrows-alt-v',
            onclick() {
                app.modal.show(CollapseModal, {
                    post,
                });
            },
        }, app.translator.trans('clarkwinkelmann-collapsible-posts.forum.postControl.' + (post.attribute('collapsedReason') ? 'uncollapse' : 'collapse'))));
    });

    extend(CommentPost.prototype, 'headerItems', function (this: CommentPost, items: ItemList) {
        // @ts-ignore missing type-hint in Flarum
        const {post} = this.attrs;

        if (post.attribute('collapsedReason')) {
            items.add('collapsed', m('span.CollapsedPostBadge', app.translator.trans('clarkwinkelmann-collapsible-posts.forum.badge.post')));
        }
    });

    extend(CommentPost.prototype, 'oninit', function (this: CommentPost) {
        // @ts-ignore missing type-hint in Flarum
        const {post} = this.attrs;

        this.subtree!.check(
            () => post.attribute('collapsedReason'),
            () => ExpandedStore.isRevealed(post)
        );
    });

    override(CommentPost.prototype, 'view', function (this: CommentPost, original: any) {
        // @ts-ignore missing type-hint in Flarum
        const {post} = this.attrs;

        // We want to include the current hidden post in the collapse count
        const collapsedCount = post.attribute('collapsedCount') + 1;
        const reasonDefinition = (app.forum.attribute('collapsiblePostReasons') || []).find(reason => reason.key === post.attribute('collapsedReason'));

        if (post.attribute('collapsedReason') && !ExpandedStore.isRevealed(post)) {
            return m('.CollapsedPost', [
                m('.CollapsedPostText', reasonDefinition.explanation ? retrieveTranslation(reasonDefinition.explanation).replace('{count}', collapsedCount) : app.translator.trans('clarkwinkelmann-collapsible-posts.forum.stream.hidden', {
                    count: collapsedCount,
                    reason: reasonDefinition ? retrieveTranslation(reasonDefinition.label) : post.attribute('collapsedReason'),
                })),
                Button.component({
                    className: 'Button',
                    onclick() {
                        ExpandedStore.alwaysReveal(post);

                        const discussion = post.discussion();

                        app.store
                            .find('collapsed-posts', {
                                filter: {discussion: discussion.id()},
                                page: {after: post.number()},
                            })
                            .then((expandedPosts: Post[]) => {
                                expandedPosts.slice().reverse().forEach((expandedPost, index) => {
                                    // If the last post doesn't have a collapseCount value of zero, it means there will be more posts to expand
                                    // so we don't expand it automatically
                                    if (index === 0 && expandedPost.attribute('collapsedCount') > 0) {
                                        return;
                                    }

                                    ExpandedStore.alwaysReveal(expandedPost);
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

                                    const stream = app.current.get('stream');

                                    if (stream) {
                                        // Going to post forces a stream update and also nicely aligns the expanded post with the viewport
                                        stream.goToNumber(post.number());
                                    }
                                }
                            });
                    },
                }, app.translator.trans('clarkwinkelmann-collapsible-posts.forum.stream.load')),
                // Some extensions like flarum/mentions expect .Post-body to always exist in a CommentPost
                // So we'll add it here but hide it with CSS
                m('.Post-body'),
            ]);
        } else {
            return original();
        }
    });
});
