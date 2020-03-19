// Алхоев Рашид
const chai = require('chai');
var expect = chai.expect;
const { addStep, addEnvironment } = require('@wdio/allure-reporter').default;

describe('Test Beeline Shop', () => {

    before(() => {
        addEnvironment('browserName: ', 'Chrome');
        addEnvironment('browserVersion: ', '80.0.3987.132');
        addEnvironment('OS: ', 'macOS Catalina 10.15.3');
    })

    it('Первый тест', () => {
        addStep("Пользователь открывает главную страницу магазина");
        browser.url('https://moskva.beeline.ru/shop/');
        let title = browser.getTitle();
        addStep("Пользователь проверяет, что главная страница магазина открыта успешно");
        expect(title).to.equal('Интернет-магазин Билайн Москва - продажа сотовых телефонов, смартфонов и аксессуаров');
        addStep("Пользователь переходит на вкладку 'Телефоны'");
        $("a[href='/shop/catalog/telefony/']").click();
        let titleH1 = $("h1[class*='Heading_h1']").getText();
        addStep("Проверяем, что вкладка 'Телефоны' открыта успешно");
        expect(titleH1).to.equal('Смартфоны');
        addStep("Кликаем показать все в разделе фильтра \'Производители\'");
        let showAll = $("//div[./span[text()='Производитель'] and contains(@class, 'FiltersHeader_header')]/following-sibling::div[contains(@class, 'ShowAllButton')]");
        if (expect(showAll.getText()).to.equal('Показать все')) {
            showAll.click();
        }
        addStep("Выбираем продукцию Apple");
        $("//input[@type='checkbox'][contains(@name, 'apple')]").click();
        addStep("Проверяем, что отображается продукция Apple");
        browser.waitUntil(() => {
            let titles = $$("//div[contains(@class,'ProductCard_header')]/a");
            for(let i = 0; i < titles.length; i++) {
                if (titles[i].getText().includes('Apple')) {
                    return expect(titles[i].getText()).to.contains('Apple');
                };
                return expect(titles[i].getText()).to.contains('Apple');
            }
          }, 10000, 'expected h1 contains "Apple"');
    });

    it('Второй тест', () => {
        addStep("Пользователь открывает главную страницу магазина");
        browser.url('https://moskva.beeline.ru/shop/');
        let title = browser.getTitle();
        addStep("Пользователь проверяет, что главная страница магазина открыта успешно");
        expect(title).to.equal('Интернет-магазин Билайн Москва - продажа сотовых телефонов, смартфонов и аксессуаров');
        addStep("Пользователь переходит на вкладку 'Телефоны'");
        $("a[href='/shop/catalog/telefony/']").click();
        let titleH1 = $("h1[class*='Heading_h1']").getText();
        addStep("Проверяем, что вкладка 'Телефоны' открыта успешно");
        expect(titleH1).to.equal('Смартфоны');
        addStep("Сортируем каталог товаров по цене");
        let priceSort = $("//div[./span[contains(@class,'FilterTabs_content') and text()=' Цене']]");
        priceSort.click();
        addStep("Проверяем, что кнопка сортировки активна");
        expect(priceSort.getAttribute('class')).to.contains('FilterTabs_active');
        browser.pause(5000);
        addStep("Выбираем телефон из середины списка");
        const productCards = $$("//div[contains(@class, 'ProductCard_component')]");
        const name = $$("//div[contains(@class,'ProductCard_header')]")[Math.floor(productCards.length / 2)].getText();
        const buyButton = $$("//div[contains(@class, 'ProductCard_component')]//button")[Math.floor(productCards.length / 2)];

        addStep("Кликаем \'Купить\' по телефону из середины списка");
        buyButton.waitForClickable(10000);
        buyButton.click();

        addStep("Дожидаемся загрузки корзины и проверяем наличие там выбранного телефона");
        browser.waitUntil(() => {
            let basketItemsNames = $$('//tr[contains(@class, "sub-row")]//a[contains(@class, "ng-binding")]');
            for(let i = 0; i < basketItemsNames.length; i++) {
                if (basketItemsNames[i].getText() === name) {
                    return expect(basketItemsNames[i].getText()).to.equal(name);
                }
                return expect(basketItemsNames[i].getText()).to.equal(name);
            }
        }, 10000, "expects item name equal");
    });

});