


var tilemap = {
	width: 0,
	height: 0,
	data: [,],
	
	sprites: [
		new Sprite('res/tiles.png', [0, 0]  , [32, 16],0,[0], -300),	 	//floor 0
		new Sprite('res/tiles.png', [0, 16]  , [32, 16],0,[0], -300), 	//floor 1
		
		new Sprite('res/tiles.png', [0, 32] , [32, 32],0,[0], -200),		//wall
		
		new Sprite('res/tiles.png', [0, 48] , [24, 16],0,[0], -500),		//floor
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
		/*if(mousePress0 && input.isDown('CTRL')){
			this.setTile(Math.floor((mouseWorld[0])/24), Math.floor(mouseWorld[1]/16), 1);
		}
		if(mousePress2 && input.isDown('CTRL')){
			this.setTile(Math.floor((mouseWorld[0])/24), Math.floor(mouseWorld[1]/16), 0);
		}*/
	},
	
	render: function(ctx){
		
		for(var x=0; x<this.width; x++){
			for(var y=0; y<this.height; y++){
			
				var tile = this.data[x][y];
				//console.log(tile);
				var sprite = this.sprites[parseInt(tile)]
				
				var h = 0;
				if(tile > 1)
					h = 8;
				
				renderData.push({
					pos: [(x - y) * 16, (x + y) * 8+h, 0],
					sprite: sprite,
				});
				
				/*var up    = (this.getTile(x  , y+1) == 0 || (y+1)>=this.h);
				var right = (this.getTile(x+1, y  ) == 0);
				var left  = (this.getTile(x-1, y  ) == 0);
				var down  = (this.getTile(x  , y-1) == 0);
				
				//if(tile!=0){
				
					var indx = 3;
						 if(up){
							renderData.push({
								pos: [x*24+12, (y+1)*16+8+8, 0],
								sprite: this.sprites[2],
							});
							renderData.push({
								pos: [x*24+12, (y+3)*16+8, 0],
								sprite: this.sprites[0],
							});
						 }
					else if(up && !left && !down && !right) indx = 1;
				
					renderData.push({
						pos: [x*24+12, y*16+8, 0],
						sprite: this.sprites[indx],
					});

				//}*/
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


