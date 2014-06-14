mediator = require 'mediator'
View = require 'views/base/view'

module.exports = class HeaderView extends View
	template: require 'views/templates/header'
	id: 'header'
	tagName: 'nav'
	className: 'navbar navbar-default navbar-fixed-top'
	autoRender: true

	initialize: ->
		super
		@subscribeEvent 'loginStatus', @render
		@subscribeEvent 'startupController', @render

	getTemplateData: =>
		data = super
		data.user =
			username: 'DER USER'
		return data
