Jekyll Vue Project
==================
Jekyll site with Vue for client side JavaScript.

* Clone this repo
* Run `yarn install`
* Run `bundle`
* Run `yarn start` to build front end dependencies
* Run `bundle exec jekyll build`

This project is in a very rough state - but it is a proof of concept.

In particular the build process is less than ideal. The Jekyll build should be integrated into the webpack build - ideally, Jekyll should build static resources first so that the Webpack development server can be used.
