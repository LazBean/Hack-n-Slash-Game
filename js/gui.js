//GUI



function DrawText(x, y, text, color="rgba(160, 160, 160, 1)"){
	if(x>canvas.width || x<0 || (y-fontSize)>canvas.height || (y+fontSize)<0) return;
	
	ctx.fillStyle = color;
	ctx.fillText(text, Math.round(x), canvas.height-Math.round(y-fontSize/2));
}

function DrawBox(x, y, w, h, color="rgba(100, 100, 100, 1)"){
	ctx.fillStyle = color;
	ctx.fillRect(Math.round(x), canvas.height-Math.round(y), w, h);
}



function GUIDrawSprite(x, y, sprite, cutRect){
	ctx.save();
	ctx.translate( Math.round(x+sprite.size[0]/2), canvas.height - Math.round(y-sprite.size[1]/2) );
	sprite.rect = cutRect;
	sprite.render(ctx);
	ctx.restore();
}


var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,:;!?"+
			"0123456789<>[](){}'\"-+*%/ ";

function GUIDrawTextSprite(txt, x, y){
	var l = txt.length;
	for(var i=0; i<l; i++){
		
		for(var n=0; n<chars.length; n++){
			if(txt[i] == chars[n]){
				var w = 16;
				var nx = n%w;
				var ny = Math.floor(n/w);
				GUIDrawSprite(x +(i*8), y, new Sprite('res/font.png', [nx*8, ny*8] , [8, 8]));
				break;
			}
		}
	}
}

function GUIDrawSlicedSprite(xx, yy, ww, hh, sprites){

	//upper
	var s0 = sprites[0]
	var s1 = sprites[1]
	var s2 = sprites[2]

	// upper-left
	var cutW = (ww<s0.size[0])? ww-s0.size[0] : 0
	var cutH = (hh<s0.size[1])? hh-s0.size[1] : 0
	GUIDrawSprite(xx, yy, s0, [0,0,cutW,cutH]);

	// upper-center
	
	var innerW = ww - s0.size[0] - s2.size[0]
	var xN = innerW / s1.size[0]
	var cut1W = (innerW % s1.size[0])

	for(var x=0; x<=xN; x++){

		let cw = (x<=xN-1)? 0 : -s1.size[0]+cut1W
		GUIDrawSprite(xx+(s0.size[0])+(s1.size[0]*x), yy, s1, [0,0,cw,cutH]);
	}

	// upper-right
	GUIDrawSprite(xx+ww+(-s0.size[0]-cutW), yy, s2, [cutW*-1,0,cutW,cutH]);

	// middle
	var s3 = sprites[3]
	var s4 = sprites[4]
	var s5 = sprites[5]

	


	// lower
	var s6 = sprites[6]
	var s7 = sprites[7]
	var s8 = sprites[8]

	// lower-left
	var cut6W = (ww<s6.size[0])? ww-s6.size[0] : 0
	var cut6H = (hh<s6.size[1])? hh-s6.size[1] : 0
	GUIDrawSprite(xx, yy-hh-(-cut6H-s6.size[1]), s6, [0,cut6H*-1,cut6W,cut6H]);

	// lower-center
	for(var x=0; x<=xN; x++){

		let cw = (x<=xN-1)? 0 : -s1.size[0]+cut1W
		GUIDrawSprite(xx+(s0.size[0])+(s1.size[0]*x), yy-hh-(-s6.size[0]-cut6H), s7, [0,cut6H*-1,cw,cut6H]);
	}

	// lower-right
	var cut8W = (ww<s8.size[0])? ww-s8.size[0] : 0
	var cut8H = (hh<s8.size[1])? hh-s8.size[1] : 0
	GUIDrawSprite(xx+ww+(-s8.size[0]-cut8W), yy-hh-(-s8.size[0]-cut8H), s8, [cut8W*-1,cut8H*-1,cut8W,cut8H]);

	// middle-left
	var innerH = hh - s0.size[1] - s6.size[1]
	var yN = innerH / s3.size[1]
	var cut3H = (innerH % s3.size[1])

	for(var y=0; y<=yN; y++){

		let ch = (y<=yN-1)? 0 : -s3.size[1]+cut3H
		GUIDrawSprite(xx, yy-hh+(s3.size[1]*y)+ch+s0.size[1]+s6.size[1], s3, [0,0,cutW,ch]);
	}

	// middle-right
	for(var y=0; y<=yN; y++){

		let ch = (y<=yN-1)? 0 : -s3.size[1]+cut3H
		GUIDrawSprite(xx+ww+(-s8.size[0]-cut8W), yy-hh+(s3.size[1]*y)+ch+s0.size[1]+s6.size[1], s5, [cut8W*-1,0,cut8W,ch]);
	}

	// middle-center
	for(var x=0; x<=xN; x++){
		for(var y=0; y<=yN; y++){

			let cw = (x<=xN-1)? 0 : -s1.size[0]+cut1W
			let ch = (y<=yN-1)? 0 : -s3.size[1]+cut3H

			GUIDrawSprite(xx+(s0.size[0])+(s1.size[0]*x), yy-hh+(s3.size[1]*y)+ch+s0.size[1]+s6.size[1], s4, [0,0,cw,ch]);
		}
	}
}

var ButtonSprite = new Sprite('res/gui.png', [0, 16] , [48, 48],0,[0]);
var ButtonSpriteHover = new Sprite('res/gui.png', [24, 0] , [24, 24],0,[0]);
var ButtonSpriteActive = new Sprite('res/gui.png', [24, 0] , [24, 24],0,[0]);





function GUIButton(x,y,w,h, text=null, font_color='rgba(255, 255, 255, 1)', font_color_h='rgba(100, 100, 100, 1)'){
	var value = false;
	var sprites = buttonSpritePack.sprites;
	
	let curTextColor = font_color;

	if(pointInScreenRect(mouse, x, y, w, h)){
		sprites = buttonSpritePack.spritesH;

		curTextColor = font_color_h
		
		if(mousePressL){
			sprites = buttonSpritePack.spritesA;
		}
		if(mouseClickL){
			value = true;
		}
	}
	GUIDrawSlicedSprite(x, y, w, h, sprites);
	
	if(text)
		DrawText(x+ w/2-(text.length/2*6), y-h/2+4, text, curTextColor);
	return value;
}


function GUISlider(x,y,w,h, v, min=0, max=1, step=0.1){
	//GUIDrawSlicedSprite(x, y, w, h, sliderSpritePack.background);

	DrawBox(x, y, w, h);

	var d = (max-min);
	
	var s = d/step;
	var pX = v - min;
	
	v = nearest(v, min, max, s);
	console.log(`v:${v}, d:${s} = ${pX}`)

	if(pointInScreenRect(mouse, x, y, w, h)){
		
		if(mousePressL){
			
			pX = (Math.round((mouse.x - x) / d) * d) / w
			v = min+((pX*d)/(d))*d;

			nearest(v, min, max, s);

			//v = (Math.round((v) / d) * d)
			//console.log(pX)	
		}
		if(mouseClickL){
			value = true;
		}
	}
	//console.log(v)		

	DrawBox(x+pX * w-5, y-h/2+10, 10, 20, 'rgba(255, 255, 255, 1)')

	return v;
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
	var headlen = 8;
	
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


var buttonSpritePack = {
	sprites : [
		new Sprite('res/gui.png', [0,  32] , [8, 8]),
		new Sprite('res/gui.png', [8,  32] , [8, 8]),
		new Sprite('res/gui.png', [16, 32] , [8, 8]),
		                                       
		new Sprite('res/gui.png', [0,  32+8] , [8, 8]),
		new Sprite('res/gui.png', [8,  32+8] , [8, 8]),
		new Sprite('res/gui.png', [16, 32+8] , [8, 8]),
		                                        
		new Sprite('res/gui.png', [0, 32+16] , [8, 8]),
		new Sprite('res/gui.png', [8, 32+16] , [8, 8]),
		new Sprite('res/gui.png', [16,32+16] , [8, 8]),
	],
	
	spritesH : [
		new Sprite('res/gui.png', [0+24,  32] , [8, 8]),
		new Sprite('res/gui.png', [8+24,  32] , [8, 8]),
		new Sprite('res/gui.png', [16+24, 32] , [8, 8]),
		                                        
		new Sprite('res/gui.png', [0+24,  32+8] , [8, 8]),
		new Sprite('res/gui.png', [8+24,  32+8] , [8, 8]),
		new Sprite('res/gui.png', [16+24, 32+8] , [8, 8]),
		                                        
		new Sprite('res/gui.png', [0+24, 32+16] , [8, 8]),
		new Sprite('res/gui.png', [8+24, 32+16] , [8, 8]),
		new Sprite('res/gui.png', [16+24,32+16] , [8, 8]),
	],                  
	                    
	spritesA : [        
		new Sprite('res/gui.png', [0+48,  32] , [8, 8]),
		new Sprite('res/gui.png', [8+48,  32] , [8, 8]),
		new Sprite('res/gui.png', [16+48, 32] , [8, 8]),
		                                       
		new Sprite('res/gui.png', [0+48,  32+8] , [8, 8]),
		new Sprite('res/gui.png', [8+48,  32+8] , [8, 8]),
		new Sprite('res/gui.png', [16+48, 32+8] , [8, 8]),
		                                      
		new Sprite('res/gui.png', [0+48, 32+16] , [8, 8]),
		new Sprite('res/gui.png', [8+48, 32+16] , [8, 8]),
		new Sprite('res/gui.png', [16+48,32+16] , [8, 8]),
	],
}
	
	
var panelSpritePack = {
	sprites : [
		new Sprite('res/gui.png', [32,  0] , [8, 12]),
		new Sprite('res/gui.png', [32+8,  0] , [16, 12]),
		new Sprite('res/gui.png', [32+24, 0] , [8, 12]),
												
		new Sprite('res/gui.png', [32,  12] , [8, 12]),
		new Sprite('res/gui.png', [32+8,  12] , [16, 12]),
		new Sprite('res/gui.png', [32+24, 12] , [8, 12]),
												
		new Sprite('res/gui.png', [32, 24] , [8, 8]),
		new Sprite('res/gui.png', [32+8, 24] , [16, 8]),
		new Sprite('res/gui.png', [32+24,24] , [8, 8]),
	],
}

var panel2SpritePack = {
	sprites : [
		new Sprite('res/gui.png', [72,  0] , [8, 8]),
		new Sprite('res/gui.png', [72+8,  0] , [8, 8]),
		new Sprite('res/gui.png', [72+16, 0] , [8, 8]),
												
		new Sprite('res/gui.png', [72,  8] , [8, 8]),
		new Sprite('res/gui.png', [72+8,  8] , [8, 8]),
		new Sprite('res/gui.png', [72+16, 8] , [8, 8]),
												
		new Sprite('res/gui.png', [72, 16] , [8, 8]),
		new Sprite('res/gui.png', [72+8, 16] , [8, 8]),
		new Sprite('res/gui.png', [72+16,16] , [8, 8]),
	],
}

var sliderSpritePack = {
	background : [
		new Sprite('res/gui.png', [48,  56] , [8, 3]),
		new Sprite('res/gui.png', [48+8,  56] , [8, 3]),
		new Sprite('res/gui.png', [48+16, 56] , [8, 3]),
												
		new Sprite('res/gui.png', [48,  56+3] , [8, 2]),
		new Sprite('res/gui.png', [48+8,  56+3] , [8, 2]),
		new Sprite('res/gui.png', [48+16, 56+3] , [8, 2]),
												
		new Sprite('res/gui.png', [48, 56+4] , [8, 3]),
		new Sprite('res/gui.png', [48+8, 56+4] , [8, 3]),
		new Sprite('res/gui.png', [48+16,56+4] , [8, 3]),
	],

	handle : [
		new Sprite('res/gui.png', [48,  56] , [8, 3]),
		new Sprite('res/gui.png', [48+8,  56] , [8, 3]),
		new Sprite('res/gui.png', [48+16, 56] , [8, 3]),
												
		new Sprite('res/gui.png', [48,  56+3] , [8, 2]),
		new Sprite('res/gui.png', [48+8,  56+3] , [8, 2]),
		new Sprite('res/gui.png', [48+16, 56+3] , [8, 2]),
												
		new Sprite('res/gui.png', [48, 56+4] , [8, 3]),
		new Sprite('res/gui.png', [48+8, 56+4] , [8, 3]),
		new Sprite('res/gui.png', [48+16,56+4] , [8, 3]),
	],
}
