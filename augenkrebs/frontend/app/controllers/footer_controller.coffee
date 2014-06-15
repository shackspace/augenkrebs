Controller = require 'controllers/base/controller'
mediator = require 'mediator'
FooterView = require 'views/footer_view'

module.exports = class FooterController extends Controller
  initialize: ->
    super
    @view = new FooterView()
