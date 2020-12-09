# QA Automation framework for ONE

This project was think for QAs with less technical Knowledge, for someone can add test and anyone of the team can download the repository and run the tests in anywhere.

Is integrated with JIRA and Jenkins, the reports are reported them in Junit and HTML

### Prerequisites

- Put this repo as a npm package dependence.

- Execute the following lines:

```
npm install

```

- You should have installed Node on your system, you can check it with:

```
Node --version
```

### Installing

```
node 12

npm install

brew install

github account to the project
```

### Responsible

Carlos Ferrao <carlos.ferrao@.com

## Running the tests

### Running automated tests for apps

- You need to have the emulators/simulators below installed:
  \*\* xCode simulators:
  ![Preferences](/readmeImages/xcodePreferences.png)
  ![Simulators](/readmeImages/xcodeSimulators.png)

  \*\* androidStudio emulators:
  ![SDK](/readmeImages/androidStudioSDK.png)
  ![Emulators](/readmeImages/androidStudioEmulators.png)

- You need to have the following ports enabled:
  ** Open a terminal instance and execute: appium -p 4723 for android and appium -p 4725 for iOS.
  ** For android you need to execute runPixelXL as well.

- Find here some examples to run automated tests:

```
npx wgautomationapps -a ${company} -d Pixel2XL -t ${testPath} -s ${server}

```

- You can find more documentation about parameters you can use to run a test executing the command lines below in a terminal:

```
npx wgautomationapps -h
```

## Logs & Reports

- There are different kind of logs and reports:

  - Console logs.
  - Reports: the reports are stored in the folder "reports", where you will find two different format files, with the name

  [apps]'Company-TestResults-today.html'
  and here you can see all the screenshots that did.

- Execute the next line in the folders project to open the reports folder and check whether test fails:

```
 open ./reports

```

## Deployment

These tests will be run in the jenkins pipeline as a new stage of this.

## Built With

- We have two core packages with the arquitecture and configuration of the projects:
  - wgautomationapps

### Web is built with

- [Mocha](https://mochajs.org/) - Testing mocha framework
- [Protractor](https://https://www.protractortest.org/) - End to end javascript framework

### Apps is built with

- [Appium](https://http://appium.io/)
- [xCode](https://https://developer.apple.com/xcode/)
- [androidStudio](https://https://https://developer.android.com/studio/)

## Authors

- **Carlos Ferrao** - _Initial work_
