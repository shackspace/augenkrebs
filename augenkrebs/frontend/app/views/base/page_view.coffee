mediator = require 'mediator'
View = require 'views/base/view'

module.exports = class PageView extends View
  container: '#page-container'
  autoRender: yes