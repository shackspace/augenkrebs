Model = require 'models/base/model'

methodMap =
	'read': 'GET'
	'update': 'POST'

module.exports = class Status extends Model
	url: '/api/status'
	sync: (method, model, options) ->
		type = methodMap[method]

		return null unless type?

		params =
			type: type
			dataType: 'json'
			url: @url

		if not options.data? and method is 'update'
			params.contentType = 'application/json'
			params.data = JSON.stringify model.toJSON()

		# // Pass along `textStatus` and `errorThrown` from jQuery.
		# var error = options.error;
		# options.error = function(xhr, textStatus, errorThrown) {
		# 	options.textStatus = textStatus;
		# 	options.errorThrown = errorThrown;
		# 	if (error) error.apply(this, arguments);
		# };

		xhr = options.xhr = Backbone.ajax _.extend params, options
		return xhr