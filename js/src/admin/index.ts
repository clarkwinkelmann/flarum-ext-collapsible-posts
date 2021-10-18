import app from 'flarum/admin/app';

app.initializers.add('clarkwinkelmann-collapsible-posts', () => {
    app.extensionData
        .for('clarkwinkelmann-collapsible-posts')
        .registerPermission({
            icon: 'fas fa-arrows-alt-v',
            label: app.translator.trans('clarkwinkelmann-collapsible-posts.admin.permission.collapse'),
            permission: 'clarkwinkelmann-collapsible-posts.collapse',
        }, 'moderate');
});
