View = require 'views/base/view'

class ItemView extends View
	template: require 'views/templates/playlist_item'
	tagName: 'tr'


module.exports = class PlaylistView extends View
	autoRender: true
	template: require 'views/templates/playlist'
	className: ''


	render: =>
		super
		@collectionView = new Backbone.CollectionView
			el: @$ "table"
			modelView: ItemView
			collection: @collection
			sortable: true
		@listenTo @collectionView, 'sortStop', (model, newIndex) =>
			@trigger 'sort-stop', model, newIndex

		@collectionView.render()
		# myCollectionView.setSelectedModel( employeeCollection.first() );
		# @$('table').sortable
		# 	containerSelector: 'table'
		# 	itemPath: '> tbody'
		# 	itemSelector: 'tr'
		# 	placeholder: '<tr class="placeholder"/>'
		# 	onDrop: ($item, container, _super) ->
		# 		console.log $item
		# 		_super($item, container)