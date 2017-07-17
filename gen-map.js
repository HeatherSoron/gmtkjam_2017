#!/usr/bin/node

// Part of a game jam toolchain + HTML5 engine created by Ethan "Soron" Kaminski. MIT license (c) 2017, see <https://github.com/ethankaminski/macej> for the full project

// as of July 16 2017, this file has not yet been pushed to the Github repo - but it will be in a few days

var getPixels = require('get-pixels');
var fs = require('fs');

var mapFiles = fs.readdirSync('./data').filter(name => name[0] != '.' && name.split('.').pop() == 'png' && name.match(/^\d+/));
mapFiles.forEach(function(file) {
	var levelNumber = file.replace(/^(\d+).*$/, '$1');
	getPixels('./data/' + file, function(err, pixels) {
		var mappingData = fs.readFileSync('./data/tilemap.txt').toString();
		var tiles = {};
		mappingData.split("\n").forEach(function(line) {
			var comp = line.split(/\s+/);
			tiles[comp[0]] = comp[1];
		});

		function triad(x,y) {
			return [0,1,2].map(c => pixels.get(x,y,c)).join(',');
		}

		// returns 1 or 0 because we need to get a count
		function isWall(x,y) {
			var tile = tiles[triad(x,y)];
			return (tile == '#' || tile == 'g') ? 1 : 0;
		}

		var shape = pixels.shape;
		var output = [];
		for (var y = 0; y < shape[1]; ++y) {
			var line = [];
			for (var x = 0; x < shape[0]; ++x) {
				var pix = triad(x,y);
				if (pix == '255,255,255') {
					var up = isWall(x,y-1);
					var left = isWall(x-1,y);
					var right = isWall(x+1,y);
					var down = isWall(x,y+1);
					var neighborCount = up + left + right + down
					if (neighborCount == 2 && up != down) {
						// slope!
						if (up) {
							if (left) {
								line.push('<');
							} else {
								line.push('>');
							}
						} else {
							if (left) {
								line.push('\\');
							} else {
								line.push('/');
							}
						}
					} else {
						line.push(tiles[pix]);
					}
				} else {
					line.push(tiles[pix]);
				}
			}
			output.push(line);
		}
		code = `if (typeof MAPS == 'undefined' || !MAPS) { MAPS = []; }`
		code += `MAPS[${levelNumber}] = ${JSON.stringify(output)};`
		fs.writeFileSync('./js/map_def_' + levelNumber + '.js', code);
		console.log("Wrote level #" + levelNumber);
	});
})
