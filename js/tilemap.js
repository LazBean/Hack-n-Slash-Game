
TILE_WIDTH = 32;
TILE_HEIGHT = 16;

TILE_WIDTH_HALF = TILE_WIDTH/2;
TILE_HEIGHT_HALF = TILE_HEIGHT/2;

function ScreenToIsometric(pos) {
	var x = pos.x + camera.x;
	var y = pos.y + camera.y;
	var xx = x / TILE_WIDTH + y / TILE_HEIGHT; //(mx / TILE_WIDTH_HALF + my / TILE_HEIGHT_HALF) /2;
	var yy = y / TILE_HEIGHT - x / TILE_WIDTH; //(my / TILE_HEIGHT_HALF - (mx / TILE_WIDTH_HALF)) /2;
    return {x:xx, y:yy, z:pos.z};
}

function FromIsometricToScreen(pos) {
    return pos;
}

function WorldToIsometric(pos) {
	var nPos = {x:(pos.x - pos.y) * TILE_WIDTH_HALF, y: (pos.x + pos.y) * TILE_HEIGHT_HALF + pos.z * TILE_HEIGHT};
	//var nPos = {x:(pos.x - pos.y) * Math.cos(30*(3.18/180)), y:pos.z + (pos.x + pos.y) * Math.sin(30*(3.18/180)), z:pos.z};
    return nPos;
}




var tilemap = {
	width: 0,
	height: 0,
	data: [,],
	
	sprites: [
		new Sprite('res/tiles.png', [0, 0], [32, 16]),	 	//floor 0
		new Sprite('res/tiles.png', [0, 16], [32, 16]), 	//floor 1
		
		new Sprite('res/tiles.png', [0, 32], [32, 32]),		//wall
		
		new Sprite('res/tiles.png', [32, 32], [32, 32]),	
	],
	
	create: function(w,h){
		this.width = 16;
		this.height = 16;
		
		
		//set tiles
		for(var x=0; x<this.width; x++){
			for(var y=0; y<this.height; y++){
				
				
				//this.data[x,y] = 1;
			}	
		}
	},
	
	update: function(dt){
		
	},
	
	render: function(ctx){
		
		for(var x=0; x<this.width; x++){
			for(var y=0; y<this.height; y++){
			
				var tile = this.getTile(x,y);
				
				var offsetH = 0;
				var offsDepth = -9;
				if(tile > 1){
					offsetH = 8;
					offsDepth = 5;
					/*renderData.push({
						pos: [(x - y) * 16, (x + y) * 8 + offsetH+16, 0],
						sprite: this.sprites[parseInt(tile+1)],
						depth: -(y+x-1)*10-5,
					});*/
				}

				isoPos = WorldToIsometric({x:x, y:y, z:0});
				isoPos.y += offsetH;	
				
				renderData.push({
					pos: isoPos,
					sprite: this.sprites[parseInt(tile)],
					depth: -(y+x)*10+offsDepth,
				});
				
			}	
		}
	},
	
	
	getTile: function(x,y){
		if(this.data==null || x<0 || x>=this.width || y<0 || y>=this.height)
			return null;
		return this.data[x][y];
	},

	getTilePos: function(pos){
		var x = Math.round(pos.x);
		var y = Math.round(pos.y);
		var z = Math.round(pos.z);
		return {x:x, y:y, z:z};
	},
	
	setTile: function(x,y,id){
		if(this.getTile(x,y) == null)
			return;
		this.data[x][y] = id;
	},
};




/*var lightmap = {
	width: 0,
	height: 0,
	tiles: [],
	
	start: function(tilemap){
		this.width = tilemap.width;
		this.height = tilemap.height;
		
		this.tiles = [];
		
		//generate
		for(var x=0; x<this.width; x++){
			for(var y=0; y<this.height; y++){
			
				var v = 0;
				if(tilemap.getTile(x,y)!=0){
					v = 1;
				}
				this.setTile(x,y, v);
			}	
		}
	},
	
	update: function(dt){
		
	},
	
	render: function(ctx){
		
		for(var x=0; x<this.width; x++){
			for(var y=0; y<this.height; y++){
			
				var tile = this.tiles[x + this.width * y];
				
				var v = 0.5;
				if(!this.tileBlocked(x,y)) v = v/2;
				
				if(tile!=0){
					ctx.fillStyle = 'rgba(0,0,0,'+v+')';
					ctx.fillRect(Math.round(x*8), canvas.height-Math.round(y*8+8), 8, 8);
				}	
			}
		}
	},

};*/


