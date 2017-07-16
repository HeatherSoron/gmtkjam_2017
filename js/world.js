Class.makeClass(null, function World() {
	this.walls = [];
	this.special = [];
	var tileSize = 32;
	for (var i = 0; i < MAPDATA.length; ++i) {
		for (var j = 0; j < MAPDATA[i].length; ++j) {
			var tile = MAPDATA[i][j];
			if (!TILES.isWall(tile)) {
				if (MAPDATA[i-1] && TILES.isWall(MAPDATA[i-1][j])) {
					this.walls.push(new Wall(new Point(i * tileSize, j * tileSize), new Point(i * tileSize, (j+1) * tileSize)));
				}
				if (TILES.isWall(MAPDATA[i][j-1])) {
					this.walls.push(new Wall(new Point(i * tileSize, j * tileSize), new Point((i+1) * tileSize, j * tileSize)));
				}
				if (MAPDATA[i+1] && TILES.isWall(MAPDATA[i+1][j])) {
					this.walls.push(new Wall(new Point((i+1) * tileSize, j * tileSize), new Point((i+1) * tileSize, (j+1) * tileSize)));
				}
				if (TILES.isWall(MAPDATA[i][j+1])) {
					this.walls.push(new Wall(new Point(i * tileSize, (j+1) * tileSize), new Point((i+1) * tileSize, (j+1) * tileSize)));
				}

				if (TILES.isSpecial(tile)) {
					this.special.push({
						pos: new Point(tileSize * (j+0.5), tileSize * (i+0.5)),
						kind: Object.keys(TILES).filter(key => TILES[key] == tile)[0],
					});
				}
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
	var verts = [
		new Point(10, 10),
		new Point(790, 10),
		new Point(790, 590),
		new Point(10, 590),
	];
	for (var i = 0; i < verts.length; ++i) {
		this.walls.push(new Wall(verts[i+0], verts[(i+1)%verts.length]));
	}

});

World.prototype.render = function() {
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
