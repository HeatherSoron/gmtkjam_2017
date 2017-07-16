Class.makeClass(Movable, function Spike(x, y) {
	this.body = new Sprite(game.images['spikes.png'], x, y, tileSize, tileSize);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.7;
});

Spike.prototype.collisionCallback = function(event) {
	if (this.velocity.lenSqrd() < 500000) {
		return false;
	}

	if (event[2].block) {
		var block = event[2].block;
		this.killBlock(block);
		block.walls.forEach(wall => {
			if (wall.disable_if && !wall.disable_if.dead) {
				this.killBlock(wall.disable_if);
			}
		})
	}

	return false;
}

Spike.prototype.killBlock = function(block) {
	block.dead = true;
	game.world.sprites.splice(game.world.sprites.indexOf(block), 1);

	block.walls.forEach(wall => {
		game.world.walls.splice(game.world.walls.indexOf(wall), 1);
	});
}
