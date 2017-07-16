Class.makeClass(null, function Movable(x, y) {
	this.body = new GfxRect(x, y, 20, 20);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.9;
})

Movable.prototype.move = function() {
	this.velocity.x *= 1 - this.friction;
	this.velocity.y *= 1 - this.friction;

	this.velocity.y += game.gravity;

	var speed = 0.01;

	this.body.offsetBy(this.velocity.times(speed));

	var rect = Rectangle.from(this.body);
	var collisions = game.world.walls.map(wall => rect.lineIntersections(wall.p1, wall.p2));
	collisions = collisions.filter(c => c.filter(el => el[1] && el[1].seg1 && el[1].seg2).length > 0);
	if (collisions.length > 0) {
		var event = collisions[0][0];
		var normal = event[0][0].minus(event[0][1]).normalize();
		normal = new Point(normal.y, -normal.x);
		
		// this pops the object out of the wall, on a correct side.
		// Assumes a consistent winding direction, but I forget whether it's CW or CCW.
		this.body.offsetBy(normal.times(-this.velocity.length() * speed));

		this.velocity.offsetBy(normal.times(-2 * this.velocity.dot(normal)));
		this.velocity.x *= this.elasticity;
		this.velocity.y *= this.elasticity;
	}
}

Movable.prototype.render = function() {
	this.body.render();	
}
