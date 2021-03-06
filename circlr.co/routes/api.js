var im = require('imagemagick');
var fs = require('fs');
var path = require('path');


exports.index = function(req, res){
	 res.render('api', { title: 'Express' });
};

exports.count = function(req, res){
	var tmpPath = path.join(__dirname, '../public/tmp/');

	fs.readdir(tmpPath, function(err, files){
		var fileCount = (files.length - 1) / 2;
		res.send(fileCount.toString());
	});
};

exports.view = function(req,res){
	var tmpPath = path.join(__dirname, '../public/tmp/');

	fs.readFile(
		path.join(tmpPath, req.param('image')),
		function(err, data){
			res.set('Content-Type','image/png');
			res.send(data);
		}
	);
};

exports.circle = function  (req, res) {
	var tmpPath = path.join(__dirname, '../public/tmp/');

	var size = req.param('size');
	var gravity = req.param('gravity');

	if(size < 1 || size > 1000) {
		size = 500;
	}

	if(gravity !== "Center" && gravity !== "North"){
		gravity = "Center";
	}

	var file = req.files.image;

	if(file.size > 10485760){
		res.status(413);
		res.send("File too big. Keep it under 10mb.");
		return;
	}

	if(file.type !== 'image/jpg' && file.type !== 'image/jpeg'){
		res.status(406);
		res.send("Invalid file type. Has to be a JPG file. The file you uploaded is a " + file.type);
		return;
	}

	var fileStream  = fs.readFileSync(file.path);
	var filename = new Date().getTime().toString();

	im.crop({
		srcData: fileStream,
		width: size,
		height: size,
		quality: 100,
		gravity: gravity,
		format: 'jpg'
	}, 
	function(err, stdout, stderr){
		fs.writeFileSync(path.join(tmpPath, filename + ".jpg"), stdout, 'binary');

		im.convert(
			[
				path.join(tmpPath, filename + ".jpg"),
				'-define', 'jpeg:size=' + size + 'x' + size,
				'-thumbnail', size + 'x' + size,
				'-gravity', 'center',
				'-extent', size + 'x' + size,
				'-alpha', 'set',
				'-gravity', 'center',
				path.join(tmpPath, 'badge_mask.png'),
				'-compose', 'DstIn',
				'-composite',
				path.join(tmpPath, filename + '.png')
			], 
			function(e, output, error){
				res.redirect('/api/view/' + filename + '.png');
			}
		);
	});
}