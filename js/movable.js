Class.makeClass(null, function Movable(x, y) {
	this.body = new GfxRect(x, y, 20, 20);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.7;
})

Movable.prototype.collisionCallback = function() {};

Movable.prototype.move = function() {
	this.velocity.x *= 1 - this.friction;
	this.velocity.y *= 1 - this.friction;

	this.velocity.y += game.gravity;

	var speed = 0.01;

	this.body.offsetBy(this.velocity.times(speed));

	var rect = Rectangle.from(this.body);
	var collisions = game.world.walls.filter(w => !(w.disable_if && !w.disable_if.dead)).map(wall => rect.lineIntersections(wall.p1, wall.p2, wall));
	collisions = collisions.filter(c => c.filter(el => el[1] && el[1].seg1 && el[1].seg2).length > 0);
	if (collisions.length > 0) {
		var event = collisions[0][0];
		/*
		for (var i = 0; i < collisions.length; ++i) {
			break;
			for (var j = 0; j < collisions[i].length; ++j) {
				var alt_ev = collisions[i][j];
				if (!alt_ev[1]) {
					continue;
				}
				if (!event[1]) {
					event = alt_ev;
					continue;
				}
				var p1 = new Point(alt_ev[1].x, alt_ev[1].y);
				var p2 = new Point(event[1].x, event[1].y);
				if (p1.minus(this.body).lenSqrd() < p2.minus(this.body).lenSqrd()) {
					event = alt_ev;
				}
			}
		}
		*/
		if (!this.collisionCallback(event)) {
			var normal = event[0][0].minus(event[0][1]).normalize();
			normal = new Point(normal.y, -normal.x);
			
			// this pops the object out of the wall, on a correct side.
			// Assumes a consistent winding direction, but I forget whether it's CW or CCW.
			this.body.offsetBy(normal.times(-this.velocity.length() * speed));

			this.velocity.offsetBy(normal.times(-2 * this.velocity.dot(normal)));

			var rebound = this.elasticity;
			// game-specific logic to make falling less bouncy than sideways rebounds
			if (normal.y == 1) { // okay, clearly we have the winding *backwards*. Meh.
				rebound *= 0.5;
			}
			this.velocity.x *= rebound;
			this.velocity.y *= rebound;
		}
	}

	this.collision_count = collisions.length;
	this.bump = this.collision_count > 0 && this.velocity.lenSqrd() > 40000;
}

Movable.prototype.render = function() {
	this.body.render();
	this.drawMagnetism();
}

Movable.prototype.drawMagnetism = function() {
	if (this.mag) {
		this.mag.forEach(mag => {
			ctx.beginPath();

			var center = this.body//.plus(new Point(tileSize * 0.8, tileSize * 0.8).times(0.5));
			var vec = mag.obj.body.minus(center);
			var rad = vec.length() * 0.5;
			var angle = Math.atan2(vec.y, vec.x);
			var arc = Math.min(Math.PI / 6, 25 / rad);
			var gradient = ctx.createRadialGradient(center.x, center.y, rad, center.x, center.y, 0);
			gradient.addColorStop(0,"rgba(255,0,0,0.0)");
			gradient.addColorStop(1,"rgba(200,0,0," + (mag.power.length() / game.maxAttraction) +  ")");
			ctx.fillStyle = gradient;
			ctx.moveTo(center.x, center.y);
			ctx.arc(center.x, center.y, rad, angle - arc/2, angle + arc/2);
			//ctx.arc(center.x, center.y, rad, 0, 1);
			ctx.fill();
		});
	}
}
