class PageObjectWeb {
	constructor() {}

	elementDisplayedBy(ele) {
		if (ele.includes('//')) return driver.sleep(3000).waitForElementByXPath(ele, 30000, 'Element not found').elementByXPath(ele).isDisplayed();
		else return driver.sleep(3000).waitForElementByCss(ele, 30000, 'Element not found').elementByCss(ele).isDisplayed();
	}

	clickBy(ele) {
		if (ele.includes('//')) return driver.waitForElementByXPath(ele, 30000, 'Element not found').elementByXPath(ele).click();
		else return driver.waitForElementByCss(ele, 30000, 'Element not found').elementByCss(ele).click();
	}

	fillTextBy(ele, text) {
		if (ele.includes('//')) return driver.sleep(3000).waitForElementByXPath(ele, 30000).elementByXPath(ele).click().clear().sendKeys(text);
		else return driver.sleep(3000).waitForElementByCss(ele, 30000).elementByCss(ele).click().clear().sendKeys(text);
	}

	getTextBy(ele) {
		if (ele.includes('//')) return driver.waitForElementByXPath(ele, 30000).elementByXPath(ele).text();
		else return driver.waitForElementByCss(ele, 30000).elementByCss(ele).text();
	}

	getAttributeBy(ele, att) {
		if (ele.includes('//')) return driver.waitForElementByXPath(ele, 30000).elementByXPath(ele).getAttribute(att);
		else return driver.waitForElementByCss(ele, 30000).elementByCss(ele).getAttribute(att);
	}

	async elementExistBy(ele) {
		let elem = '';
		if (ele.includes('//')) elem = await driver.waitForElementsByXPath(ele, 30000).elementsByXPath(ele);
		else elem = await driver.waitForElementsByCss(ele, 30000).elementsByCss(ele);
		return elem.length > 0 ? true : false;
	}

	async moveToDown(ele) {
		const contexts = await driver.contexts();
		await driver.context(contexts[0]);
		if (ele.includes('//')) await driver.moveToDownXpath(ele).sleep(2000);
		else await driver.moveToDownCss(ele).sleep(2000);
		return driver.context(contexts[1]);
	}
	async moveToUp(ele) {
		const contexts = await driver.contexts();
		await driver.context(contexts[0]);
		if (ele.includes('//')) await driver.moveToUpXpath(ele).sleep(2000);
		else await driver.moveToUpCss(ele).sleep(2000);
		return driver.context(contexts[1]);
	}
}
module.exports = PageObjectWeb;
