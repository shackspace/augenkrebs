module.exports = class View extends Chaplin.View
	# Precompiled templates function initializer.
	getTemplateFunction: ->
		@template

	getTemplateData: ->
		data = super()
		data.moment = moment
		return data
