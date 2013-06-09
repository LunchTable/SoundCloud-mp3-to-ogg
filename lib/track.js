var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    config = require('./config.js');

var optionsForRequest = function (trackId) {
	return {
		host: 'api.soundcloud.com',
		path: '/tracks/' + trackId + '/stream?client_id=' + config.soundcloud_api_key,
		headers: {
			'User-Agent': 'node.js'
		}
	}
}

var optionsFromLocation = function (location) {
	return {
		host: location.host,
		path: location.pathname + location.search,
		headers: {
			'User-Agent': 'node.js'
		}
	}
}

var Track = function (attributes, image) {
	this.attributes = attributes
	this.image = image
}

Track.create = function (attributes, files) {
	return new Track (attributes, files && files.image)
}

Track.prototype = {
	stream: function (fn) {
		var self = this
		var req = http.get(optionsForRequest(this.id()), function (res) {
			if (!res.headers.location) {
				fn(["No stream url for track", self.id()].join(" "))
			} else {
				var location = url.parse(res.headers.location)
				self.request = http.get(optionsFromLocation(location), function (res) {
					fn(null, res)
				})
				self.request.on('error', function(err) {
					console.log(err);
				})
			}
		})
		req.on('error', function(err) {
			console.log(err);
		})
	},

	stopStream: function () {
		this.request && this.request.destroy()
	},

	id: function () {
		return this.attributes.id
	},

	asJSON: function () {
		return {
			id: this.id(),
		}
	},

}

module.exports = Track
