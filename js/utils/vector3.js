
function Vector3(x, y, z) {
	this.x = (x === undefined) ? 0 : x;
	this.y = (y === undefined) ? 0 : y;
	this.z = (z === undefined) ? 0 : z;
	this.length = this.magnitude();
}

Vector3.prototype = {
	set: function(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	},

	clone: function() {
		return new Vector3(this.x, this.y, this.z)
	},

	add: function(vector) {
		return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
	},

	subtract: function(vector) {
		return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
	},

	scale: function(scalar) {
		return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
	},

	dot: function(vector) {
		return (this.x * vector.x + this.y + vector.y + this.z + vector.z);
	},

	lerp: function(vector, t) {
		// Linearly interpolates between vectors A and B by t.
		// t = 0 returns A, t = 1 returns B
		t = Math.min(t, 1); // still allow negative t
		var diff = vector.subtract(this);
		return this.add(diff.scale(t));
	},

	magnitude: function() {
		return Math.sqrt(this.magnitudeSqr());
	},

	magnitudeSqr: function() {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	},

	distance: function (vector) {
		return Math.sqrt(this.distanceSqr(vector));
	},

	distanceSqr: function (vector) {
		var deltaX = this.x - vector.x;
		var deltaY = this.y - vector.y;
		var deltaZ = this.z - vector.z;
		return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
	},

	normalize: function() {
		var mag = this.magnitude();
		var vector = this.clone();
		if(Math.abs(mag) < 1e-9) {
			vector.x = 0;
			vector.y = 0;
			vector.z = 0;
		} else {
			vector.x /= mag;
			vector.y /= mag;
			vector.z /= mag;
		}
		return vector;
	},

	toPrecision: function(precision) {
		var vector = this.clone();
		vector.x = vector.x.toFixed(precision);
		vector.y = vector.y.toFixed(precision);
		vector.z = vector.z.toFixed(precision);
		return vector;
	},

	toString: function () {
		var vector = this.toPrecision(1);
		return ("[" + vector.x + ", " + vector.y + ", " + vector.z + "]");
	}
};