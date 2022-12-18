
class Player extends Living 
{

	constructor(name) 
	{
		super(name);

		this.color = null
		
		this.sprite = new Sprite('res/player.png', [0, 0], [32, 32], 8, [0,1,2,3,4,5,6,7]);

		this.speed = 4;
		this.pos = {x:4 + randomFRange(0,8), y:4 + randomFRange(0,8), z:0};
		this.vel = {x:0, y:0, z:0};
		this.dir = {x:0, y:0, z:0};
		
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [0,1,2,3,4,5,6,7];
		
		this.curAction = ``;
		this.isActing = false;

		this.actionTimer = 0;
		this.lastDir = {x:0, y:0, z:0};
		this.attackIndx = 0;

		this.attackHit = {x:0, y:0, z:0};
	}

	jump(){

		if(this.isActing) return;

		this.isActing = true;
		this.curAction = `jump`;
		this.actionTimer = 0.8;

		this.curFrame = 0;
		this.sprite.pos = [0,64];	this.sprite.size = [32,32]
	}

	attack(){

		if(this.isActing) return;
		
		this.isActing = true;
		this.curAction = `attack`;
		this.actionTimer = 0.8;

		this.curFrame = 0;
		this.sprite.pos = [0,96 + 32*this.attackIndx];	this.sprite.size = [48,32]
		
		this.dir = {x:0, y:0, z:this.dir.z};
		this.vel = {x:0, y:0, z:this.vel.z};
		
		this.attackIndx = (this.attackIndx+1)%1;

		//if()
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
		

		//sprite direction
		let look = vectorRotate(this.dir, -45);
		if(look.x > 0)
			this.sprite.scaleX = 1;
		else if(look.x < 0)
			this.sprite.scaleX = -1;
		
		if(this.actionTimer <= 0){
			this.isActing = false;
			this.curAction = ``;
		}

		this.actionTimer -= dt;

		
		
		
		//Movement
		//this.lastDir = this.dir;
		
		
		var newPos = {
			x: this.pos.x + this.vel.x * dt, 
			y: this.pos.y + this.vel.y * dt,
			z: this.pos.z + this.vel.z * dt,
		};

		//map collision
		var tilePos = level.map.getTilePos(newPos);
		
		var isColliding = false;
		
		outer_loop: 
		for(var x=-1; x<=1; x++){
			for(var y=-1; y<=1; y++){
				
				let tPos = {x:tilePos.x+x, y:tilePos.y+y};
				var tile = level.map.getTile(tPos.x, tPos.y);


				if(tile == null || tile >= 2){

					let circle = {x:newPos.x, y:newPos.y, r:0.3};
					let rect = {x:tPos.x-0.5, y:tPos.y-0.5, w:1, h:1};
					let hit = collidesCircleRect(circle, rect);
					
					if(hit.isCollides){
						isColliding = true;

						let normal = hit.normal; //getRectClosestSideNormal(rect, {x:this.pos.x, y:this.pos.y});
						
						// Calculate the dot product of the vector and the normal vector
						var dot = dotProduct([this.vel.x, this.vel.y], [normal.x, normal.y]);

						// If the dot product is positive, reflect the vector across the normal vector
						if (dot < 0) {
							//this.vel.x -= 2 * dot * normal.x;
							//this.vel.y -= 2 * dot * normal.y;

							var normal_angle = Math.atan2(normal.y, normal.x);
							var incoming_angle = Math.atan2(this.vel.y, this.vel.x);
							var theta = normal_angle - incoming_angle;
							this.vel = vectorRotate(this.vel, ((2*theta) * 180) / Math.PI);
						}

						

						
						
						break outer_loop;
					}
				}

				
			}	
		}

		if(!isColliding)
			this.pos = newPos;
		else{
			var newPos = {
				x: this.pos.x + this.vel.x * dt, 
				y: this.pos.y + this.vel.y * dt,
				z: this.pos.z + this.vel.z * dt,
			};

			this.pos = newPos;
		}
			
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
		

		if(this.curAction != `attack`) return;
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