Controller = require 'controllers/base/controller'
HomePageView = require 'views/home_page_view'

Header = require 'models/header'
HeaderView = require 'views/header_view'


module.exports = class HomeController extends Controller
	beforeAction: ->
		super
		headerModel = new Header()
		@reuse 'header', HeaderView,
			region: 'header'
			model: headerModel

	index: ->
		@view = new HomePageView region: 'main'
