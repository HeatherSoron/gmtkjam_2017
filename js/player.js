Class.makeClass(null, function Player(x, y) {
	this.body = new GfxRect(x, y, 10, 10);
})

var offset = 0;
Player.prototype.render = function() {
	this.body.render();	
	ctx.save()
	ctx.translate(this.body.x, this.body.y);
	ctx.fillStyle = 'green';
	ctx.rotate((offset++)/8);
	ctx.fillRect(-2, -10, 4, 4);
	ctx.restore();
}
