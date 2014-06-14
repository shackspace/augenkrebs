Controller = require 'controllers/base/controller'
IconView = require 'views/icon_view'



module.exports = class HomeController extends Controller

	icon: ->
		@view = new IconView region: 'main'
