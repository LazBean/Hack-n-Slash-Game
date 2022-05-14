
function DrawUI(){

	DrawText(5, canvas.height-30, 'Cursor Pos: [' + (mouse[0]).toFixed(2) + ', ' + (mouse[1]).toFixed(2) + ']', 'rgba(0,0,0,0.5)');
	DrawText(5, canvas.height-40, 'Mouse World Pos: [' + (mouseWorld[0]).toFixed(2) + ', ' + (mouseWorld[1]).toFixed(2) + ']', 'rgba(0,0,0,0.5)');
	
	DrawText(5, canvas.height-50, 'Tile Pos: [' + Math.floor(mouse[0]/8)+ ', ' + Math.floor(mouse[1]/8) + ']', 'rgba(0,0,0,0.5)');
	
	DrawText(5, canvas.height-60, 'Camera Pos: [' + (camera[0]).toFixed(2) + ', ' + (camera[1]).toFixed(2) + ']', 'rgba(0,0,0,0.5)');


	//ENTITY LIST
	//button
	if(GUIButton(canvas.width-24, canvas.height-0, 24, 24)){
		eListShow = !eListShow;
		audio.play('audio/hoverUI.wav');
	}
	
	
	var sv = {value: 0};
	GUIHorizontalSlider(100,canvas.height,100,16, sv);
	DrawText(canvas.width/2-50, canvas.height-5, 'Slider Pos: ['+sv.value+']', 'rgba(0,0,0,0.5)');

	
	
	
	if(!eListShow) return;
	
	DrawBox(canvas.width-150, canvas.height, 150, 10*entities.length+(5*(entities.length/entities.length)), "rgba(0, 0, 0, 0.5)");
	for(var i=0; i<entities.length; i++){
		var e = entities[i];
		DrawText(canvas.width-150+5, canvas.height-i*10-2, '['+i+'] '+e.name + '   ' + '['+(Math.ceil(e.pos[0]/8))+', '+(Math.ceil(e.pos[1]/8))+']', "rgba("+((e.selected)?10:160)+", 160, 160, 1)");
	}
}

var eListShow = false;
var ButtonSprite = new Sprite('res/gui.png', [0, 16] , [48, 48],0,[0]);
var ButtonSpriteHover = new Sprite('res/gui.png', [24, 0] , [24, 24],0,[0]);
var ButtonSpriteActive = new Sprite('res/gui.png', [24, 0] , [24, 24],0,[0]);



function GUIButton(x,y,w,h){
	var value = false;
	var sprites = buttonSpritePack.sprites;
	
	if(pointInScreenRect(mouse, [x,y], w, h)){
		sprites = buttonSpritePack.spritesH;
		
		if(mousePress0){
			sprites = buttonSpritePack.spritesA;
		}
		if(mouseClick0){
			value = true;
		}
	}
	GUIDrawSlicedSprite(x, y, w, h, sprites);
	return value;
}

function GUIHorizontalSlider(x,y,w,h, value){
	GUIDrawSlicedSprite(x, y, w, h, buttonSpritePack.sprites);
	
	GUIDrawSlicedSprite(x, y, w, h, headerSpritePack.sprites);
	value.value = 10;
	//return 10;
}












var buttonSpritePack = {
	sprites : [
		new Sprite('res/gui.png', [0,  0] , [8, 8]),
		new Sprite('res/gui.png', [8,  0] , [8, 8]),
		new Sprite('res/gui.png', [16, 0] , [8, 8]),
		                                       
		new Sprite('res/gui.png', [0,  8] , [8, 8]),
		new Sprite('res/gui.png', [8,  8] , [8, 8]),
		new Sprite('res/gui.png', [16, 8] , [8, 8]),
		                                        
		new Sprite('res/gui.png', [0, 16] , [8, 8]),
		new Sprite('res/gui.png', [8, 16] , [8, 8]),
		new Sprite('res/gui.png', [16,16] , [8, 8]),
	],
	
	spritesH : [
		new Sprite('res/gui.png', [0+24,  0] , [8, 8]),
		new Sprite('res/gui.png', [8+24,  0] , [8, 8]),
		new Sprite('res/gui.png', [16+24, 0] , [8, 8]),
		                                        
		new Sprite('res/gui.png', [0+24,  8] , [8, 8]),
		new Sprite('res/gui.png', [8+24,  8] , [8, 8]),
		new Sprite('res/gui.png', [16+24, 8] , [8, 8]),
		                                        
		new Sprite('res/gui.png', [0+24, 16] , [8, 8]),
		new Sprite('res/gui.png', [8+24, 16] , [8, 8]),
		new Sprite('res/gui.png', [16+24,16] , [8, 8]),
	],                  
	                    
	spritesA : [        
		new Sprite('res/gui.png', [0+48,  0] , [8, 8]),
		new Sprite('res/gui.png', [8+48,  0] , [8, 8]),
		new Sprite('res/gui.png', [16+48, 0] , [8, 8]),
		                                       
		new Sprite('res/gui.png', [0+48,  8] , [8, 8]),
		new Sprite('res/gui.png', [8+48,  8] , [8, 8]),
		new Sprite('res/gui.png', [16+48, 8] , [8, 8]),
		                                      
		new Sprite('res/gui.png', [0+48, 16] , [8, 8]),
		new Sprite('res/gui.png', [8+48, 16] , [8, 8]),
		new Sprite('res/gui.png', [16+48,16] , [8, 8]),
	],
}
	
	
var headerSpritePack = {
	sprites : [
		new Sprite('res/gui.png', [0,  0] , [8, 8]),
		new Sprite('res/gui.png', [8,  0] , [8, 8]),
		new Sprite('res/gui.png', [16, 0] , [8, 8]),
												
		new Sprite('res/gui.png', [0,  8] , [8, 8]),
		new Sprite('res/gui.png', [8,  8] , [8, 8]),
		new Sprite('res/gui.png', [16, 8] , [8, 8]),
												
		new Sprite('res/gui.png', [0, 16] , [8, 8]),
		new Sprite('res/gui.png', [8, 16] , [8, 8]),
		new Sprite('res/gui.png', [16,16] , [8, 8]),
	],
}










var fpsGraph = {
	
	points: [],
	timer: 0,
	
	render: function(ctx){
		this.timer -= dt;
		if(this.timer <= 0){
			this.points.push(Math.round(fps));
			if(this.points.length > 64)	this.points.splice(0,1);
			
			this.timer = 0.1;
		}
		
		
		var imgData = ctx.createImageData(32,32);
		for (var i=0;i<imgData.data.length;i+=4){
			imgData.data[i+0]=0;
			imgData.data[i+1]=0;
			imgData.data[i+2]=0;
			imgData.data[i+3]=128;
		}
		
		var w = imgData.width * 4;
		var h = imgData.height;
		
		for (var x=0;x<imgData.width;x+=4){
			for (var y=0;y<imgData.height;y+=4){
				
			}
		}
		
		/*for (var x=0;x<imgData.width;x+=1){
		//for (var x=0;x<this.points.length;x+=4){
			//var y =(this.points[x]);
			
			imgData.data[x+w*(h-10)+0]=10;
			imgData.data[x+w*(h-10)+1]=200;
			imgData.data[x+w*(h-10)+2]=50;
			imgData.data[x+w*(h-10)+3]=256;
		}
		
		imgData.data[(31+w*(31))+0]=255;
		imgData.data[(31+w*(31))+1]=0;
		imgData.data[(31+w*(31))+2]=0;
		imgData.data[(31+w*(31))+3]=255;*/

		ctx.putImageData(imgData, canvas.width/2-imgData.width/2, imgData.height);
	}
}






