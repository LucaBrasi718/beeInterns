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
    })

    beforeEach(() => {
        mainPage.open();
    })

    it('Первый тест', () => {
        addStep("Пользователь проверяет, что главная страница магазина открыта успешно");
        expect(browser.getTitle()).to.equal('Интернет-магазин Билайн Москва - продажа сотовых телефонов, смартфонов и аксессуаров');

        addStep("Пользователь переходит на вкладку 'Телефоны'");
        phonesPage = mainPage.toPhones();

        addStep("Проверяем, что вкладка 'Телефоны' открыта успешно");
        expect(browser.getUrl()).to.eql("https://moskva.beeline.ru/shop/catalog/telefony/smartfony/");

        browser.pause(5000);
        addStep("Кликаем показать все в разделе фильтра \'Производители\'");
        phonesPage.clickShowAllBrands();

        addStep("Выбираем продукцию Apple");
        let nameBrand = 'Apple';
        phonesPage.chooseBrand(nameBrand.toLowerCase());

        browser.pause(5000);
        addStep(`Проверяем, что отображается продукция ${nameBrand}`);
        browser.waitUntil(() => {
            let titles = $$("//div[contains(@class,'ProductCard_header')]/a");
            for(let i = 0; i < titles.length; i++) {
                if (titles[i].getText().includes(`${nameBrand}`)) {
                    return expect(titles[i].getText()).to.contains(`${nameBrand}`);
                };
                return expect(titles[i].getText()).to.contains(`${nameBrand}`);
            }
          }, 10000, `expected h1 contains ${nameBrand}`);
    });

    it('Второй тест', () => {
        addStep("Пользователь проверяет, что главная страница магазина открыта успешно");
        expect(browser.getTitle()).to.equal('Интернет-магазин Билайн Москва - продажа сотовых телефонов, смартфонов и аксессуаров');

        addStep("Пользователь переходит на вкладку 'Телефоны'");
        phonesPage = mainPage.toPhones();

        addStep("Проверяем, что вкладка 'Телефоны' открыта успешно");
        expect(browser.getUrl()).to.eql("https://moskva.beeline.ru/shop/catalog/telefony/smartfony/");

        browser.pause(5000);

        addStep("Сортируем каталог товаров по цене");
        phonesPage.sortByPrice();

        addStep("Проверяем, что список телефонов обновился и каждый следующий элемент в списке больше или равен предыдущему \"соседу\"");
        browser.pause(5000);
        let priceList = phonesPage.getPrice();

        for (let i = 0; i < priceList.length - 1; i++) {
            expect(priceList[i] <= priceList[i + 1]).to.be.true;
        }

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
    });

});