# PyCon US Mobile

This application provides on-site tools for PyCon US Attendees, Sponsors,
and Staff!

## Table of Contents
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [App Preview](#app-preview)
- [Changing Target Server](#changing-target-server)
- [Deploying](#deploying)
  - [Progressive Web App](#progressive-web-app)
  - [Android](#android)
  - [iOS](#ios)


## Getting Started

* [Download the installer](https://nodejs.org/) for Node LTS.
* Install the ionic CLI globally: `npm install -g ionic`
* Clone this repository: `git clone https://github.com/psf/pycon-us-mobile.git`.
* Run `make install` from the project root.
* Run `make serve` in a terminal from the project root.
> [!Note]
> By default we serve the local development URLs. You can run `ionic serve --configuration=production` to run against the production sites' data.
> See [environment.ts](src/environments/environment.ts) and [environment.prod.ts](src/environments/environment.prod.ts) to adjust the URLs manually.
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
