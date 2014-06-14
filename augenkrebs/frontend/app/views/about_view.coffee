View = require 'views/base/view'

module.exports = class AboutView extends View
	autoRender: true
	template: require 'views/templates/about'
	className: 'about-page container'
