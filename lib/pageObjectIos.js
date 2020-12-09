const PageObjectApp = require('./pageObjectApp');
module.exports = class PageObjectIos extends PageObjectApp {
	constructor() {
		super();
	}
	// * Click element

	elementDisplayedBy(ele) {
		if (ele.includes('//')) return super.elementDisplayedByXPath(ele);
		else return super.elementDisplayedByAccessibilityId(ele);
	}

	clickBy(ele) {
		if (ele.includes('//')) return super.clickByXPath(ele);
		else return super.clickByAccessibilityId(ele);
	}

	fillTextBy(ele, text) {
		if (ele.includes('//')) return super.fillTextByXPath(ele, text);
		else return super.fillTextByAccessibilityId(ele, text);
	}

	getAttributeBy(ele, att) {
		if (ele.includes('//')) return super.getAttributeByXPath(ele, att);
		else return super.getAttributeByAccessibilityId(ele, att);
	}

	elementExistBy(ele) {
		if (ele.includes('//')) return super.elementExistByXpath(ele);
		else return super.elementExistByAccessibilityId(ele);
	}

	//move to methods

	moveToUp(ele) {
		if (ele.includes('//')) return super.moveToUpXpath(ele);
		else return super.moveToUpToAid(ele);
	}
	moveToDown(ele) {
		if (ele.includes('//')) return super.moveToDownXpath(ele);
		else return super.moveToDownToAid(ele);
	}

	// getElementSize
	getElementSize(ele) {
		if (ele.includes('//')) return super.getSizeByXPath(ele);
		else return super.getSizeByAccessibilityId(ele);
	}

	// getElementSize
	getElementLocation(ele) {
		if (ele.includes('//')) return super.getLocationByXPath(ele);
		else return super.getLocationByAccessibilityId(ele);
	}
};
