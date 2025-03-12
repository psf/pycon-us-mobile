# PyCon US Mobile

This application provides on-site tools for PyCon US Attendees, Sponsors,
and Staff!

## Table of Contents
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [App Preview](#app-preview)
- [Deploying](#deploying)
  - [Progressive Web App](#progressive-web-app)
  - [Android](#android)
  - [iOS](#ios)


## Getting Started

* [Download the installer](https://nodejs.org/) for Node LTS.
* Install the ionic CLI globally: `npm install -g ionic`
* Clone this repository: `git clone https://github.com/psf/pycon-us-mobile.git`.
* Run `npm install` from the project root.
* Run `ionic serve` in a terminal from the project root.
* Profit. :tada:

> [!Note]
> See [How to Prevent Permissions Errors](https://docs.npmjs.com/getting-started/fixing-npm-permissions) if you are running into issues when trying to install packages globally._

## Contributing

See [CONTRIBUTING.md](https://github.com/ionic-team/ionic-conference-app/blob/master/.github/CONTRIBUTING.md) :tada::+1:

## Deploying

### Progressive Web App

1. Un-comment [these lines](https://github.com/ionic-team/ionic2-app-base/blob/master/src/index.html#L21)
2. Run `ionic build --prod`
3. Push the `www` folder to your hosting service

### Android

1. Run `ionic cordova run android --prod`

### iOS

1. Run `ionic cordova run ios --prod`


## Building for deployment

1. Bump versions and build numbers in [android/app/build.gradle](android/app/build.gradle) and [ios/App/App.xcodeproj/project.pbxproj](ios/App/App.xcodeproj/project.pbxproj) like [this](https://github.com/psf/pycon-us-mobile/commit/d2080c14ff04f5f443981f46a4ce3a8f22173413).
1. Run `npm run capsync` to build production application bundle, generate a live updates manifest, and sync ios/android workspaces
1. Run `npx cap open ios` to open XCode, Product > Archive to build the image, Distribute App > [App Store Connect](https://appstoreconnect.apple.com/) to upload
1. Run `npx cap open android` to open Android Studio, Build > Generate Signed App Bundle / APK, Android App Bundle > Next, Select Key > Next, choose release variant > Next, locate app bundle, login to [Play Console](https://play.google.com/console) to upload
