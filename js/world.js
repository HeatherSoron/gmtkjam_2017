var tileSize = 100;
Class.makeClass(null, function World() {
	this.walls = [];
	this.special = [];
	this.sprites = [];
	for (var i = 0; i < MAPDATA.length; ++i) {
		for (var j = 0; j < MAPDATA[i].length; ++j) {
			var tile = MAPDATA[i][j];
			if (!TILES.isWall(tile)) {
				// these will produce wall segments with a consistent winding. That's important for the sake of getting consistent normals, during collision detection.
				if (MAPDATA[i-1] && TILES.isWall(MAPDATA[i-1][j])) {
					this.walls.push(new Wall(new Point(i * tileSize, (j+1) * tileSize), new Point(i * tileSize, j * tileSize)));
				}
				if (TILES.isWall(MAPDATA[i][j-1])) {
					this.walls.push(new Wall(new Point(i * tileSize, j * tileSize), new Point((i+1) * tileSize, j * tileSize)));
				}
				if (MAPDATA[i+1] && TILES.isWall(MAPDATA[i+1][j])) {
					this.walls.push(new Wall(new Point((i+1) * tileSize, j * tileSize), new Point((i+1) * tileSize, (j+1) * tileSize)));
				}
				if (TILES.isWall(MAPDATA[i][j+1])) {
					this.walls.push(new Wall(new Point((i+1) * tileSize, (j+1) * tileSize), new Point(i * tileSize, (j+1) * tileSize)));
				}

				if (TILES.isSpecial(tile)) {
					this.special.push({
						pos: new Point(tileSize * (j+0.5), tileSize * (i+0.5)),
						kind: Object.keys(TILES).filter(key => TILES[key] == tile)[0],
					});
				}
			}

			switch (tile) {
				case TILES.wall:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'floor.png'});
					break;
				default:
					break;
			}
		}
	}
	// I accidentally wrote code in y,x order. Uh... easiest way to fix? Swap to x,y at runtime.
	this.walls.forEach(function(wall) {
		var x1 = wall.p1.y;
		wall.p1.y = wall.p1.x;
		wall.p1.x = x1;

		var x2 = wall.p2.y;
		wall.p2.y = wall.p2.x;
		wall.p2.x = x2;
	});

});

World.prototype.render = function() {
	this.sprites.forEach(function(sprite) {
		var image = game.images[sprite.img];
		if (image.loaded) {
			ctx.drawImage(image, sprite.pos.x, sprite.pos.y, tileSize, tileSize);
		}
	});

	this.walls.forEach(wall => wall.render());
}

Class.makeClass(null, function Wall(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
});

Wall.prototype.render = function() {
	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.moveTo(this.p1.x, this.p1.y);
	ctx.lineTo(this.p2.x, this.p2.y);
	ctx.stroke();
}
