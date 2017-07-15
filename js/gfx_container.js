Class.makeClass(Drawable, function GfxContainer(x, y) {
	this.init();

	this.x = x;
	this.y = y;
});

GfxContainer.prototype.parentInit = GfxContainer.prototype.init;
GfxContainer.prototype.init = function() {
	this.parentInit();
	this.children = [];
}

GfxContainer.prototype.addChild = function(child) {
	this.children.push(child);
}

GfxContainer.prototype.parentRender = GfxContainer.prototype.render;
GfxContainer.prototype.render = function() {
	this.parentRender();

	ctx.save();
	ctx.translate(this.x, this.y);
	this.children.forEach(function(child) { child.render(); });
	ctx.restore();
}
