import Page from "./page";

export default class PhonesPage extends Page {
    get contentContainer () { return $("div[class*='SmoothContentSwitcher_container']") };
    get showAllBrands () { return $("//div[./span[text()='Производитель'] and contains(@class, 'FiltersHeader_header')]/following-sibling::div[contains(@class, 'ShowAllButton')]") };
    get priceFilters () { return $$("div[class*='RangeFilter'] input") };
    get priceSort () { return $("//div[./span[contains(@class,'FilterTabs_content') and text()=' Цене']]") };

    clickShowAllBrands() {
        this.showAllBrands.click();
    }

    chooseBrand(name = false) {
        if (name)
            $(`//span[./input[@type='checkbox' and contains(@id, 'proizvoditel')]]//input[contains(@name, '${name}')]`).click();
        else
            $(`//span[./input[@type='checkbox' and contains(@id, 'proizvoditel')]]//input`).click();
    }

    setPriceFilter (priceFilterFrom, priceFilterTo, valueFrom = false, valueTo = false) {
        if (valueFrom) {
            priceFilterFrom.setValue(valueFrom);
        }
        if (valueTo) {
            priceFilterTo.setValue(valueTo);
        }
    }

    getPrice (index = "all") {
        let priceList = $$('//div[contains(@class, "Heading_h3")]//div[starts-with(@class, "InlineSet_item") and not(./span) and text()]');
        if (index !== "all") {
            let price = priceList[index].getText();
            return price.slice(0, price.lastIndexOf(' ')).split(' ').join('');
        }
        return priceList.map((item) => {
            let price = item.getText();
            return price.slice(0, price.lastIndexOf(' ')).split(' ').join('');
        });
    }

    sortByPrice () {
        this.priceSort.waitForClickable(5000);
        this.priceSort.click();
    }

    addToBasket (n = false) {
        let name;
        let buyButton;
        if (!n) {
            let productCards = $$("//div[contains(@class, 'ProductCard_component')]");
            name = $$("//div[contains(@class,'ProductCard_header')]")[Math.floor(productCards.length / 2)].getText();
            buyButton = $$("//div[contains(@class, 'ProductCard_component')]//button")[Math.floor(productCards.length / 2)];
        } else {
            name = $$("//div[contains(@class,'ProductCard_header')]")[n].getText();
            buyButton = $$("//div[contains(@class, 'ProductCard_component')]//button")[n];
        }
        buyButton.click();
        return name;
    }
};