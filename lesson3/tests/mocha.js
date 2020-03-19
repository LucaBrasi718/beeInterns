const chai = require('chai');
var expect = chai.expect;

describe('Test Beeline Shop', function(){
    before(() => {
        browser.url('https://moskva.beeline.ru/shop/');
        let title = browser.getTitle();
        expect(title).to.equal('Интернет-магазин Билайн Москва - продажа сотовых телефонов, смартфонов и аксессуаров');
    })
    
    it('Поиск вкладки "Телефоны"', () => {
        $("a[href='/shop/catalog/telefony/']").click();
        let title = $("h1[class*='Heading_h1']").getText();
        expect(title).to.equal('Смартфоны');
    })

    it("Инпуты фильтрации 'от' и 'до' (в блоке \"Цена\")", () => {
        let priceFilters = $$("div[class*='RangeFilter'] input");
        let priceFrom = priceFilters[0];
        let priceTo = priceFilters[1];
        expect(parseInt(priceFrom.getAttribute('placeholder')) <= parseInt(priceTo.getAttribute('placeholder'))).to.be.true;
    })

    it("\"Показать все\" в разделе фильтра \"Производители\"", () => {
        let showAll = $("//div[./span[text()='Производитель'] and contains(@class, 'FiltersHeader_header')]/following-sibling::div[contains(@class, 'ShowAllButton')]");
        if (expect(showAll.getText()).to.equal('Показать все')) {
            showAll.click();
        }
    })

    it("Один из чекбоксов производителей, например, \"Motorola\”", () => {
        $("//input[@type='checkbox'][contains(@name, 'motorola')]").click();
        browser.waitUntil(() => {
            let title = $("h1[class*='Heading_h1']").getText();
            return expect(title).to.contains('Motorola');
          }, 10000, 'expected h1 contains "Motorola"');
    })

    it("Элемент сортировки по цене", () => {
        let priceSort = $("//div[./span[contains(@class,'FilterTabs_content') and text()=' Цене']]");
        priceSort.click();
        expect(priceSort.getAttribute('class')).to.contains('FilterTabs_active');
    })

    it("Элемент наименования товара в каталоге", () => {
        let name = $("//div[contains(@class,'ProductCard_header')]").getText();
        expect(name).to.contains('Motorola');
    })

    it("Значение цены товара", () => {
        let price = $('//div[contains(@class, "Heading_h3")]//div[starts-with(@class, "InlineSet_item") and not(./span) and text()]').getText();
        expect(price).to.contains("₽");
    })

    it("Кнопка 'Купить'", () => {
        const productCards = $$("//div[contains(@class, 'ProductCard_component')]");
        const name = $$("//div[contains(@class,'ProductCard_header')]")[Math.floor(productCards.length / 2)].getText();
        const buyButton = $$("//div[contains(@class, 'ProductCard_component')]//button")[Math.floor(productCards.length / 2)];

        buyButton.waitForClickable(10000);
        buyButton.click();

        browser.waitUntil(() => {
            let basketItemsNames = $$('//tr[contains(@class, "sub-row")]//a[contains(@class, "ng-binding")]');
            for(let i = 0; i < basketItemsNames.length; i++) {
                if (basketItemsNames[i].getText() === name) {
                    return expect(basketItemsNames[i].getText()).to.equal(name);
                }
                return expect(basketItemsNames[i].getText()).to.equal(name);
            }
        }, 10000, "expects item name equal");
    })

    it("'Крестик' для удаления товара из корзины (страница Корзины)", () => {
        $("svg[class='modify-link-after']").click();
        browser.waitUntil(() => {
            let deleteProof = $("div[class*='shop-basket-item-service-note'] > span").getText();
            return expect(deleteProof).to.equal("Товар был удален из корзины");
        }, 5000, 'expect string');
    })

    it("Кнопка восстановления удалённого товара", () => {
        $("div[class*='item-repair'] > span").waitForClickable();
        $("div[class*='item-repair'] > span").click();
        browser.waitUntil(() => {
            let submitBtn = $('//div[contains(@class, "shop-order") and ./button[text()="Оформить заказ"]]').getText();
            return expect(submitBtn).to.equal("Оформить заказ");
        }, 5000, "expects button 'Buy' is will work successfully");
    })



    after(() => {
        browser.debug();
    })
});