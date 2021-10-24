import app from 'flarum/forum/app';

export default function (object: {
    [locale: string]: string
} | undefined) {
    if (object) {
        if (object[app.data.locale]) {
            return object[app.data.locale];
        }

        if (object.en) {
            return object.en;
        }
    }

    return JSON.stringify(object);
}
