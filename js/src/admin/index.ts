import app from 'flarum/admin/app';
import AdminPage from 'flarum/admin/components/AdminPage';
import Button from 'flarum/common/components/Button';
import LocalizedInput from './components/LocalizedInput';

const settingName = 'collapsible-posts.reasons';
const translationPrefix = 'clarkwinkelmann-collapsible-posts.admin.settings.';

app.initializers.add('clarkwinkelmann-collapsible-posts', () => {
    app.extensionData
        .for('clarkwinkelmann-collapsible-posts')
        .registerSetting(function (this: AdminPage) {
            let reasons: {
                key?: string
                label?: {
                    [locale: string]: string
                }
                explanation?: {
                    [locale: string]: string
                }
            }[] = [];

            try {
                reasons = JSON.parse(this.setting(settingName)());
            } catch (e) {
                // do nothing, we'll reset to something usable
            }

            if (!Array.isArray(reasons)) {
                reasons = [];
            }

            return [
                m('.Form-group', [
                    m('label', app.translator.trans(translationPrefix + 'reasons')),
                    m('table', [
                        m('thead', m('tr', [
                            m('th', app.translator.trans(translationPrefix + 'header.key')),
                            m('th', app.translator.trans(translationPrefix + 'header.label')),
                            m('th', app.translator.trans(translationPrefix + 'header.explanation')),
                            m('th'),
                        ])),
                        m('tbody', [
                            reasons.map((reason, index) => m('tr', [
                                m('td', m('input.FormControl', {
                                    type: 'text',
                                    value: reason.key || '',
                                    onchange: (event: Event) => {
                                        reason.key = (event.target as HTMLInputElement).value;
                                        this.setting(settingName)(JSON.stringify(reasons));
                                    },
                                })),
                                m('td', m(LocalizedInput, {
                                    value: reason.label || {},
                                    onchange: (locale, value) => {
                                        reason.label = reason.label || {};
                                        reason.label[locale] = value;
                                        this.setting(settingName)(JSON.stringify(reasons));
                                    },
                                })),
                                m('td', m(LocalizedInput, {
                                    value: reason.explanation || {},
                                    onchange: (locale, value) => {
                                        reason.explanation = reason.explanation || {};
                                        if (value) {
                                            reason.explanation[locale] = value;
                                        } else {
                                            delete reason.explanation[locale];

                                            // Delete explanation object when empty because we use its presence to switch the text
                                            if (Object.keys(reason.explanation).length === 0) {
                                                delete reason.explanation;
                                            }
                                        }
                                        this.setting(settingName)(JSON.stringify(reasons));
                                    },
                                })),
                                m('td', Button.component({
                                    className: 'Button Button--icon',
                                    icon: 'fas fa-times',
                                    onclick: () => {
                                        reasons.splice(index, 1);

                                        this.setting(settingName)(JSON.stringify(reasons));
                                    },
                                })),
                            ])),
                            m('tr', m('td', {
                                colspan: 3,
                            }, Button.component({
                                className: 'Button Button--block',
                                onclick: () => {
                                    reasons.push({
                                        key: '',
                                    });

                                    this.setting(settingName)(JSON.stringify(reasons));
                                },
                            }, app.translator.trans(translationPrefix + 'add')))),
                        ]),
                    ]),
                ]),
            ];
        })
        .registerPermission({
            icon: 'fas fa-arrows-alt-v',
            label: app.translator.trans('clarkwinkelmann-collapsible-posts.admin.permission.collapse'),
            permission: 'clarkwinkelmann-collapsible-posts.collapse',
        }, 'moderate');
});
