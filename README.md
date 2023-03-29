# Floaty Boi

Makes your experience on floatplane.com better.

### Config

1. Run `yarn` or `npm install` to install dependencies
2. Set the correct manifest version in `.env` 
   1. NOTE: Don't commit these changes
   2. Firefox currently uses `2` and Chrome uses `3`


### To run locally with web-ext:

1. Install packages with `yarn` or `npm install`
2. Run `yarn cli dev` or `npm run cli -- dev` to build the extension and run it with web-ext


### To build a zip

1. Ensure the correct manifest version is set in `.env`
2. Run `yarn cli build:zip` to build the extension and create a zip file in the `.cache/zip` folder