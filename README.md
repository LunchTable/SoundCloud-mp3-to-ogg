SoundCloud MP3 -> OGG streamer
==============================

Enables SoundCloud streams to be played with HTML5 `<audio>` element in OGG-supporting browsers like Firefox. Converts mp3s to oggs on the fly.

Based off of [Canvas.fm](https://github.com/olivernn/canvas.fm), pruned and with a little more error-handling thrown in.

## Installation

* Install dependencies `npm install .`
* Ensure ffmpeg is installed `ffmpeg`
* Edit [config.json](config.json) with your SoundCloud API key
* Run the app `node app.js`

## Known Limitations

At its current state, no duration information gets passed along to the browser, making it impossible to skip ahead in a track. Because of this, we recommend still putting the SoundCloud mp3 `<source>` first, so that mp3-supporting browser users don't experience this shortcoming.

## Example use

```HTML
<audio controls="controls" preload="auto" id="boombox">
	<source src="http://api.soundcloud.com/tracks/73389892/stream?client_id=YOUR_CLIENT_ID" type="audio/mpeg">
	<source src="http://example.com:3000/stream/73389892" type="audio/ogg">
</audio>
```
