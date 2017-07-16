var tileSize = 35;
Class.makeClass(null, function World() {
	this.walls = [];
	this.special = [];
	this.sprites = [];
	var breakList = {};
	for (var i = 0; i < MAPDATA.length; ++i) {
		for (var j = 0; j < MAPDATA[i].length; ++j) {
			var tile = MAPDATA[i][j];
			if (!TILES.isWall(tile)) {
				if (TILES.isSlope(tile)) {
					switch(tile) {
						case TILES.slopeLeft:
							this.walls.push(new Wall(new Point((i+1) * tileSize, j * tileSize), new Point(i * tileSize, (j+1) * tileSize)));
							break;
						case TILES.slopeRight:
							this.walls.push(new Wall(new Point(i * tileSize, j * tileSize), new Point((i+1) * tileSize, (j+1) * tileSize)));
							break;
						case TILES.hangLeft:
							this.walls.push(new Wall(new Point(i * tileSize, (j+1) * tileSize), new Point((i+1) * tileSize, j * tileSize)));
							break;
						case TILES.hangRight:
							this.walls.push(new Wall(new Point((i+1) * tileSize, (j+1) * tileSize), new Point(i * tileSize, j * tileSize)));
							break;
					}
				} else {
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
				}
			}

			if (tile == TILES.breakable) {
				var breakWalls = [
					new Wall(new Point(i * tileSize, (j+1) * tileSize), new Point(i * tileSize, j * tileSize)),
					new Wall(new Point(i * tileSize, j * tileSize), new Point((i+1) * tileSize, j * tileSize)),
					new Wall(new Point((i+1) * tileSize, j * tileSize), new Point((i+1) * tileSize, (j+1) * tileSize)),
					new Wall(new Point((i+1) * tileSize, (j+1) * tileSize), new Point(i * tileSize, (j+1) * tileSize)),
				];
				var block = {pos: new Point(tileSize * j, tileSize * i), img: 'breakableground.png'};
				breakWalls.forEach(wall => {
					var p1 = wall.p2;
					wall.p2 = wall.p1;
					wall.p1 = p1;
					wall.block = block;
					this.walls.push(wall);
				});
				block.walls = breakWalls;
				breakList[[i,j].join(',')] = {block: block, walls: breakWalls};
				this.sprites.push(block);
				
			}

			if (TILES.isSpecial(tile)) {
				this.special.push({
					pos: new Point(tileSize * (j+0.5), tileSize * (i+0.5)),
					kind: Object.keys(TILES).filter(key => TILES[key] == tile)[0],
				});
			}

			switch (tile) {
				case TILES.slopeLeft:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'slopeleft.png'});
					break;
				case TILES.slopeRight:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'sloperight.png'});
					break;
				case TILES.hangLeft:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'hangleft.png'});
					break;
				case TILES.hangRight:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'hangright.png'});
					break;
				case TILES.wall:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'ground.png'});
					break;
				case TILES.grapple:
					this.sprites.push({pos: new Point(tileSize * j, tileSize * i), img: 'grapple.png'});
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

	for (var pos in breakList) {
		var coords = pos.split(',').map(i => i-0);
		var neighbors = [
			breakList[[coords[0]-1, coords[1]].join(',')],
			breakList[[coords[0]+1, coords[1]].join(',')],
			breakList[[coords[0], coords[1]-1].join(',')],
			breakList[[coords[0], coords[1]+1].join(',')],
		];
		var myWalls = breakList[pos].walls;
		myWalls.forEach(wall => {
			neighbors.forEach(neighbor => {
				if (neighbor) {
					neighbor.walls.forEach(other => {
						if (other.p1.equals(wall.p2) && other.p2.equals(wall.p1)) {
							console.log("disabled!");
							wall.disable_if = other.block;
						}
					});
				}
			})
		});
	}
	var blockWalls = this.walls.filter(w => w.block).forEach(wall => {
		this.walls.filter
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
	if (this.disable_if && !this.disable_if.dead) {
		return;
	}
	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.moveTo(this.p1.x, this.p1.y);
	ctx.lineTo(this.p2.x, this.p2.y);
	ctx.stroke();
}
