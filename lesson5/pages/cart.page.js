import Page from "./page";

export default class CartPage extends Page {

    get CartList() { return $$('//tr[contains(@class, "sub-row")]//a[contains(@class, "ng-binding")]') };

    deleteItem(n) {
        $$("svg[class='modify-link-after']")[n].click();
        let item = $$("//tbody[contains(@data-ng-controller, 'orderListItem')]")[n];
        item.$("//span[contains(text(),'Товар был удален')]").waitForEnabled(5000);
        return item.$("//span[contains(text(),'Товар был удален')]");
    }

    waitEnableRestore(n) {
        let canRestoreItem = $$("//tbody[contains(@data-ng-controller, 'orderListItem')]");

        try {
            canRestoreItem[n].$("//span[text()='Восстановить']").waitForEnabled(5000)
            return canRestoreItem[n].$("//span[text()='Восстановить']");
        } catch (err) {
            return false;
        }
    }

    restoreItem(item) {
        item.click();
    }
}