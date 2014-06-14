mediator = require 'mediator'
View = require 'views/base/view'
template = require 'views/templates/footer'

module.exports = class FooterView extends View
  template: template
  container: '#footer-container'
  className: 'footer'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @render
