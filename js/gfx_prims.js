Class.makeClass(Drawable, function GfxRect(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
});

GfxRect.prototype.definePath = function() {
	ctx.rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
}



Class.makeClass(Drawable, function GfxCircle(x, y, radius) {
	this.init();

	this.x = x;
	this.y = y;
	this.radius = radius;
});

GfxCircle.prototype.definePath = function() {
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
}
