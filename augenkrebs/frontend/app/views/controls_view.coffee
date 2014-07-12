View = require 'views/base/view'

module.exports = class ControlsView extends View
	autoRender: true
	template: require 'views/templates/controls'
	className: ''

	events:
		'submit form': 'open'
		'click #play': 'play'
		'click #pause': 'pause'
		'click #stop': 'stop'
		'click #next': 'next'
		'click #previous': 'previous'
		'click #forward': 'forward'
		'click #fast-forward': 'fastForward'
		'click #backward': 'backward'
		'click #fast-backward': 'fastBackward'
		'click #muted': 'mute'
		'change #subtitles': 'subtitles'
		'change #audiotrack-list': 'audiotrackList'
		'change #subtitle-delay': 'subtitleDelay'
		'change #audio-delay': 'audioDelay'


	open: (event) =>
		event.preventDefault()
		@trigger 'open', @$('#url').val()

	play: (event) =>
		event.preventDefault()
		@trigger 'play'

	pause: (event) =>
		event.preventDefault()
		@trigger 'pause'

	stop: (event) =>
		event.preventDefault()
		@trigger 'stop'

	next: (event) =>
		event.preventDefault()
		@trigger 'next'

	previous: (event) =>
		event.preventDefault()
		@trigger 'previous'

	forward: (event) =>
		event.preventDefault()
		@trigger 'forward'

	fastForward: (event) =>
		event.preventDefault()
		@trigger 'fast-forward'

	backward: (event) =>
		event.preventDefault()
		@trigger 'backward'

	fastBackward: (event) =>
		event.preventDefault()
		@trigger 'fast-backward'

	mute: (event) =>
		event.preventDefault()
		@trigger 'mute'

	subtitles: (event) =>
		@trigger 'subtitles', $('#subtitles option:selected').val()

	subtitleDelay: (event) =>
		delay =  parseFloat @$('#subtitle-delay').val()
		@trigger 'subtitle-delay', delay unless isNaN delay

	audiotrackList: (event) =>
		@trigger 'audiotrack-list', $('#audiotrack-list option:selected').val()

	audioDelay: (event) =>
		delay =  parseFloat @$('#audio-delay').val()
		@trigger 'audio-delay', delay unless isNaN delay

	render: =>
		super
		posSlider = @$('#position').slider
			min: 0
			max: 3600
			step: 1
			handle: 'custom'
			enabled: false

		slideEventHandler = (event) =>
			@trigger 'seek', event.value

		posSlider.on 'slideStop', slideEventHandler
		posSlider.on 'slide', slideEventHandler

		volSlider = @$('#volume').slider
			min: 0
			max: 150
			step: 1
			# handle: 'custom'
			# enabled: false

		volEventHandler = (event) =>
			@trigger 'volume', event.value

		volSlider.on 'slideStop', volEventHandler
		volSlider.on 'slide', volEventHandler

	listen:
		'change:is_playing model': 'changeIsPlaying'
		'change:length model': 'changeLength'
		'change:position model': 'changePosition'
		'change:volume model': 'changeVolume'
		'change:muted model': 'changeMuted'
		'change:subtitle_list model': 'changeSubtitleList'
		'change:subtitle model': 'changeSubtitle'
		'change:subtitle_delay model': 'changeSubtitleDelay'
		'change:audiotrack_list model': 'changeAudiotrackList'
		'change:audiotrack model': 'changeAudiotrack'
		'change:audio_delay model': 'changeAudioDelay'
		


	changeIsPlaying: (model, field) =>

	changeLength: (model, length) =>
		slider = @$ '#position'
		if length is -1
			slider.slider 'disable'
		else
			slider.slider 'enable' unless slider.slider 'isEnabled'
			slider.slider 'setAttribute', 'max', length

	changePosition: (model, pos) =>
		return if pos is -1
		slider = @$ '#position'
		slider.slider 'setValue', pos

	changeVolume: (model, vol) =>
		slider = @$ '#volume'
		slider.slider 'setValue', vol

	changeMuted: (model, muted) =>
		if muted
			$('#muted span').removeClass 'glyphicon-volume-up'
			$('#muted span').addClass 'glyphicon-volume-off'
		else
			$('#muted span').removeClass 'glyphicon-volume-off'
			$('#muted span').addClass 'glyphicon-volume-up'

	changeSubtitleList: (model, list) =>
		subtitles = $('#subtitles')
		subtitles.empty()
		for sub in list
			subtitles.append $ '<option>',
				value: sub
				text: sub

	changeSubtitle: (model, sub) =>
		$('#subtitles option:selected').prop('selected', false)
		$('#subtitles option[value="'+sub+'"]').prop('selected', true)

	changeSubtitleDelay: (model, delay) =>
		$('#subtitle-delay').val delay

	changeAudiotrackList: (model, list) =>
		audiotracks = $('#audiotrack-list')
		audiotracks.empty()
		for track in list
			audiotracks.append $ '<option>',
				value: track
				text: track

	changeAudiotrack: (model, track) =>
		$('#audiotrack-list option:selected').prop('selected', false)
		$('#audiotrack-list option[value="'+track+'"]').prop('selected', true)

	changeAudioDelay: (model, delay) =>
		$('#audio-delay').val delay
