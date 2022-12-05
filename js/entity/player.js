
class Player extends Entity 
{

	constructor(name) 
	{
		super(name);

		this.color = null
		
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

	jump(){
		if(!this.isActing){
				
			this.isActing = true;
			this.actionTimer = 0.8;

			this.curFrame = 0;
			this.sprite.pos = [0,64];	this.sprite.size = [32,32]
		}
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
			
			
			
			//sprite direction
			if(this.dir.x > 0)
				this.sprite.scaleX = 1;
			else if(this.dir.x < 0)
				this.sprite.scaleX = -1;

			this.dir = vectorRotate( this.dir, 45);

			//Jump
			
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