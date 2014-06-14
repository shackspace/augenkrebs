Controller = require 'controllers/base/controller'
HomePageView = require 'views/home_page_view'
AboutView = require 'views/about_view'

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

		@listenTo @view, 'open', (url) =>
			console.log 'open', url
			$.ajax
				url: '/api/open'
				type: 'POST'
				data: JSON.stringify
					url: url
				contentType: 'application/json'
				dataType: 'json'

		@listenTo @view, 'play', =>
			console.log 'play'

		@listenTo @view, 'pause', =>
			console.log 'pause'

		@listenTo @view, 'stop', =>
			console.log 'stop'

		@listenTo @view, 'next', =>
			console.log 'next'

		@listenTo @view, 'previous', =>
			console.log 'previous'

		@listenTo @view, 'forward', =>
			console.log 'forward'

		@listenTo @view, 'fast-forward', =>
			console.log 'fast-forward'

		@listenTo @view, 'backward', =>
			console.log 'backward'

		@listenTo @view, 'fast-backward', =>
			console.log 'fast-backward'


	about: ->
		@view = new AboutView region: 'main'
