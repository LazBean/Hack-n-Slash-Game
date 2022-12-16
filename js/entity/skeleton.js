
class Skeleton extends Living 
{

	constructor(name) 
	{
		super(name);
		
		this.speed = 2;
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:4 + randomFRange(0,8), y:4 + randomFRange(0,8), z:0};
		this.sprite = new Sprite('res/skeleton.png', [0, 64], [32, 32], 8, [0,1,2,3,4,5,6,7]);
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [0,1,2,3,4,5,6,7];
		
		this.isActing = false;

		this.actionTimer = 0;
		this.lastDir = {x:0, y:0, z:0};

		this.path = []
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
			
			if(
				Math.round(this.pos.x) >= 0 && Math.round(this.pos.x) < graph.width &&
				Math.round(this.pos.y) >= 0 && Math.round(this.pos.y) < graph.height &&
				Math.round(player.pos.x) >= 0 && Math.round(player.pos.x) < graph.width &&
				Math.round(player.pos.y) >= 0 && Math.round(player.pos.y) < graph.height 
			){

				var start = graph.grid[Math.round(this.pos.x)][Math.round(this.pos.y)];
				var end = graph.grid[Math.round(player.pos.x)][Math.round(player.pos.y)];	
				
				var result = astar.search(graph, start, end, false)
				//console.log(start+" -> "+end + " = " +result)

				if(result.length > 0){
					this.path = result
				}
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

		
		this.sprite.update(dt);
		//console.log(this.sprite._index);
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