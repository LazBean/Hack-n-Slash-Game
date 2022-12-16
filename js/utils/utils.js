



function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
	var w = size[0]/2;
	var ww = size[1]/2;
	return collides(pos[0]-w, pos[1]-w,
                    pos[0]-w + w, pos[1]-w + w,
                    pos2[0]-ww , pos2[1]-ww,
                    pos2[0]-ww + ww, pos2[1]-ww + ww);
}

function collidesCircles(posA, rA, posB, rB){

	var direction = vectorDir(posA, posB)
	var overlap = vectorLength(direction) - (rA + rB);
	
	var normal = vectorNormalize(direction);
	//B.position += direction * overlap
	return {isCollides:overlap<0, normal:normal, overlap:overlap};
}

function collidesCircleRect(circle, rect){

	// Calculate the distance between the center of the circle and the rectangle
	let distX = Math.abs(circle.x - rect.x - rect.w / 2);
	let distY = Math.abs(circle.y - rect.y - rect.h / 2);
  
	// If the distance is greater than half the rectangle's width or height, the circle is too far away and there is no collision
	if (distX > rect.w / 2 + circle.r || distY > rect.h / 2 + circle.r) {
	  	return {isCollides:false};
	}
  
	let normal = {x: 0, y: 0};
	// If the distance is less than half the rectangle's width or height, the circle is within the rectangle and there is a collision
	if (distX <= rect.w / 2) {
		normal.x = (circle.x > rect.x + rect.w / 2) ? 1 : -1;
	}
	if (distY <= rect.h / 2) {
		normal.y = (circle.y > rect.y + rect.h / 2) ? 1 : -1;
	}

	return {isCollides: true, normal: normal};
}


function rectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}


function getRectClosestSideNormal(rect, point) {

	// Calculate the distances from the point to each side of the rectangle
	let side1 = Math.abs(point.x - rect.x); // Distance to left side
	let side2 = Math.abs(point.x - (rect.x + rect.w)); // Distance to right side
	let side3 = Math.abs(point.y - rect.y); // Distance to top side
	let side4 = Math.abs(point.y - (rect.y + rect.h)); // Distance to bottom side
  
	// Find the side with the minimum distance from the point
	let minSide = 1;
	let minDistance = side1;
	if (side2 < minDistance) {
	  minSide = 2;
	  minDistance = side2;
	}
	if (side3 < minDistance) {
	  minSide = 3;
	  minDistance = side3;
	}
	if (side4 < minDistance) {
	  minSide = 4;
	  minDistance = side4;
	}
  
	// Calculate the normal vector of the side with the minimum distance
	let normal = {};
	if (minSide === 1) {
	  // Left side
	  normal = { x: -1, y: 0 };
	} else if (minSide === 2) {
	  // Right side
	  normal = { x: 1, y: 0 };
	} else if (minSide === 3) {
	  // Top side
	  normal = { x: 0, y: -1 };
	} else if (minSide === 4) {
	  // Bottom side
	  normal = { x: 0, y: 1 };
	}
  
	return normal;
}

function reflectVector(dir, normal) {

	mV = Math.hypot(dir.x, dir.y);
	mN = Math.hypot(normal.x, normal.y);

	let dot = dir.x * normal.x + dir.y * normal.y;
	console.log(dot);

	return {
		x:dir.x-2*dot*normal.x, 
		y:dir.y-2*dot*normal.y
	}
  
	// Calculate the dot product of the moving vector and the normal vector
	//let dotProduct = movingVector.x * normalVector.x + movingVector.y * normalVector.y;
  
	// If the angle between the moving vector and the normal vector is less than 90 degrees, reflect the moving vector across the normal vector
	/*if (dotProduct > 0) {
	  let reflectedVector = {
		x: movingVector.x - 2 * dotProduct * normalVector.x,
		y: movingVector.y - 2 * dotProduct * normalVector.y,
	  };
  
	  // Update the position of the circle using the reflected vector
	  return reflectedVector;
	}

	return dir;*/
}

dotProduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);



function pointInBox(pos, pos2, size){
	var w = size/2;
	var x1 = (pos2[0]-w);
	var x2 = (pos2[0]+w);
	var y1 = (pos2[1]-w);
	var y2 = (pos2[1]+w);
	return (x1<=pos[0]) && (pos[0]<=x2) && (y1<=pos[1]) && (pos[1]<=y2);
}

function cursorInBox(pos, size)
{
	var w = size/2;
	var x1 = (pos[0]-w);
	var x2 = (pos[0]+w);
	var y1 = (pos[1]-w);
	var y2 = (pos[1]+w);
	
	var px =(mouse[0]-camera.x);
	var py =(mouse[1]-camera.y);
	return (x1<=px) && (px<=x2) && (y1<=py) && (py<=y2);
}

function pointInScreenRect(pos, x, y, w, h)
{
	var x1 = (x);
	var x2 = (x+w);
	var y1 = (y-h);
	var y2 = (y);
	
	var px =(pos.x);
	var py =(pos.y);
	return (x1<=px) && (px<=x2) && (y1<=py) && (py<=y2);
}






//====================================UTILITY
function randomRange(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colorStr(r,g,b,a)
{
	return "rgba("+r+", "+g+", "+b+", "+a+")";
}

function randomFRange(min, max) 
{
    return Math.random() * (max - min) + min;
}

function random() 
{
    return randomFRange(0.,1.);
}

function nearest(value, min, max, steps) {
	var zerone = Math.round((value - min) * steps / (max - min)) / steps; // bring to 0-1 range    
	zerone = Math.min(Math.max(zerone, 0), 1) // keep in range in case value is off limits
	return zerone * (max - min) + min;
}

function vectorDir(v1, v2) 
{
    return {x:v2.x-v1.x, y:v2.y-v1.y, z:v2.z-v1.z};
}

function vectorLength(v)
{
	return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}

function vectorNormalize(v)
{
	var l = vectorLength(v);
	l = Math.abs(l);
	if(l==0) return {x:0, y:0, z:0};
	return {x: v.x/l, y: v.y/l, z: v.z/l};
}



function vectorLerp(v1, v2, t)
{
	return [Math.lerp(v1[0], v2[0], t),
			Math.lerp(v1[1], v2[1], t),
			Math.lerp(v1[2], v2[2], t)];
}

function vectorRotate(v, ang)
{
    ang = -ang * (Math.PI/180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return {x:Math.round(10000*(v.x * cos - v.y * sin))/10000, y: Math.round(10000*(v.x * sin + v.y * cos))/10000, z:v.z};
};

function Distance(a, b)
{
	return Math.sqrt( Math.pow(a[0] - b[0],2) + Math.pow(a[1] - b[1],2) + Math.pow(a[2] - b[2],2) );
}

(function()
{
	Math.clamp = function(a,b,c)
	{
		return Math.max(b,Math.min(c,a));
	}
	
	Math.lerp = function (value1, value2, amount) 
	{
		amount = amount < 0 ? 0 : amount;
		amount = amount > 1 ? 1 : amount;
		return value1 + (value2 - value1) * amount;
	}
})();


//COROUTINES
/*var clock = coroutine(function*() 
{
		while (true) {
			yield;
			console.log('Tick!');
			yield;
			console.log('Tock!');
		}
	});
	
function coroutine(f) 
{
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function(x) {
        o.next(x);
    }
}
clock();
*/
