SiteView = require 'views/site_view'


module.exports = class Controller extends Chaplin.Controller
	# Compositions persist stuff between controllers.
	# You may also persist models etc.
	beforeAction: ->
		@reuse 'site', SiteView