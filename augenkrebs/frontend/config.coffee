exports.config =
	paths:
		watched: [
			'app'
		]
	files:
		javascripts:
			joinTo:
				'js/app.js': /^app(\/|\\)(?!vendor)/
				'js/vendor.js': /^(?!app)/
		stylesheets:
			joinTo:
				'css/app.css'
		templates:
			joinTo: 'js/app.js'

	plugins:
		static_jade:
			extension: ".static.jade"
	overrides:
		production:
			optimize: true
			sourceMaps: false
			plugins:
				autoReload:
					enabled: false
				cleancss:
					keepSpecialComments: 0