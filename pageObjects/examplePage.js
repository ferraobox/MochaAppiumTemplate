module.exports = class ExamplpePage{

    constructor(driver){   
        this.d = driver;
        this.exampleSelector = '...';
        this.exampleSelector2 = '...';
        this.exampleSelector3 = '...';
    };

    moveToLeft() {
        return this.d
            .execute('mobile: swipe', {direction: 'left'});
    };

    moveToRight() {
        return this.d
            .execute('mobile: swipe', {direction: 'right'});
    };

    moveToDown() {
        return this.d
            .execute('mobile: scroll', {direction: 'down'})
    };
    
    clickElement() {
        return this.d
            .waitForElementByXPath(this.exampleSelector, 20000)
            .elementByXPath(this.exampleSelector)
            .click();
    };

    buttonDisplayed(){
        return this.d.waitForElementByXPath(this.exampleSelector2, 20000).elementByXPath(this.exampleSelector2).isDisplayed();
    };
}
