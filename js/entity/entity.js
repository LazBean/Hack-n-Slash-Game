

class Entity 
{
	constructor(name) 
	{
		this.name = name;
		this.speed = 0;
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:0, y:0, z:0};
		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2]);
		
		entities.push(this);
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




class Player extends Entity 
{

	constructor(name) 
	{
		super(name);
		
		this.speed = 4;
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:4 + randomFRange(0,8), y:4 + randomFRange(0,8), z:0};
		this.sprite = new Sprite('res/player.png', [0, 0], [32, 32], 8, [0,1,2,3,4,5,6,7]);
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [0,1,2,3,4,5,6,7];
		
		this.isActing = false;

		this.actionTimer = 0;
		this.lastDir = {x:0, y:0, z:0};
		this.attackIndx = 0;
	}
	
	update(dt) 
	{
		super.update(dt);
		//this.sprite.update();
		
		//anim
		if(!this.isActing){

			if(vectorLength({x:this.dir.x, y:this.dir.y, z:0}) == 0){

				this.sprite.pos = [0,0];	this.sprite.size = [32,32]
			}else{
				this.sprite.pos = [0,32];	this.sprite.size = [32,32]
			}
		}
		
		var tm = 1;
		if(!this.isActing)
			tm = vectorLength({x:this.dir.x*this.speed, y:this.dir.y*this.speed, z:0})/this.speed;
		
		this.timer -= dt * tm;
		if(this.timer<=0){
			this.curFrame = (this.curFrame+1)%this.curAnim.length;
			this.sprite.frames = [this.curAnim[this.curFrame]];
			this.timer = 0.1;
		}
		
		//movement

		if(!this.isActing){
			this.dir = {x:0, y:0, z:this.dir.z};

			//Move Control
			if(input.isDown('W')){
				this.dir.y = 1;	
			}
			if(input.isDown('S')){
				this.dir.y = -1;
			}
			if(input.isDown('A')){
				this.dir.x = -1;	
			}
			if(input.isDown('D')){
				this.dir.x = 1;	
			}
			this.dir = vectorNormalize(this.dir);
			
			//sprite direction
			if(this.dir.x > 0)
				this.sprite.scaleX = 1;
			else if(this.dir.x < 0)
				this.sprite.scaleX = -1;

			this.dir = vectorRotate( this.dir, 45);

			//Jump
			if(input.isDown('space') && !this.isActing){
				
				this.isActing = true;
				this.actionTimer = 0.8;

				this.curFrame = 0;
				this.sprite.pos = [0,64];	this.sprite.size = [32,32]
			}
			//Attack
			if(input.isDown('e') && !this.isActing){
				
				this.isActing = true;
				this.actionTimer = 0.8;

				this.curFrame = 0;
				this.sprite.pos = [0,96 + 32*this.attackIndx];	this.sprite.size = [48,32]
				
				this.dir = {x:0, y:0, z:this.dir.z};
				this.attackIndx = (this.attackIndx+1)%2;
			}

			
		}
		
		
		
		if(this.actionTimer <= 0){
			this.isActing = false;
		}

		this.actionTimer -= dt;
		
		
		//pickup gold
		/*for(var i=0; i<entities.length; i++){
			
			var e = entities[i];
			if(e.name == "coin" && Distance(this.pos, e.pos)<16 && !e.picked){
				entities[i].pickup(this);
			}
		}*/
		
		
		//this.dir = vectorLerp(this.dir, [0,0,-128], 0.05);
		this.lastDir = this.dir;
		
		
		var newPos = {
			x: this.pos.x + this.dir.x * this.speed * dt, 
			y: this.pos.y + this.dir.y * this.speed * dt,
			z: this.pos.z + this.dir.z * dt,
		};

		//map collision
		var tilePos = level.map.getTilePos(newPos);
		
		var isColliding = false;

		outer_loop: 
		for(var x=-1; x<=1; x++){
			for(var y=-1; y<=1; y++){
				
				var tile = level.map.getTile(tilePos.x+x, tilePos.y+y);
				if(tile == null || tile >= 2){

					if(rectCircleColliding({x:newPos.x, y:newPos.y, r:0.8}, {x:tilePos.x+x, y:tilePos.y+y, w:1-1, h:1-1})){
						isColliding = true;
						break outer_loop;
					}
				}
			}	
		}

		if(!isColliding)
			this.pos = newPos;
			
		this.collision();	
		this.pos.z = Math.clamp(this.pos.z,0,999);
	}

	render(ctx)
	{
		this.sprite.offset = [0,16];
		//renderData.push(this);
		//console.log(this.pos);
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
