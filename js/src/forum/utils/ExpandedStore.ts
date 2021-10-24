import Post from 'flarum/common/models/Post';

const revealedPosts: string[] = [];

export default {
    alwaysReveal(post: Post) {
        if (revealedPosts.indexOf(post.id()) === -1) {
            revealedPosts.push(post.id());
        }
    },
    isRevealed(post: Post): boolean {
        return revealedPosts.indexOf(post.id()) !== -1;
    },
}
