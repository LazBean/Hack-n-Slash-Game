

class Entity 
{
	constructor(name="?") 
	{
		this.name = name;
		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2]);

		this.speed = 0;
		this.pos = {x:0, y:0, z:0};
		this.vel = {x:0, y:0, z:0};
		this.dir = {x:0, y:0, z:0};

		this.collide = true;
		
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
		if (index > -1)	entities.splice(index, 1);
	}

	move(){
		
	}

	collision(){
		es = getEntitiesToCollideWith(this.pos);
		for(var i=0; i<es.length; i++) {
			var e = es[i];

			if(e.collide == false) continue;

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


class Living extends Entity 
{

	constructor(name) 
	{
		super(name);

		this.maxHealth = 10;
		this.health = this.maxHealth;
		this.alive = true;


		//Animator
		this.animTimer = 0;
		this.animMul = 1;
		this.curAnimFrame = 0;
		this.curAnim = [0,1,2,3,4,5,6,7];

		//ActionState
		this.curAction = ``;
		this.isActing = false;
		this.actionTimer = 0;
	}
	
	update(dt) {
		super.update(dt);

		//animator
		if(this.animTimer<=0){
			this.curAnimFrame = (this.curAnimFrame+1)%this.curAnim.length;
			this.sprite.frames = [this.curAnim[this.curAnimFrame]];
			this.animTimer = 0.1;
		}
		this.animTimer -= dt * this.animMul;

		//Action State
		if(this.actionTimer <= 0){
			this.isActing = false;
			this.curAction = ``;
		}
		this.actionTimer -= dt;

		//sprite direction
		let look = vectorRotate(this.dir, -45);
		if(look.x > 0)
			this.sprite.scaleX = 1;
		else if(look.x < 0)
			this.sprite.scaleX = -1;
	}

	render(ctx){
		super.render(ctx);
	}

	setDamage(dmg){
		this.health -= dmg.value;
		this.onGetDamage();
		if(this.health <= 0)
			this.death();

	}

	onGetDamage(dmg){
		return;
	}

	death(){
		this.alive = false;
	}
}




