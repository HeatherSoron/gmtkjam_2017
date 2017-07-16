Class.makeClass(Movable, function Macguffin(x,y) {
	this.body = new Sprite(game.images['core.png'], x, y, tileSize * 2, tileSize * 2);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.7;
});
