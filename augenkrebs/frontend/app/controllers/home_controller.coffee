Controller = require 'controllers/base/controller'
HomePageView = require 'views/home_page_view'
AboutView = require 'views/about_view'
ControlsView = require 'views/controls_view'
PlaylistView = require 'views/playlist_view'

Header = require 'models/header'
HeaderView = require 'views/header_view'

Status = require 'models/status'
{Playlist} = require 'models/playlist'

module.exports = class HomeController extends Controller
	beforeAction: ->
		super
		headerModel = new Header()
		@reuse 'header', HeaderView,
			region: 'header'
			model: headerModel

	index: ->
		status = new Status()
		playlist = new Playlist()
		setInterval ->
			status.fetch
				contentType: 'json'
				error: ->
					console.log 'nope'
			playlist.fetch
				contentType: 'json'
				error: ->
					console.log 'nope'
		, 1000

		# status.save {derp: 'herp'}
		@view = new HomePageView
			model: status
			region: 'main'

		@view.subview 'controls', new ControlsView
			model: status
			region: 'controls'

		@view.subview 'playlist', new PlaylistView
			collection: playlist
			region: 'playlist'

		@listenTo @view.subview('playlist'), 'sort-stop', (model, newIndex) ->
			$.ajax
				url: '/api/playlist/' + newIndex
				type: 'PUT'
				data: JSON.stringify
					url: model.get 'url'
				contentType: 'application/json'
				dataType: 'json'

		@listenTo @view, 'open', (url) =>
			console.log 'open', url
			$.ajax
				url: '/api/open'
				type: 'POST'
				data: JSON.stringify
					url: url
				contentType: 'application/json'
				dataType: 'json'

		@listenTo @view, 'append', (url) =>
			console.log 'append', url
			$.ajax
				url: '/api/playlist/'
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

		@listenTo @view, 'subtitle-delay', (delay) =>
			console.log 'subtitle-delay', delay
			status.save
				subtitle_delay: delay

		@listenTo @view, 'audiotrack-list', (track) =>
			console.log 'audiotrack', track
			status.save
				audiotrack: track

		@listenTo @view, 'audio-delay', (delay) =>
			console.log 'audio-delay', delay
			status.save
				audio_delay: delay


	about: ->
		@view = new AboutView region: 'main'
