
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
		this.lookDir = {x:1, y:0, z:0};
		
		this.weaponSprite = new Sprite('res/playerW.png', [0, 0], [32, 32], 8, [0,1,2,3,4,5,6,7]);

		this.lastDir = {x:0, y:0, z:0};
		this.attackIndx = 0;

		this.attackHit = {x:0, y:0, z:0};
	}

	jump(){

		if(this.isActing) return;

		this.isActing = true;
		this.curAction = `jump`;
		this.actionTimer = 0.8;

		//this.vel.z = 3
		//this.vel = {x:0, y:0, z:100};

		this.curAnimFrame = 0;
		this.sprite.pos = [0,64];	this.sprite.size = [32,32]
	}

	attack(){

		if(this.isActing) return;
		
		this.isActing = true;
		this.curAction = `attack`;
		this.actionTimer = 0.8;

		this.curAnimFrame = 0;
		this.sprite.pos = [0,96 + 32*this.attackIndx];	this.sprite.size = [48,32]
		
		this.vel = {x:0, y:0, z:this.vel.z};
		
		this.attackIndx = (this.attackIndx+1)%1;

		let attackDir = vectorNormalize(this.lookDir);
		
		//console.log(angleBetweenVectors(vector(1,0), this.lookDir));	//???

		for(var i=0; i<enemies.length; i++){
			
			let e = enemies[i];
			if(collidesCircles(e.pos, 0.3, vectorAdd(this.pos, vectorMultiply(attackDir, 0.5)), 0.8).isCollides){
				
				let dmg = {value:randomRange(8,20), dir:vectorNormalize(vectorSubstract(e.pos, this.pos))}
				e.setDamage(dmg);

				//dmg particle (mb change it to some kind of damage log data)
				dmgParticles.push({
					pos:e.pos, 
					dir:dmg.dir,
					dmg:dmg.value, 
					t:0.2
				})
			}
		}
	}
	
	update(dt) 
	{
		super.update(dt);
		
		//Speed up animation speed base on velocity
		this.animMul = (!this.isActing)? vectorMagnitude({x:this.dir.x*this.speed, y:this.dir.y*this.speed, z:0})/this.speed : 1;

		

		
		if(!this.isActing){
			if(vectorMagnitude({x:this.dir.x, y:this.dir.y, z:0}) == 0){
				//idle anim
				this.sprite.pos = [0,0];	this.sprite.size = [32,32]
			}else{
				//walk anim
				this.sprite.pos = [0,32];	this.sprite.size = [32,32]
			}
		}

		
		
		
		//Movement
		//this.lastDir = this.dir;
		this.vel = vectorLerp(this.vel, {x:0, y:0, z:-10}, dt);
		
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
			/*var newPos = {
				x: this.pos.x + this.vel.x * dt, 
				y: this.pos.y + this.vel.y * dt,
				z: this.pos.z + this.vel.z * dt,
			};

			this.pos = newPos;*/
		}

		
			
		this.collision();	
		this.pos.z = Math.clamp(this.pos.z,0,999);

		//
		this.weaponSprite.update(dt);
		if(this.animTimer<=0){
			//this.curAnimFrame = (this.curAnimFrame+1)%this.weaponSprite.frames.length;
			this.weaponSprite.frames = [this.weaponSprite.frames[this.curAnimFrame]];
			//this.animTimer = 0.1;
		}
	}

	render(ctx)
	{
		this.sprite.offset = [0,16];

		let renderPos = vector(this.pos);
		renderData.push({
			pos: WorldToIsometric(renderPos),
			sprite: this.sprite,
			depth: -(renderPos.y+renderPos.x)*10+5,
		});

		//Weapon rendering
		let wPos = vector(this.pos);
		
		

		let mousePos = mouse;
		let screenCenter = {x:canvas.width/2, y:canvas.height/2, z:0};
		let distFromCenterToMouse = vectorSubstract(mousePos, screenCenter);
		let distFromCenterToMouseNormalized = vectorNormalize( distFromCenterToMouse);
		
		let a = angleBetweenVectors({x:1,y:0,z:0}, distFromCenterToMouseNormalized)
		a *= -1;
		
		

		//direction
		let look = vectorRotate(this.dir, -45);
		this.weaponSprite.scaleX = (look.x < 0)? -1 : 1;


		if(this.weaponSprite.scaleX < 0){
			//a *= -1;
			a -= 180;
		}
		
		
		if(a < 0){
			a += 360;
		}
		
		//console.log(a);	

		if(this.curAction == `attack`){
			this.weaponSprite.pos = [0,32];	this.weaponSprite.size = [48,32]; this.weaponSprite.frames = [0,1,2,3,4,5,6,7]
		}else{
			this.weaponSprite.pos = [0,0];	this.weaponSprite.size = [32,32]; this.weaponSprite.frames = [0]
			this.weaponSprite.angle = a
		}
		this.weaponSprite.offset = [0,8];
		

		
		
		renderData.push({
			pos: WorldToIsometric(wPos),
			sprite: this.weaponSprite,
			depth: -(renderPos.y+renderPos.x)*10+ ((look.y > 0)? 6 : 4),
		});

		
		//shadow
		renderPos.z = 0;
		renderData.push({
			pos: WorldToIsometric(renderPos),
			sprite: new Sprite('res/misc.png', [0, 0], [16, 8],0,[0]),
			depth: -(renderPos.y+renderPos.x)*10+1,
		});
		

		if(this.curAction != `attack`) return;
		let sPos = WorldToIsometric(this.pos)
		sPos.y += 16
		let sSprite = new Sprite('res/slash.png', [0, 0], [48, 32],0,[0,1,2,3]);
		//slash
		/*renderData.push({
			pos: sPos,
			sprite: sSprite,
			depth: -(this.pos.y+this.pos.x)*10+1,
		});*/

	}
}