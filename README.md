
# QA Automation

Appium + Mocha - Junit report - Html report - Jira and mail integration - Parallel execution - Ready for screenshot testing

This project was think for QAs with less technical Knowledge, for someone can add test and anyone of the team can download the repository and run the tests in anywhere.

Is integrated with JIRA and Jenkins, the reports are reported them in Junit and HTML

## Getting Started

Download the repository with git on your local machine for development and testing purposes

### Prerequisites

You should have installed the Node on your system, you can check it with:

```
Node --version
```

### Installing

After to download repository you should install appium

```
npm install -g appium
```

After that you can check if your appium server is installed correctly with this feature

```
npm install -g appium-doctor
```

If you execute in your terminal 

```
appium-doctor
```

This feature say you if you need solve some problem or add some configuration. Then into repository folder you should execute:

```
npm install
```
This install all dependencies of project.

## Running the tests

For to run the automated tests you should go to the directory and execute this command:

```
node runner.js -d iphoneX
```
For view all parameters and features of runner, you can execute:

```
node runner.js -h
```
### Break down into end to end tests

You can reveive email when the test execution fail, and you can parametrice it, if you want open issues on JIRA, or compare screenchots for expects of test..


* [Node](https://nodejs.org/en/) - 
* [Appium](http://appium.io/) - 
* [Mocha](https://mochajs.org/) - 


## Author

* **Carlos Ferrao** - *Initial work* - 

