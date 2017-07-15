Class.makeClass(null, function Player(x, y) {
	this.body = new GfxRect(x, y, 20, 20);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.9;
})

Player.prototype.move = function() {
	this.velocity.x *= 1 - this.friction;
	this.velocity.y *= 1 - this.friction;

	this.velocity.y += game.gravity;

	var speed = 0.01;

	this.body.offsetBy(this.velocity.times(speed));

	var rect = Rectangle.from(this.body);
	var collisions = game.world.walls.map(wall => rect.lineIntersections(wall.p1, wall.p2));
	collisions = collisions.filter(c => c.filter(el => el[1] && el[1].seg1 && el[1].seg2).length > 0);
	if (collisions.length > 0) {
		var normal = collisions[0][0][0][0].minus(collisions[0][0][0][1]).normalize();
		normal = new Point(normal.y, -normal.x);
		this.velocity.offsetBy(normal.times(-2 * this.velocity.dot(normal)));
		this.velocity.x *= this.elasticity;
		this.velocity.y *= this.elasticity;
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
