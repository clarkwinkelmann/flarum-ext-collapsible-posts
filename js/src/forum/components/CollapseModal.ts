import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import ExpandedStore from '../utils/ExpandedStore';
import retrieveTranslation from '../utils/retrieveTranslation';

export default class CollapseModal extends Modal {
    title() {
        return app.translator.trans('clarkwinkelmann-collapsible-posts.forum.modal.title');
    }

    className(): string {
        return 'Modal--small';
    }

    content() {
        const currentReason = this.attrs.post.attribute('collapsedReason');

        return m('.Modal-body', [
            Button.component({
                className: 'Button Button--block' + (currentReason ? '' : ' active'),
                onclick: () => {
                    this.saveCollapse(null);
                },
            }, app.translator.trans('clarkwinkelmann-collapsible-posts.forum.modal.uncollapse')),
            (app.forum.attribute('collapsiblePostReasons') || []).map((reason: any) => Button.component({
                className: 'Button Button--block' + (currentReason === reason.key ? ' active' : ''),
                onclick: () => {
                    this.saveCollapse(reason.key);
                },
            }, retrieveTranslation(reason.label))),
        ]);
    }

    saveCollapse(reason: string | null) {
        this.loading = true;


        // Add the soon to be collapsed post to the list so the stream doesn't collapse right after click
        // (and would show multiple buttons one below another)
        ExpandedStore.alwaysReveal(this.attrs.post);

        this.attrs.post.save({
            collapsedReason: reason,
        }).then(() => {
            this.hide();
        }).catch(error => {
            this.loading = false;
            m.redraw();

            throw error;
        });
    }
}
