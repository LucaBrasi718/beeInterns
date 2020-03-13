require ("chromedriver");
const assert = require('assert');
const { Builder, By, until } = require ("selenium-webdriver");
let driver;

describe("Проверка поиска элементов с разными типами локаторов", () => {
    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.get("https://moskva.beeline.ru/shop");
    });

    it("Поиск вкладки 'Телефоны'", async function () {
        await driver.wait(until.elementLocated(By.css("div[class*='Navigation_desktop']")), 10000);
        await driver.findElement(By.css("a[href='/shop/catalog/telefony/']")).click();
        await driver.wait(until.elementLocated(By.css("div[id='catalogContent']")), 10000);
        let title = await driver.findElement(By.css("h1[class*='Heading_h1']")).getText();
        assert.equal(title, `Смартфоны`);
    });

    it("Инпуты фильтрации 'от' и 'до' (в блоке \"Цена\")", async function () {
        await driver.findElement(By.css("div[role='slider'][tabIndex='0']"));
        await driver.findElement(By.css("div[role='slider'][tabIndex='1']"));
    });

    it("\"Показать все\" в разделе фильтра \"Производители\"", async function () {
        let title = await driver.findElement(By.css("div[class*='SidebarPanel_borderBottom']:nth-child(3) > div[class*='ShowAllButton']")).getText();
        assert.equal(title, 'Показать все');
    });

    it("Один из чекбоксов производителей, например, \"Apple\”", async function () {
        await driver.findElement(By.css("div[class*='SidebarPanel_borderBottom']:nth-child(3) > div[class*='ShowAllButton']")).click();
        await driver.wait(until.elementLocated(By.css("div[class*='FiltersOption_container'] input[type='checkbox'][name*='apple']")), 10000);
        await driver.findElement(By.css("div[class*='SidebarPanel_borderBottom']:nth-child(3) input[type='checkbox'][name*='apple']")).click();
    });

    it("Элемент сортировки по цене", async function () {
        let name = await driver.findElement(By.css("div[class*='InlineSet_item']:last-child div[class*='FilterTabs_component']:last-child span[class*='FilterTabs_content']")).getText();
        assert.equal(name, "Цене");
    });

    it("Элемент наименования товара в каталоге", async function () {
        await driver.wait(until.elementTextContains(driver.findElement(By.css("div[class*='ProductCard_header']"), 'Apple')), 10000);
        let name = await driver.findElement(By.css("div[class*='ProductList_component'] div[class*='ProductCard_header'] > a")).getText();
        assert.equal(name, "Смартфон Apple iPhone 11 64GB Чёрный");
    });

    it("Значение цены товара", async function () {
        await driver.wait(until.elementTextContains(driver.findElement(By.css("div[class*='ProductList_component'] div[class*='InlineSet_item']")), "₽"), 10000);
        let price = await driver.findElement(By.css("div[class*='ProductList_component'] div[class*='InlineSet_item']")).getText();
        assert.equal(price, "59 990 ₽");
    });

    it("Кнопка \"Купить\",", async function () {
        let buy = await driver.findElement(By.css("div[class*='ProductList_component'] div[class*='InlineSet_item'] button[class*='ReactiveButton']"));
        assert.equal(await buy.getText(), "Купить");
        await buy.click();
    });

    it("\"Крестик\" для удаления товара из корзины (страница Корзины)", async function () {
        await driver.wait(until.elementLocated(By.css("table[class*='orders-list']")), 10000);
        await driver.findElement(By.css("svg[class='modify-link-after']")).click();
    });

    it("Сообщение о том что товар был удален", async function () {
        await driver.wait(until.elementLocated(By.css("div[class*='shop-basket-item-service-note']")), 10000);
        let text = await driver.findElement(By.css("div[class*='shop-basket-item-service-note'] > span")).getText();
        assert.equal(text, "Товар был удален из корзины");
    });

    it("Кнопка восстановления удалённого товара", async function () {
        await driver.wait(until.elementTextContains(driver.findElement(By.css("div[class*='item-repair'] > span")), 'Восстановить'), 10000);
        await driver.findElement(By.css("div[class*='item-repair'] > span")).click();
    });

    after(() => driver.quit());
});
