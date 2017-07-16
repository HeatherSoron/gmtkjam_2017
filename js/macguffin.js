Class.makeClass(Movable, function Macguffin(x,y) {
	this.body = new Sprite(game.images['core.png'], x, y, tileSize * 2, tileSize * 2);
	this.velocity = new Point();
	this.friction = 0.01;
	this.elasticity = 0.7;
});

Macguffin.prototype.render = function() {
	this.body.render();	

	var outerRad = 70;
	var gradient = ctx.createRadialGradient(this.body.x, this.body.y, outerRad, this.body.x, this.body.y, 0);
	gradient.addColorStop(0,"rgba(0,200,0,0.0)");
	gradient.addColorStop(1,"rgba(0,127,0,0.7)");
	ctx.fillStyle = gradient;
	ctx.arc(this.body.x, this.body.y, outerRad, 0, 2 * Math.PI);
	ctx.fill();

	this.drawMagnetism();
}
