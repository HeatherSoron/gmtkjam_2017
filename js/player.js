Class.makeClass(null, function Player(x, y) {
	this.body = new GfxRect(x, y, 10, 10);
	this.velocity = new Point();
})

Player.prototype.move = function() {
	

	var speed = 0.01;

	this.body.offsetBy(this.velocity.times(speed));

	var rect = Rectangle.from(this.body);
	var collisions = game.world.walls.map(wall => rect.lineIntersections(wall.p1, wall.p2));
	collisions = collisions.filter(c => c.filter(el => el && el.seg1 && el.seg2).length > 0);
	if (collisions.length > 0) {
		this.velocity.x *= -1;
		this.velocity.y *= -1;
	}
}

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
