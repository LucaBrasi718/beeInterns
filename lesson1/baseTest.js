require("chromedriver");
const assert = require("assert");
const {Builder, Key, By, until} = require("selenium-webdriver");
let driver;

describe("Checkout Google", () => {
    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    it("Search on Google: Title", async function () {
        await driver.get("https://google.com");
        await driver.findElement(By.xpath("//input[@name='q']")).click();
        await driver.findElement(By.xpath("//input[@name='q']")).sendKeys('sesh', Key.RETURN);
        await driver.wait(until.elementLocated(By.id('rcnt')), 10000);
        await driver.findElement(By.xpath("//a[h3 = 'TeamSESH — Home']")).click();
        let title = await driver.getTitle();
        assert.equal(title, `TeamSESH — Home`);
    });

    after(() => driver.quit());
});
