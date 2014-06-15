Controller = require 'controllers/base/controller'
HomePageView = require 'views/home_page_view'
AboutView = require 'views/about_view'

Header = require 'models/header'
HeaderView = require 'views/header_view'

Status = require 'models/status'

module.exports = class HomeController extends Controller
	beforeAction: ->
		super
		headerModel = new Header()
		@reuse 'header', HeaderView,
			region: 'header'
			model: headerModel

	index: ->
		status = new Status()
		setInterval ->
			console.log status
			status.fetch
				contentType: 'json'
				error: ->
					console.log 'nope'
		, 1000

		# status.save {derp: 'herp'}
		@view = new HomePageView
			model: status
			region: 'main'

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
			$.ajax
				type: 'GET'
				url: '/api/play'

		@listenTo @view, 'pause', =>
			console.log 'pause'
			$.ajax
				type: 'GET'
				url: '/api/pause'

		@listenTo @view, 'stop', =>
			console.log 'stop'
			$.ajax
				type: 'GET'
				url: '/api/stop'

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

		@listenTo @view, 'mute', =>

			console.log 'mute'
			status.save
				muted: +(not status.get('muted'))

		@listenTo @view, 'seek', (position) =>
			status.save
					position: position

		@listenTo @view, 'volume', (volume) =>
			status.save
					volume: volume

		@listenTo @view, 'subtitles', (sub) =>
			console.log 'subtitles', sub
			status.save
				subtitle: sub


	about: ->
		@view = new AboutView region: 'main'
