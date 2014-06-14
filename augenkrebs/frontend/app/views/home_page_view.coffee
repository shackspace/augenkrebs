View = require 'views/base/view'

module.exports = class HomePageView extends View
	autoRender: true
	template: require 'views/templates/home'
	className: 'home-page container'
