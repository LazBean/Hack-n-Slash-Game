
//
var debugMode = false;
var cursorTilePos = [0,0,0];

//
var player;
var goldCount = 0;

var entities = [];
var particles = [];

var mapData = [
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,2,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,2,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,2,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2],
	[0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,2],
	[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
];

var level = {
    
	map: tilemap,
	
	
	//UPDATE
	start: function() {
		this.map = tilemap;
		this.map.data = mapData;
		this.map.create(16,8);
		
		for(var i=0; i<entities.length; i++) {
			entities[i].start();
		}
		for(var i=0; i<particles.length; i++) {
			particles[i].start();
		}
		
		
		for(var i=0; i<10; i++){
			//spawnParticle([50,20]);
		}
		
		for(var i=0; i<10; i++){
			//spawnHuman([randomRange(10,canvas.width-20),canvas.height-20]);
		}
		
			
		//new Chest();
		//new Ball();
		//MOB
		player = new Player();
			
		
	},
	
	update: function(dt) {
	
		this.map.update(dt);
		
		for(var i=0; i<entities.length; i++) {
			entities[i].update(dt);
		}
		
		for(var i=0; i<particles.length; i++) {
			particles[i].update(dt);
		}
		
		//CAMERA FOLLOW
		var playerToScreen = WorldToIsometric(player.pos);
		camera[0] = playerToScreen[0]-canvas.width/2;
		camera[1] = playerToScreen[1]-canvas.height/2;
		
		
		
    },
	
	render: function(ctx){
		
		for(var i=0; i<entities.length; i++) {
			entities[i].render(ctx);
		}
		this.map.render(ctx);




		//DEBUG
		if(!debugMode) return;
		//GHOST TILE
		cursorTilePos = ScreenToIsometric(mouse);

		cursorTilePos[0] = Math.round(cursorTilePos[0]);
		cursorTilePos[1] = Math.round(cursorTilePos[1]);

		if(mousePressL && input.isDown('CTRL')){
			this.map.data[cursorTilePos[0]][cursorTilePos[1]] = 2;
		}
		if(mousePressR && input.isDown('CTRL')){
			this.map.data[cursorTilePos[0]][cursorTilePos[1]] = 0;
		}

		renderData.push({
			pos: WorldToIsometric(cursorTilePos),
			sprite: new Sprite('res/tiles.png', [64, 0]  , [32, 16],0,[0], 0),
			depth: 1000,
		});
	},
	
	onGUI: function(ctx){
	
		
		if(GUIButton(canvas.width-24, canvas.height-0, 24, 24)){
			debugMode = !debugMode;
			audio.play('audio/hoverUI.wav');
		}
		
		GUIDrawTextSprite("GOLD:"+goldCount, 100, canvas.height-4);

		if(debugMode){
			DrawText(mouse[0] + 10, mouse[1]-10, ''+cursorTilePos, "rgba(160, 160, 160, 1)");
		}
		
		
		/*var spr = new Sprite('res/gui.png', [0, 0], [8, 8], 8, [0,1,2,3], -40);
		GUIDrawSprite(canvas.width-24, canvas.height-0, spr ,[0,0,24,24]);*/
		
		//fpsGraph.render(ctx);
	}
		
		
	
};




















clr  = {r: 255, g: 128, b: 0, a: 128};

black = {r: 0, g: 0, b: 0, a: 255};
red = {r: 255, g: 0, b: 0, a: 255};

var getPixel = function(x,y){
	//ctx.save();
	//ctx.restore();
	var data = ctx.getImageData(x, y, 1, 1).data;
	var color = {r: data[0], g: data[1], b: data[2], a: data[3]};
	return color;
}

var setPixel = function (x,y,c) {
    var p = ctx.createImageData(1,1);
    p.data[0]=c.r;
    p.data[1]=c.g;
    p.data[2]=c.b;
    p.data[3]=c.a;
    ctx.putImageData(p,Math.ceil(x|0),Math.ceil(y|0));
}

var setPixels = function(xx,yy,w,h,c){

	for(var x=0; x<w; x++){
		for(var y=0; y<h; y++){
			setPixel(xx+x, yy+y, c);
		}
	}
}

var multiplyPixel = function(c1, c2){
	var c = c1;
	c[0] = (c1[0]/255)*(c2[0]/255)*255;
	c[1] = (c1[1]/255)*(c2[1]/255)*255;
	c[2] = (c1[2]/255)*(c2[2]/255)*255;
	return c;
}

var luminance = function(color){
	color[0] = color[0] / 2;
	color[1] = color[1] / 2;
	color[2] = color[2] / 2;
	return color;
}

var light = function(xx,yy,w,h){

	for(var x=0; x<w; x++){
		for(var y=0; y<h; y++){
			c = getPixel(xx+x, yy+y);
			setPixel(xx+x, yy+y, c);
		}
	}
}








////
function getImageData( image ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

}

function getPixel( imagedata, x, y ) {

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}

//var imagedata = getImageData( imgTexture.image );
//var color = getPixel( imagedata, 10, 10 );



