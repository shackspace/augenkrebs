mediator = require 'mediator'
Controller = require 'controllers/base/controller'
User = require 'models/user'
# LoginView = require 'views/login/page_view'
Modal = require 'views/base/modal'

# class ConnectionErrorDialog extends Modal
# 	template: require 'views/dialogs/connection_error_dialog'

# 	save: (event) =>
# 		window.location.reload(true)

module.exports = class AuthenticationController extends Controller
	initialize: ->
		# Login flow events
		# @subscribeEvent 'serviceProviderSession', @serviceProviderSession

		# Handle login
		# @subscribeEvent 'logout', @logout
		# @subscribeEvent 'userData', @userData

		# Handler events which trigger an action

		# Show the login dialog
		# @subscribeEvent '!showLogin', @showLoginView
		# Try to login with a service provider
		# @subscribeEvent '!login', @triggerLogin
		# Initiate logout
		mediator.subscribe '!auth:logout', @logout

		# Determine the logged-in state
		# @getSession()

		#DUMMY
		@publishEvent '!auth:success'

	# Try to get an existing session from one of the login providers
	getSession: =>
		@publishEvent '!io:emit', 'login', null, (user) =>
			if user?
				mediator.user = new User user
				@publishEvent '!auth:success'
			else
				mediator.user = new User()
				@view = new LoginView
					model: mediator.user
				mediator.user.on 'change', =>
					@view.dispose()
					@publishEvent '!io:emit', 'login', mediator.user.toJSON(), (user) =>
						@publishEvent '!auth:success'
		@subscribeEvent '!io:disconnect', ->
			console.log 'disconnected'

			# TODO Since the socket just got disconnected, this will probably
			# show an ugly error page.
			diag = new ConnectionErrorDialog()
			diag.container = '#page-container'
			diag.render()

	logout: =>
		@publishEvent '!io:emit', 'logout', () ->
			console.log 'logged out'
			window.location.reload(true)

