require ("chromedriver");
const assert = require('assert');
const { Builder, By, until } = require ("selenium-webdriver");
let driver;

describe("Проверка поиска элементов с разными типами локаторов", () => {
    before(async function () {
        let options = new chrome.Options().addArguments('--disable-notifications');
        driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
        await driver.get("https://moskva.beeline.ru/shop");
    });

    it("Поиск вкладки 'Телефоны'", async function () {
        // ПАВЕЛ: В принципе, driver.get() ждёт полной загрузки страницы. Но, чтобы подстраховаться, можно использовать тогда просто ожидание
        // ПАВЕЛ: самой ссылки "Телефоны". Полезное примечание: wait() также возвращает элемент, поэтому с ним можно работать как и после вызова findElement(): 
        // ПАВЕЛ: кликать, получать текст и т.д. Как раз не успел рассказать в прошлой лекции про ожидания. Но я попросил Александра, он расскажет на следующей лекции :)
        // ПАВЕЛ: Если коротко, то мы ждём, пока какое-то условие не вернёт true в течение какого-то времени (10 сек),
        // ПАВЕЛ: которое мы даём скрипту на выполнение этого условия
        await driver.wait(until.elementLocated(By.css("a[href='/shop/catalog/telefony/']")), 40000).click();

        // ПАВЕЛ: Да, селекторы составлены хорошо!)
        let title = await driver.wait(until.elementLocated(By.css("h1[class*='Heading_h1']")), 10000).getText();
        assert.equal(title, `Смартфоны`);
    });

    it("Инпуты фильтрации 'от' и 'до' (в блоке \"Цена\")", async function () {
        // ПАВЕЛ: Это у вас не инпуты определены) Здесь можно их максимально точно определить, найти оба и обращаться по индексу
        let priceFilters = await driver.findElements(By.css("div[class*='RangeFilter'] input"));
        let priceFrom = priceFilters[0];
        let priceTo = priceFilters[1];
    });

    it("\"Показать все\" в разделе фильтра \"Производители\"", async function () {
        // ПАВЕЛ: Лучше избегать какой-то зависимости от порядкового номера в данном случае. Тоже немного поменяем)
        let showAllButton = await driver.wait(until.elementLocated(By.xpath("//div[./span[text()='Производитель']]/following-sibling::*[contains(@class,'ShowAllButton')]")), 10000);
        let title = await showAllButton.getText();
        await showAllButton.click();
        assert.equal(title, 'Показать все');
    });

    it("Один из чекбоксов производителей, например, \"Apple\”", async function () {
        // ПАВЕЛ: У вас тут были два разных локатора, которые обнаруживают один и тот же элемент) Первый хороший, его и оставим, только сократим
        await driver.wait(until.elementLocated(By.css("div[class*='FiltersOption_container'] input[type='checkbox'][name*='apple']")), 20000).click();
        await driver.wait(until.elementIsSelected(driver.findElement(By.css("div[class*='FiltersOption_container'] input[type='checkbox'][name*='apple']"))), 20000);
    });

    it("Элемент сортировки по цене", async function () {
        // ПАВЕЛ: Опять же, лучше сделать селектор более универсальным, зацепившись, например, за текст элемента сортировки)
        await driver.wait(until.elementLocated(By.xpath("//span[contains(@class,'FilterTabs_content') and text()=' Цене']")), 10000);
    });

    it("Элемент наименования товара в каталоге", async function () {
        let name = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'ProductCard_header') and contains(string(), 'Apple')]")), 40000).getText();
        assert.equal(name, "Смартфон Apple iPhone 11 64GB Чёрный");
    });

    it("Значение цены товара", async function () {
        // ПАВЕЛ: Хитро придумано!) Но сложно. Наверное, лучше придумать что-то вроде:
        let prices = await driver.wait(until.elementsLocated(By.xpath('//div[contains(@class, "ProductList_component")][1]//div[contains(@class, "Heading_h3")]//div[starts-with(@class, "InlineSet_item") and not(./span) and text()]')), 10000);
    });

    it("Кнопка \"Купить\",", async function () {
        // ПАВЕЛ: Да, неплохо) Можно попробовать ещё с таким xpath: //div[starts-with(@class, "BuyButtonLayout_wrapper")]//button
        let buy = await driver.findElements(By.css("div[class*='ProductList_component'] div[class*='InlineSet_item'] button[class*='ReactiveButton']"));
        let num = await buy.length / 2;
        assert.equal(await buy[num].getText(), "Купить");
        await buy[num].click();
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
        await driver.wait(until.elementLocated(By.css("div[class*='item-repair'] > span")), 10000).click();
    });

    after(() => driver.quit());
});
