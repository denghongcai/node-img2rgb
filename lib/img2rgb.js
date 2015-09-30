'use strict'

var getPixels = require('get-pixels');
var mmm = require('mmmagic');
var Magic = mmm.Magic;

function img2rgb(path, format, cb) {
	format = format.toLowerCase();
	var magic  = new Magic(mmm.MAGIC_MIME_TYPE);
	var detect = null;
	if(path instanceof Buffer) {
		detect = magic.detect;
	}
	else {
		detect = magic.detectFile
	}
	detect.call(magic, path, function(err, result) {
		if(err) {
			return cb(err);
		}
		getPixels(path, result, function(err, pixels) {
			if(err) {
				return cb(err);
			}
			var shape = pixels.shape.slice();
			switch(format) {
				case 'rgb565':
					var buffer = new Buffer(shape[0] * shape[1] * 2);
					for(var i = 0; i < shape[0]; i++) {
						for(var j = 0; j < shape[1]; j++) {
							var rgb = [];
							for(var k = 0; k < 3; k++) {
								rgb[k] = pixels.get(i, j, k);
							}
							var rgb565 = ((rgb[0] >> 3) << 11) | ((rgb[1] >> 2) << 5) | (rgb[2] >> 3);
							buffer.writeUInt16BE(rgb565, i * j * 2);
						}
					}
					return cb(null, buffer);
				default:
					return cb(new Error('unknown format'));
			}
		});
	});
}

module.exports = img2rgb;