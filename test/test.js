var img2rgb = require('../');

img2rgb('./cat.png', 'rgb565', function(err, result) {
	if(err) console.log(err);
	else {
		console.log(result.length);
	}
});