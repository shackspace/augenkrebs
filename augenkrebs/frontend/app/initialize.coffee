Application = require 'application'
routes = require 'routes'

# Initialize the application on DOM ready event.
$ ->
  new Application {
    title: 'augenkrebs',
    controllerSuffix: '_controller',
    routes
  }