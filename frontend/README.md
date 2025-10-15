# ConsentWidget

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Setup Development environment

Run the following commands to setup a suitable development environment

These would ensure the built widget is installed as a dependency for the main development environment of the example app that uses the widget

```bash
# Install Dependencies, correct node version
nvm use && npm ci

npm run build:lib

cd dist/apicuron-consent/
npm link

cd ../..
npm link apicuron-consent

```

After these steps you'll be able to run the application using 
```bash
npm run watch:app
```

### Development server

Run `npm run watch:app` This commands concurrently runs both the library build, the app build and the tailwind watch command for the library's embedded styles

## Build

Run `npm run build:lib` to build the library along with the associated stylesheet
