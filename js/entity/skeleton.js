
class Skeleton extends Living 
{

	constructor(name) 
	{
		super(name);

		this.speed = randomFRange(0.1,2);
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:0, y:0, z:0};
		this.sprite = new Sprite('res/skeleton.png', [0, 64], [32, 32], 8, [0,1,2,3,4,5,6,7]);
		
		this.timer = 0;
		
		
		this.isActing = false;
		this.actionTimer = 0;
		this.lastDir = {x:0, y:0, z:0};

		this.path = []
	}
	
	update(dt) 
	{
		super.update(dt);

		//Speedup animation speed base on velocity
		this.animMul = (!this.isActing)? vectorMagnitude({x:this.dir.x*this.speed, y:this.dir.y*this.speed, z:0})/this.speed/2 : 1;
		//console.log(this.animMul);	//???

		if(!this.isActing){
			
			if(vectorMagnitude({x:this.dir.x, y:this.dir.y, z:0}) == 0){
				//idle anim
				this.sprite.pos = [0,0];	this.sprite.size = [32,32];	this.curAnim = [0];
			}else{
				//walk anim
				this.sprite.pos = [0,32];	this.sprite.size = [32,32]; this.curAnim = [0,1,2,3];
			}

			//Attack target
			let dirToTarget = vectorSubstract(player.pos, this.pos);
			let distToTarget = vectorMagnitude(dirToTarget);
			if(distToTarget <= 0.8){
				this.lookDir = vectorNormalize(dirToTarget);
				this.attack();
			}
		}
		
		
		
		
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
			
			var graph = new Graph(tiles);
			if(
				posInBounds(this.pos, {w:level.map.width, h:level.map.height}) &&
				posInBounds(player.pos, {w:level.map.width, h:level.map.height})
			){

				var start = graph.grid[Math.round(this.pos.x)][Math.round(this.pos.y)];
				var end = graph.grid[Math.round(player.pos.x)][Math.round(player.pos.y)];	
				
				var result = astar.search(graph, start, end, false)
				//console.log(start+" -> "+end + " = " +result)

				if(result.length > 0){
					this.path = result;
				}
			}
			

			this.timer = 5;
		}

		//move along path
		if(this.path.length > 0 && this.curAction == ""){
			var vd = {x:this.path[0].x-this.pos.x, y:this.path[0].y-this.pos.y, z:this.dir.z};
			var d = vectorMagnitude(vd)
			this.dir = vectorNormalize(vd)

			if(d <= 0.5)
				this.path.shift()
		}
		else{
			this.dir = vector(0,0,0);
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

		
		//this.sprite.update(dt);
		//console.log(this.sprite._index);
	}

	attack(){
		if(this.isActing) return;
		
		this.isActing = true;
		this.curAction = `attack`;
		this.actionTimer = 0.8;

		this.curAnimFrame = 0;
		this.sprite.pos = [0,64];	this.sprite.size = [32,32];
		
		this.vel = {x:0, y:0, z:this.vel.z};
		
		this.attackIndx = (this.attackIndx+1)%1;

		
		let attackDir = vectorNormalize(this.lookDir);

		for(var i=0; i<enemies.length; i++){
			
			let e = enemies[i];
			if(e == this) continue;

			if(collidesCircles(e.pos, 0.3, vectorAdd(this.pos, vectorMultiply(attackDir, 0.5)), 0.8).isCollides){
				
				let dmg = {value:randomRange(6,10), dir:vectorNormalize(vectorSubstract(e.pos, this.pos))}
				e.setDamage(dmg);

				//dmg particle (mb change it to some kind of damage log data)
				dmgParticles.push({
					pos:e.pos, 
					dir:dmg.dir,
					dmg:dmg.value, 
					t:0.2
				})

				audio.play("res/audio/death.wav");
			}
		}
	}

	death(){
		super.death();

		var index = enemies.indexOf(this);
		if (index > -1)	enemies.splice(index, 1);

		//???
		let p = new PSAsh();
		//p.dir = dmg.dir;
		p.pos = vectorAdd(this.pos, vector(0,0,1));

		super.remove();
	}

	onGetDamage(dmg){
		super.onGetDamage(dmg);

		this.isActing = true;
		this.curAction = `hurt`;
		this.actionTimer = (this.actionTimer > 0.1)? this.actionTimer : 0.1;

		this.curAnimFrame = 0;
		this.sprite.pos = [0,96];	this.sprite.size = [32,32];	this.sprite.frames = [0];

		//???
		let p = new PSBlood();
		p.dir = dmg.dir;
		p.pos = vectorAdd(this.pos, vector(0,0,1));

		audio.play("res/audio/death.wav");
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