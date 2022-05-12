//GUI



function DrawText(x, y, text, color){
	if(x>canvas.width || x<0 || (y-fontSize)>canvas.height || (y+fontSize)<0) return;
	
	ctx.fillStyle = color;//"rgba(255, 255, 255, 1)";
	ctx.fillText(text, Math.round(x), canvas.height-Math.round(y-fontSize/2));
}

function DrawBox(x, y, w, h, color){
	ctx.fillStyle = color;
	ctx.fillRect(Math.round(x), canvas.height-Math.round(y), w, h);
}



function GUIDrawSprite(x, y, img, r){
	ctx.save();
	ctx.translate( Math.round(x+img.size[0]/2), canvas.height - Math.round(y-img.size[1]/2) );
	img.rect = r;
	img.render(ctx);
	ctx.restore();
}


var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,:;!?"+
			"0123456789<>[](){}'\"-+*%/ ";

function GUIDrawTextSprite(txt, x, y){
	var l = txt.length;
	for(var i=0; i<l; i++){
		
		for(var n=0; n<chars.length; n++){
			if(txt[i] == chars[n]){
				var w = 32;
				var nx = n%w;
				var ny = Math.floor(n/w);
				GUIDrawSprite(x +(i*8), y, new Sprite('res/gui.png', [nx*8, ny*8] , [8, 8]));
				break;
			}
		}
	}
}

function GUIDrawSlicedSprite(xx, yy, ww, hh, sprites){
	var w = ww/8;
	var h = hh/8;
	
	var cutW = (ww<16)? 8-(ww-ww/2) : 0;
	var cutH = (hh<16)? 8-(hh-hh/2) : 0;
	var cW = (ww<16)? 1 : 0;
	var cH = (hh<16)? 1 : 0;

	for(var x=1; x<w-1; x++){
		for(var y=1; y<h-1; y++){
			GUIDrawSprite(xx+x*8, yy-y*8, sprites[4]);	//center
		}
	}
	for(var x=1; x<w-1; x++){
		GUIDrawSprite(xx+8*x, yy, sprites[1], [0,0,0,(-cutH+1)*cH]);
		GUIDrawSprite(xx+8*x, yy-8*(h-1)-(cutH*cH), sprites[7], [0,(cutH)*cH,0,(-cutH)*cH]);	//horizontal
	}
	for(var y=1; y<h-1; y++){
		GUIDrawSprite(xx, yy-8*y, sprites[3], [0,0,(-cutW+1)*cW,0]);
		GUIDrawSprite(xx+8*(w-1)+(cutW*cW), yy-8*y, sprites[5], [(cutW)*cW,0,(-cutW)*cW,0]);	//vertical
	}
	
	GUIDrawSprite(xx, yy, sprites[0], [0,0,(-cutW+1)*cW,(-cutH+1)*cH]);
	GUIDrawSprite(xx+8*(w-1)+(cutW*cW), yy, sprites[2], [(cutW)*cW,0,(-cutW)*cW,(-cutH+1)*cH]);
	GUIDrawSprite(xx, yy-8*(h-1)-(cutH*cH), sprites[6], [0,(cutH)*cH,(-cutW+1)*cW,(-cutH)*cH]);
	GUIDrawSprite(xx+8*(w-1)+(cutW*cW), yy-8*(h-1)-(cutH*cH), sprites[8], [(cutW)*cW,(cutH)*cH,(-cutW)*cW,(-cutH)*cH]);
	
}







//OPTIONAL
function DrawCircle(x, y, r, c){
	x = x + 0;
	y = (canvas.height - y) + 0;

	//r = r / scale;

	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
	
	ctx.fillStyle = c;
	ctx.fill();
	ctx.closePath();
}

function DrawArrow(fromx, fromy, tox, toy, color){
	
	fromx = (fromx + 0);
	fromy = ((canvas.height - fromy) + 0);
	
	tox = (tox + 0);
	toy = ((canvas.height - toy) + 0);
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var headlen = 10;
	
	var angle = Math.atan2(toy-fromy,tox-fromx);
	
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
	
	ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
	
	ctx.lineTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
	
	ctx.lineWidth = 1;
	ctx.fillStyle = color;
	ctx.fill();
}

function DrawLine(fromx, fromy, tox, toy, color){
	
	fromx = (fromx + 0);
	fromy = ((canvas.height - fromy) + 0);
	
	tox = (tox + 0);
	toy = ((canvas.height - toy) + 0);
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var headlen = 10;
	
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.stroke();
}

function DrawRect(x, y, w, h, color, lw=1){
	ctx.beginPath();
	ctx.lineWidth=lw+"";
	ctx.rect(Math.round(x), canvas.height-Math.round(y), w, h);			
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.closePath();
}


function ClearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
