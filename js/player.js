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

	if (this.anchor) {
		this.drawGrapple();
	}
	this.drawMagnetism();
}

Player.prototype.drawGrapple = function() {
	ctx.beginPath();

	var center = this.body//.plus(new Point(tileSize * 0.8, tileSize * 0.8).times(0.5));
	var vec = this.anchor.pos.minus(center);
	var rad = vec.length();
	var angle = Math.atan2(vec.y, vec.x);
	var arc = Math.min(Math.PI / 6, 25 / rad);
	var gradient = ctx.createRadialGradient(center.x, center.y, rad, center.x, center.y, 0);
	gradient.addColorStop(0,"rgba(0,0,200,0.0)");
	gradient.addColorStop(1,"rgba(0,0,127,0.7)");
	ctx.fillStyle = gradient;
	ctx.moveTo(center.x, center.y);
	ctx.arc(center.x, center.y, rad, angle - arc/2, angle + arc/2);
	//ctx.arc(center.x, center.y, rad, 0, 1);
	ctx.fill();
}
