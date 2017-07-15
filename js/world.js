Class.makeClass(null, function World() {
	var verts = [
		new Point(10, 10),
		new Point(790, 10),
		new Point(790, 590),
		new Point(10, 590),
	];
	this.walls = [];
	for (var i = 0; i < verts.length; ++i) {
		this.walls.push(new Wall(verts[i+0], verts[(i+1)%verts.length]));
	}

});

World.prototype.render = function() {
	this.walls.forEach(wall => wall.render());
}

Class.makeClass(null, function Wall(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
});

Wall.prototype.render = function() {
	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.moveTo(this.p1.x, this.p1.y);
	ctx.lineTo(this.p2.x, this.p2.y);
	ctx.stroke();
}
