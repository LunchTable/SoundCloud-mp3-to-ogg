var express = require('express'),
	app = express.createServer(),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    Converter = require('./lib/converter'),
    Track = require('./lib/track'),
    sendMainPage = function (req, res) {
      res.sendfile(__dirname + '/views/main.html')
    };

app.configure(function () {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.logger({
	'format': ':date :method :url :status - :response-time ms'
	}))
	app.use(app.router);

	// Dev
	//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	// Prod
	app.use(express.errorHandler())
});

app.get('/stream/:track_id', function (request, response) {
	var track = Track.create({ id: request.params['track_id'] }),
	converter = Converter.create();

	response.contentType('application/ogg')
	response.header('Access-Control-Allow-Origin', '*')

	track.stream(function (err, trackStream) {
		if (err) {
			request.pause()
			response.end(err)
		} else {
			trackStream.pipe(converter.process.stdin)
			converter.process.stdout.pipe(response)
		}
	})

	request.on('close', function () {
		track.stopStream()
		converter.kill()
	})
})

app.listen(3000)
console.log(new Date, 'mp3 Converter starting')
