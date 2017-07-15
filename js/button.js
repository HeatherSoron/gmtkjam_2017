Class.makeClass(Drawable, function Button(text, x, y, actionFunc) {
	this.init();

	this.x = x;
	this.y = y;
	this.text = text;
	this.action = actionFunc ? actionFunc : function() {};
});

Button.prototype.left = function() { return this.x; }
Button.prototype.right = function() { return this.x; }
Button.prototype.top = function() { return this.y; }
Button.prototype.bottom = function() { return this.y; }

Button.prototype.getColor = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
}

Button.prototype.render = function() {
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'black';
	ctx.font = '18px Ariel';
	ctx.fillText(this.text, this.x, this.y);

	// note: Firefox only implements the 'width' property of TextMetrics, so that's all that we can safely use
	var textWidth = ctx.measureText(this.text).width;
	var padding = 6;

	var triInnerX = 3;
	var triOuterX = 8;
	var triVert = 4;

	if (this.selected) {
		ctx.beginPath();
		ctx.moveTo(this.x - (textWidth/2 + triInnerX), this.y);
		ctx.lineTo(this.x - (textWidth/2 + triInnerX + triOuterX), this.y - triVert);
		ctx.lineTo(this.x - (textWidth/2 + triInnerX + triOuterX), this.y + triVert);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x + (textWidth/2 + triInnerX), this.y);
		ctx.lineTo(this.x + (textWidth/2 + triInnerX + triOuterX), this.y - triVert);
		ctx.lineTo(this.x + (textWidth/2 + triInnerX + triOuterX), this.y + triVert);
		ctx.fill();
	}

	var boxLeft = this.x - (triInnerX + triOuterX + textWidth/2 + padding);
	var boxRight = this.x + (triInnerX + triOuterX + textWidth/2 + padding);

	var boxTop = this.y - (18/2 + padding);
	var boxBottom = this.y + (18/2 + padding);

	ctx.beginPath();
	ctx.moveTo(boxLeft, boxTop);
	ctx.lineTo(boxRight, boxTop);
	ctx.lineTo(boxRight, boxBottom);
	ctx.lineTo(boxLeft, boxBottom);
	ctx.lineTo(boxLeft, boxTop);
	ctx.stroke();
}
