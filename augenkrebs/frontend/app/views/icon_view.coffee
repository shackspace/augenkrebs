View = require 'views/base/view'

module.exports = class IconView extends View
	autoRender: true
	template: require 'views/templates/icon'
	className: 'icon-page container'
