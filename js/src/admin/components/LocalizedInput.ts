import {ClassComponent, Vnode} from 'mithril';
import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';

interface LocalizedInputAttrs {
    value: {
        [locale: string]: string
    }
    onchange: (locale: string, value: string) => void
}

export default class LocalizedInput implements ClassComponent<LocalizedInputAttrs> {
    locale!: string

    oninit() {
        this.locale = app.data.locale;
    }

    view(vnode: Vnode<LocalizedInputAttrs, this>) {
        const locales = [];

        for (const locale in app.data.locales) {
            if (!app.data.locales.hasOwnProperty(locale)) {
                continue;
            }

            locales.push(Button.component({
                active: this.locale === locale,
                icon: this.locale === locale ? 'fas fa-check' : true,
                onclick: () => {
                    this.locale = locale;
                },
            }, locale.toUpperCase() as any));
        }

        return m('.ReportLocalizedInput', [
            SelectDropdown.component({
                buttonClassName: 'Button',
            }, locales as any),
            m('input.FormControl', {
                value: vnode.attrs.value[this.locale] || '',
                onchange: (event: Event) => {
                    vnode.attrs.onchange(this.locale, (event.target as HTMLInputElement).value);
                },
            }),
        ]);
    }
}
