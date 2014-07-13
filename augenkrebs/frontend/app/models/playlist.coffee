Model = require 'models/base/model'
Collection = require 'models/base/collection'

module.exports.PlaylistItem = class PlaylistItem extends Model

module.exports.Playlist = class Playlist extends Collection
	model: PlaylistItem
	url: '/api/playlist/'

	parse: (response) ->

		for item, i in response
			item.id = i
		return response