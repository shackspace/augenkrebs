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
		@$('#position').slider
			min: 0
			max: 3600
			step: 1
			handle: 'custom'