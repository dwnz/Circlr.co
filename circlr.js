var im = require('imagemagick');
var fs = require('fs');

var size = 450;

var details = {};


var inputArray = fs.readFileSync('./pic.jpg');
var filename = new Date().getTime();

im.crop({
  srcData: inputArray,
  width: size,
  height: size,
  quality: 1,
  gravity: "Center",
}, function(err, stdout, stderr){
 	fs.writeFileSync(filename + '.jpg', stdout, 'binary');

 	im.convert([
		filename + '.jpg',
		'-define', 'jpeg:size=' + size + 'x' + size,
		'-thumbnail', size + 'x' + size,
		'-gravity', 'center',
		'-extent', size + 'x' + size,
		'-alpha', 'set',
		'-gravity', 'center',
		'badge_mask.png',
		'-compose', 'DstIn',
		'-composite',
		filename + '.png'
	], function(e, output, error){
			
	});
});