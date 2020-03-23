// Алхоев Рашид
const chai = require('chai');
var expect = chai.expect;
const { addStep, addEnvironment } = require('@wdio/allure-reporter').default;
import MainPage from "../pages/main.page";
import CartPage from "../pages/cart.page";


let mainPage = new MainPage();
let cartPage = new CartPage();
let phonesPage;

describe('Test Beeline Shop', () => {

    before(() => {
        addEnvironment('browserName: ', 'Chrome');
        addEnvironment('browserVersion: ', '80.0.3987.132');
        addEnvironment('OS: ', 'macOS Catalina 10.15.3');
        mainPage.open();
    })

    it("Тест-кейс \"Фильтрация по цене\"", () => {
        addStep("Нажать на ссылку \"Телефоны\"");
        phonesPage = mainPage.toPhones();

        addStep("Проверить, что URL изменился на верный");
        expect(browser.getUrl()).to.eql("https://moskva.beeline.ru/shop/catalog/telefony/smartfony/");

        addStep("Найти инпуты \"от\" и \"до\"");
        let priceFilters = phonesPage.priceFilters;
        let priceFilterFrom = priceFilters[0];
        let priceFilterTo = priceFilters[1];

        addStep("Получить значение атрибута placeholder для поля \"До\". Отнять 2000");
        let valueTo = parseInt(priceFilterTo.getAttribute("placeholder"));
        let valueFrom = valueTo - 2000;

        addStep("Ввести полученное значение в поле \"От\"");
        browser.pause(5000);
        phonesPage.setPriceFilter(priceFilterFrom, priceFilterTo, valueFrom);

        addStep("Проверяем, что список телефонов обновился");
        browser.waitUntil(() => {
            let price = phonesPage.getPrice(0);
            return expect(price >= valueFrom && price <= valueTo).to.be.true;
        }, 5000, "expect update catalog");

        addStep("Получить значения цен каждого товара из списка");
        let priceList = phonesPage.getPrice();

        addStep("Проверяем, что все цены находятся в заданном диапазоне");
        priceList.map(item => expect(item >= valueFrom && item <= valueTo).to.be.true);
    });

    it("Тест-кейс \"Сортировка по цене\"", () => {
        addStep("Нажать на ссылку \"Телефоны\"");
        phonesPage = mainPage.toPhones();

        addStep("Проверить, что URL изменился на верный");
        expect(browser.getUrl()).to.eql("https://moskva.beeline.ru/shop/catalog/telefony/smartfony/");

        addStep("Нажать \"Сортировать по цене\"");
        phonesPage.sortByPrice();

        addStep("Проверяем, что список телефонов обновился и каждый следующий элемент в списке больше или равен предыдущему \"соседу\"");
        browser.pause(5000);
        let priceList = phonesPage.getPrice();

        for (let i = 0; i < priceList.length - 1; i++) {
            expect(priceList[i] <= priceList[i + 1]).to.be.true;
        }
    });

    it("Тест-кейс \"Удаление товара из корзины и его восстановление\"", () => {
        addStep("Нажать на ссылку \"Телефоны\"");
        phonesPage = mainPage.toPhones();

        addStep("Проверить, что URL изменился на верный");
        expect(browser.getUrl()).to.eql("https://moskva.beeline.ru/shop/catalog/telefony/smartfony/");

        addStep("Выбрать товар из середины списка и нажать \"Купить\"");
        let name = phonesPage.addToBasket();

        addStep("Дожидаемся загрузки корзины и проверяем наличие там выбранного телефона");

        let itemNum;
        browser.waitUntil(() => {
            let basketItemsNames = cartPage.CartList;
            for(let i = 0; i < basketItemsNames.length; i++) {
                let text = basketItemsNames[i].getText();
                if (text === name) {
                    itemNum = i;
                    return expect(text).to.equal(name);
                }
                return expect(text).to.equal(name);
            }
        }, 10000, "expects item name equal");

        addStep("Нажать на \"крестик\" рядом с выбранным ранее товаром");
        expect(cartPage.deleteItem(itemNum).getText()).to.equal('Товар был удален из корзины');

        addStep("Нажать на \"Восстановить\"");
        cartPage.restoreItem(cartPage.waitEnableRestore(itemNum));

        addStep("Проверяем что товар устался в корзине, а сообщение с текстом: \"Товар был удален из корзины\" ​исчезло.");
        browser.waitUntil(() => {
            let basketItemsNames = cartPage.CartList;
            for(let i = 0; i < basketItemsNames.length; i++) {
                let text = basketItemsNames[i].getText();
                if (text === name) {
                    itemNum = i;
                    return expect(text).to.equal(name);
                }
                return expect(text).to.equal(name);
            }
        }, 10000, "expects item name equal");

        expect(cartPage.waitEnableRestore(itemNum)).to.be.false;
    });

})