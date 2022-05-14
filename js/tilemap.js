
TILE_WIDTH = 32;
TILE_HEIGHT = 16;

TILE_WIDTH_HALF = TILE_WIDTH/2;
TILE_HEIGHT_HALF = TILE_HEIGHT/2;

function ScreenToIsometric(pos) {
	var x = pos[0] + camera[0];
	var y = pos[1] + camera[1];
	var xx = x / TILE_WIDTH + y / TILE_HEIGHT; //(mx / TILE_WIDTH_HALF + my / TILE_HEIGHT_HALF) /2;
	var yy = y / TILE_HEIGHT - x / TILE_WIDTH; //(my / TILE_HEIGHT_HALF - (mx / TILE_WIDTH_HALF)) /2;
    return [xx,yy,pos[2]];
}

function FromIsometricToScreen(pos) {
    return pos;
}

function WorldToIsometric(pos) {
	var nPos = [(pos[0] - pos[1]) * TILE_WIDTH_HALF, (pos[0] + pos[1]) * TILE_HEIGHT_HALF, pos[2]];
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
			
				var tile = this.data[x][y];
				
				var offsetH = 0;
				if(tile > 1){
					offsetH = 8;

					/*renderData.push({
						pos: [(x - y) * 16, (x + y) * 8 + offsetH+16, 0],
						sprite: this.sprites[parseInt(tile+1)],
						depth: -(y+x-1)*10-5,
					});*/
				}
					
				
				renderData.push({
					pos: [(x - y) * 16, (x + y) * 8 + offsetH, 0],
					sprite: this.sprites[parseInt(tile)],
					depth: -(y+x)*10-5,
				});
				
				
			}	
		}
	},
	
	
	/*getTile: function(x,y){
		return this.data[y * this.width + x];
	},
	
	setTile: function(x,y,id){
		this.data[y * this.width + x] = id;
	},*/
};













var lightmap = {
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
	
	
	getTile: function(x,y){
		return this.tiles[y * this.width + x];
	},
	
	setTile: function(x,y,id){
		this.tiles[y * this.width + x] = id;
	},
	
	tileBlocked: function (x,y){
		var up    = (this.tiles[x + this.width * (y+1)] == 1);
		var right = (this.tiles[(x+1) + this.width * (y)] == 1);
		var left  = (this.tiles[(x-1) + this.width * (y)] == 1);
		var down  = (this.tiles[x + this.width * (y-1)] == 1);
		
		var v = up && right && left && down;
		return v;
	},
};


