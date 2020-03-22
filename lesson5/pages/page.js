export default class Page {
    constructor () {
        this.URL = "https://moskva.beeline.ru/shop/";
    }

    open (path=this.URL) {
        if (path !== this.URL) {
            path = this.URL + path;
        }
        browser.maximizeWindow();
        browser.url(path);
    }
}