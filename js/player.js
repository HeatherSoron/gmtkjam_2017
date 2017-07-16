Class.makeClass(Movable, function Player(x, y) {
	this.body = new GfxRect(x, y, tileSize * 0.8, tileSize * 0.8);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.7;
})

Player.prototype.render = function() {
	this.body.render();	

	var dx = mouseState.x - this.body.x;
	var dy = mouseState.y - this.body.y;

	var angle = Math.atan2(dy, dx); // oh thank goodness for atan2
	if (dx == 0 && dy == 0) {
		angle = 0;
	}

	ctx.save()
	ctx.translate(this.body.x, this.body.y);
	ctx.fillStyle = 'green';
	ctx.rotate(angle);
	ctx.fillRect(-2 + 8, -2, 4, 4);
	ctx.restore();
}
