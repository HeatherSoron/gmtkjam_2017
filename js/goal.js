Class.makeClass(null, function Goal(x, y) {
	this.body = new Sprite(game.images['GOAL.png'], x, y, tileSize * 2.2, tileSize * 2.2);
})

Goal.prototype.render = function() {
	this.body.render();
}
