# Floaty Boi

Makes your experience on Floatplane better by adding saved video progress, dark mode, & a watchlist directly integrated into the floatplane.com site.

<img width="100" alt="icon" src="https://user-images.githubusercontent.com/129204914/228607557-a53c01ad-6f3e-41b9-8da8-dea61d1cac8e.png">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L8JWKYY)

## IMPORTANT
Not affiliated with Linus Media Group or Floatplane Inc. in any way. **Do NOT contact Floatplane support for issues without trying to disable the extension first.**


![Screenshot 2023-03-31 111035](https://user-images.githubusercontent.com/129204914/229196249-a3ed9cb0-d674-4f0d-82ec-8c2dbbc68de9.png)


## Installation
### Firefox
Get it on [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/floaty-boi)!

### Chrome, Edge, Opera GX
Get it on the [Chrome Web Store](https://chrome.google.com/webstore/detail/floaty-boi/fjcnijlonalklaiamjooajkkfnijcnjk)!


Manifest v2 and v3 build are also available on the releases page of this repo.


## Development

### Config

1. Run `yarn` or `npm install` to install dependencies
2. Set the correct manifest version in `.env` 
   1. NOTE: Don't commit these changes
   2. Firefox currently uses `2` and Chrome uses `3`


### To run / debug locally with web-ext:

1. Install packages with `yarn` or `npm install`
2. Run `yarn cli dev` or `npm run cli -- dev` to build the extension and run it with web-ext
   1. You can pass the `-b firefox` flag to run in Firefox, but make sure you set the MANIFEST_VERSION to 2 first!


### To build a zip

1. Ensure the correct manifest version is set in `.env`
2. Run `yarn cli build:zip` to build the extension and create a zip file in the `.cache/zip` folder



### Contributing

While we wait to get things sorted with the relevant webstores, this project will not be accepting contributions or feature requests. This will hopefully change in the near future!
