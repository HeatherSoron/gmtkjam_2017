#!/usr/bin/node

// Part of a game jam toolchain + HTML5 engine created by Ethan "Soron" Kaminski. MIT license (c) 2017, see <https://github.com/ethankaminski/macej> for the full project

// as of July 16 2017, this file has not yet been pushed to the Github repo - but it will be in a few days

var getPixels = require('get-pixels');
var fs = require('fs');

getPixels('./data/map.png', function(err, pixels) {
	var mappingData = fs.readFileSync('./data/tilemap.txt').toString();
	var tiles = {};
	mappingData.split("\n").forEach(function(line) {
		var comp = line.split(/\s+/);
		tiles[comp[0]] = comp[1];
	});

	var shape = pixels.shape;
	var output = [];
	for (var y = 0; y < shape[1]; ++y) {
		var line = [];
		for (var x = 0; x < shape[0]; ++x) {
			var pix = [0,1,2].map(c => pixels.get(x,y,c)).join(',');
			line.push(tiles[pix]);
		}
		output.push(line);
	}
	fs.writeFileSync('./js/map_def.js', "var MAPDATA = " + JSON.stringify(output));
});
