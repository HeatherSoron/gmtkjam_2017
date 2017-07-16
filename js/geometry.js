Class.makeClass(null, function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
})

Point.prototype.normalize = function() {
	var length = this.length();
	return new Point(this.x/length, this.y/length);
}

Point.prototype.length = function() {
	return Math.sqrt(this.lenSqrd());
}

Point.prototype.lenSqrd = function() {
	return (this.x * this.x) + (this.y * this.y);
}

Point.prototype.distTo = function(other) {
	return this.minus(other).length();
}

// useful for inverse square law stuff, and such
Point.prototype.sqrDistTo = function(other) {
	return this.minus(other).lenSqrd();
}

Point.prototype.isZero = function() {
	return !(this.x || this.y);
}

Point.prototype.times = function(mult) {
	return new Point(this.x * mult, this.y * mult);
}

Point.prototype.toRect = function(width, height, centered) {
	var left = this.x;
	var top = this.y;
	if (centered) {
		left -= width / 2.0;
		top -= height / 2.0;
	}
	return new Rectangle(left, top, width, height);
}


Point.prototype.offsetBy = function(other) {
	this.x += other.x;
	this.y += other.y;
	return this;
}

Point.prototype.plus = function(other) {
	return this.clone().offsetBy(other);
}

Point.prototype.minus = function(other) {
	return this.clone().offsetBy(other.times(-1));
}

Point.prototype.dot = function(other) {
	return this.x * other.x + this.y * other.y;
}

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
}

Point.prototype.equals = function(other) {
	return this.x == other.x && this.y == other.y;
}




Class.makeClass(null, function Rectangle(left, top, width, height) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	
	Object.defineProperty(this, 'right', {
		get: function() {
			return this.left + this.width;
		}
	});
	
	Object.defineProperty(this, 'bottom', {
		get: function() {
			return this.top + this.height;
		}
	});
});

Rectangle.prototype.intersects = function(other) {
	return (
		this.left < other.right && this.right > other.left
	&&
		this.top < other.bottom && this.bottom > other.top
	);
}

Rectangle.prototype.contains = function(point) {
	return (
		this.left < point.x && this.right > point.x
	&&
		this.top < point.y && this.bottom > point.y
	);
}

Rectangle.prototype.center = function() {
	return new Point(this.left + this.width/2, this.top + this.height/2);
}

Rectangle.prototype.clone = function() {
	return new Rectangle(this.left, this.top, this.width, this.height);
}

// static method
Rectangle.from = function(obj) {
	return new Rectangle(obj.x - obj.width/2, obj.y - obj.height/2, obj.width, obj.height);
}

Rectangle.prototype.sides = function() {
	return [
		[new Point(this.left, this.top), new Point(this.right, this.top)],
		[new Point(this.right, this.top), new Point(this.right, this.bottom)],
		[new Point(this.right, this.bottom), new Point(this.left, this.bottom)],
		[new Point(this.left, this.bottom), new Point(this.left, this.top)],
	];
}

Rectangle.prototype.lineIntersections = function(p1, p2, obj) {
	return this.sides().map(side => [[p1, p2], line_intersect(side[0].x, side[0].y, side[1].x, side[1].y, p1.x, p1.y, p2.x, p2.y), obj]);
}


// from https://stackoverflow.com/a/38977789/2621028
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
	 var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
	 if (denom == 0) {
		  return null;
	 }
	 ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
	 ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
	 return {
		  x: x1 + ua*(x2 - x1),
		  y: y1 + ua*(y2 - y1),
		  seg1: ua >= 0 && ua <= 1,
		  seg2: ub >= 0 && ub <= 1
	 };
}
