View = require 'views/base/view'

module.exports = class HomePageView extends View
	autoRender: true
	template: require 'views/templates/home'
	className: 'home-page container'

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

	render: =>
		super
		slider = @$('#position').slider
			min: 0
			max: 3600
			step: 1
			handle: 'custom'
			enabled: false

		slider.on 'slide', (event) =>
			@trigger 'seek', event.value

	listen:
		'change:is_playing model': 'changeIsPlaying'
		'change:length model': 'changeLength'
		'change:position model': 'changePosition'


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

