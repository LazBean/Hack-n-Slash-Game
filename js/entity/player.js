
class Player extends Living 
{

	constructor(name) 
	{
		super(name);

		this.color = null
		
		this.sprite = new Sprite('res/player.png', [0, 0], [32, 32], 8, [0,1,2,3,4,5,6,7]);

		this.speed = 4;
		this.pos = {x:4 + randomFRange(0,8), y:4 + randomFRange(0,8), z:0};
		this.dir = {x:0, y:0, z:0};
		
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [0,1,2,3,4,5,6,7];
		
		this.isActing = false;

		this.actionTimer = 0;
		this.lastDir = {x:0, y:0, z:0};
		this.attackIndx = 0;
	}

	jump(){

		if(this.isActing) return;

		this.isActing = true;
		this.actionTimer = 0.8;

		this.curFrame = 0;
		this.sprite.pos = [0,64];	this.sprite.size = [32,32]
	}

	attack(){

		if(this.isActing) return;
		
		this.isActing = true;
		this.actionTimer = 0.8;

		this.curFrame = 0;
		this.sprite.pos = [0,96 + 32*this.attackIndx];	this.sprite.size = [48,32]
		
		this.dir = {x:0, y:0, z:this.dir.z};
		this.attackIndx = (this.attackIndx+1)%2;
	}
	
	update(dt) 
	{
		super.update(dt);
		
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
		var collisionNormal = {}

		outer_loop: 
		for(var x=-1; x<=1; x++){
			for(var y=-1; y<=1; y++){
				
				let tPos = {x:tilePos.x+x, y:tilePos.y+y};
				var tile = level.map.getTile(tPos.x, tPos.y);
				if(tile == null || tile >= 2){

					let circle = {x:newPos.x, y:newPos.y, r:0.8};
					let rect = {x:tPos.x, y:tPos.y, w:1, h:1};
					let hit = collidesCircleRect(circle, rect);
					if(hit.isCollides){
						isColliding = true;

						//console.log(hit.normal);

						var NearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
						var NearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));    
						var dist = {x:circle.x - NearestX, y:circle.y - NearestY, z:0};

						var tangent_vel = dotProduct([vectorNormalize(dist).x, vectorNormalize(dist).y], [this.dir.x, this.dir.y]);
						this.dir = {
							x:this.dir.x - tangent_vel*2,
							y:this.dir.y - tangent_vel*2,
							z:this.dir.z,
						}

						//collisionNormal = getRectClosestSideNormal(rect, {x:newPos.x, y:newPos.y});
						
						//move it out of rect
						/*const dx = Math.abs(newPos.x - rect.x - rect.w / 2);
  						const dy = Math.abs(newPos.y - rect.y - rect.h / 2);

						let moveX = 0;
						let moveY = 0;

						if (dx <= rect.w / 2) {
							moveX = circle.r - dx;
						}
						if (dy <= rect.h / 2) {
							moveY = circle.r - dy;
						}
						
						newPos.x += moveX * collisionNormal.x;
						newPos.y += moveY * collisionNormal.y;
						*/
						//break outer_loop;
					}
				}

				
			}	
		}

		if(!isColliding)
			this.pos = newPos;
		/*else{
			var newPos = {
				x: this.pos.x + this.dir.x * this.speed * dt, 
				y: this.pos.y + this.dir.y * this.speed * dt,
				z: this.pos.z + this.dir.z * dt,
			};

			this.pos = newPos;
		}*/
		/*else{
			let newDir = reflectVector(this.dir, collisionNormal);
			
			

			console.log("---")
			console.log(this.dir);
			console.log(collisionNormal);
			console.log(newDir);

			newPos = {
				x: this.pos.x + newDir.x * this.speed * dt, 
				y: this.pos.y + newDir.y * this.speed * dt,
				z: this.pos.z + 0 * dt,
			};

			this.pos = newPos;
		}*/
			
			
		this.collision();	
		this.pos.z = Math.clamp(this.pos.z,0,999);
	}

	render(ctx)
	{
		this.sprite.offset = [0,16];

		
		
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
		

		if(!this.isActing) return;
		let sPos = WorldToIsometric(this.pos)
		sPos.y += 16
		let sSprite = new Sprite('res/slash.png', [0, 0], [48, 32],0,[0,1,2,3]);
		//slash
		renderData.push({
			pos: sPos,
			sprite: sSprite,
			depth: -(this.pos.y+this.pos.x)*10+1,
		});

	}
}