Class.makeClass(Movable, function Spike(x, y) {
	this.body = new Sprite(game.images['spikes.png'], x, y, tileSize, tileSize);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.7;
});
