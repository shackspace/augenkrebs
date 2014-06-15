Model = require 'models/base/model'

module.exports = class Header extends Model
	defaults:
		items: [
			{href: '/admin', title: 'Admin'},
		]
