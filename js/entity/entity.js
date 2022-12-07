

class Entity 
{
	constructor(name="?") 
	{
		this.name = name;
		this.speed = 0;
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:0, y:0, z:0};
		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2]);
		
		entities.push(this);
	}

	remove() 
	{
		entities.remove(this);
	}
         
	update(dt) 
	{
		
	}

	render(ctx) 
	{
		this.sprite.offset = [0,12];
		this.sprite.depth = -this.pos.y+this.pos.z+1;
		renderData.push(this);
	}
  
	remove()
	{
		var index = entities.indexOf(this);
		if (index > -1) 
		{
			entities.splice(index, 1);
		}
	}

	collision(){
		es = getEntitiesToCollideWith(this.pos);
		for(var i=0; i<es.length; i++) {
			var e = es[i];
			var hit = collidesCircles(this.pos, 0.3, e.pos, 0.3);
			if(hit.isCollides){
				this.pos = {
					x:this.pos.x + hit.normal.x * hit.overlap, 
					y:this.pos.y + hit.normal.y * hit.overlap, 
					z:this.pos.z + hit.normal.z * hit.overlap
				};
			}
		}
	}

	collisionTilemap(){
		
	}
}



class Skeleton extends Entity 
{

	constructor(name) 
	{
		super(name);
		
		this.speed = 2;
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:4 + randomFRange(0,8), y:4 + randomFRange(0,8), z:0};
		this.sprite = new Sprite('res/skeleton.png', [0, 0], [32, 32], 8, [0,1,2,3,4,5,6,7]);
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [0,1,2,3,4,5,6,7];
		
		this.isActing = false;

		this.actionTimer = 0;
		this.lastDir = {x:0, y:0, z:0};
	}
	
	update(dt) 
	{
		super.update(dt);
		
		this.timer -= dt
		if(this.timer <= 0 || this.path.length == 0){
			
			var tiles = [];
			for(var x=0; x<level.map.width; x++){
				tiles[x] = []
				for(var y=0; y<level.map.height; y++){

					if(level.map.getTile(x,y) == 2){
						tiles[x][y] = 0
					}
					else{
						tiles[x][y] = 1
					}
					
				}
			}
			//console.log(tiles)
			var graph = new Graph(tiles);
			
			var start = graph.grid[Math.round(this.pos.x)][Math.round(this.pos.y)];
			var end = graph.grid[Math.round(player.pos.x)][Math.round(player.pos.y)];	
			
			var result = astar.search(graph, start, end, false)
			//console.log(start+" -> "+end + " = " +result)

			if(result.length > 0){
				this.path = result
			}

			this.timer = 5;
		}

		if(this.path.length > 0){
			var vd = {x:this.path[0].x-this.pos.x, y:this.path[0].y-this.pos.y, z:this.dir.z};
			var d = vectorLength(vd)
			this.dir = vectorNormalize(vd)

			if(d <= 0.5)
				this.path.shift()

				
		}
		
		//this.dir = {x: 1, y:0, z:0}
		var newPos = {
			x: this.pos.x + this.dir.x * this.speed * dt, 
			y: this.pos.y + this.dir.y * this.speed * dt,
			z: this.pos.z + this.dir.z * dt,
		};	

		//if(!isColliding)
			this.pos = newPos;
				
		this.collision();
		this.pos.z = Math.clamp(this.pos.z,0,999);
	}

	render(ctx)
	{
		this.sprite.offset = [0,16];
		
		renderData.push({
			pos: WorldToIsometric(this.pos),
			sprite: this.sprite,
			depth: -(this.pos.y+this.pos.x)*10+5,
		});

		//shadow
		renderData.push({
			pos: WorldToIsometric(this.pos),
			sprite: new Sprite('res/misc.png', [0, 0], [16, 8],0,[0]),
			depth: -(this.pos.y+this.pos.x)*10+1,
		});
	}
}
