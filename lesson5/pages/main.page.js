import Page from "./page";
import PhonesPage from "./phones.page";

export default class MainPage extends Page {
    get phoneLink() { return $("a[href='/shop/catalog/telefony/']") };

    toPhones() {
        this.phoneLink.click();
        let phonesPage = new PhonesPage();
        phonesPage.contentContainer.waitForDisplayed();
        return phonesPage;
    }
}