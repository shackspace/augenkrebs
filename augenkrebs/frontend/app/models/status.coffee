Model = require 'models/base/model'

methodMap =
	'read': 'GET'
	'update': 'POST'
	'create': 'POST'
	'patch': 'POST'

module.exports = class Status extends Model
	url: '/api/status'
	sync: (method, model, options) ->
		type = methodMap[method]
		return null unless type?

		params =
			type: type
			dataType: 'json'
			url: @url
		if type is 'POST'
			params.contentType = 'application/json'
			params.data = JSON.stringify options.attrs or model.toJSON(options)
		# // Pass along `textStatus` and `errorThrown` from jQuery.
		# var error = options.error;
		# options.error = function(xhr, textStatus, errorThrown) {
		# 	options.textStatus = textStatus;
		# 	options.errorThrown = errorThrown;
		# 	if (error) error.apply(this, arguments);
		# };

		xhr = options.xhr = Backbone.ajax _.extend params, options
		return xhr

	save: (fields, options) =>
		@writeLock = true
		super fields,
			patch: true
			complete: =>
				@writeLock = false

	fetch: (options) =>
		return if @writeLock
		super options

	isNew: -> false
