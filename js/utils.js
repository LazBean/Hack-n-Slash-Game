



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
	
	var px =(mouse[0]-camera[0]);
	var py =(mouse[1]-camera[1]);
	return (x1<=px) && (px<=x2) && (y1<=py) && (py<=y2);
}

function pointInScreenRect(pos, pos2, w, h)
{
	var x1 = (pos2[0]);
	var x2 = (pos2[0]+w);
	var y1 = (pos2[1]-h);
	var y2 = (pos2[1]);
	
	var px =(pos[0]);
	var py =(pos[1]);
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

function vectorDir(v1, v2) 
{
    return [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]];
}

function vectorNormalize(v)
{
	var l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
	l = Math.abs(l);
	if(l==0) return [0,0,0];
	return [v[0]/l, v[1]/l, v[2]/l];
}

function vectorLength(v)
{
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

function vectorLerp(v1, v2, t)
{
	return [Math.lerp(v1[0], v2[0], t),
			Math.lerp(v1[1], v2[1], t),
			Math.lerp(v1[2], v2[2], t)];
}

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
