class Living extends Entity 
{

	constructor(name) 
	{
		super(name);

		this.maxHealth = 10;
		this.health = this.maxHealth;
		this.alive = true;

		//???
		this.guiTimer = 0;
		this.guiHealth = this.health/this.maxHealth;

		//Animator
		this.animTimer = 0;
		this.animMul = 1;
		this.curAnimFrame = 0;
		this.curAnim = [0,1,2,3,4,5,6,7];	//[7,6,5,4,3,2,1,0]

		//ActionState
		this.curAction = ``;
		this.isActing = false;
		this.actionTimer = 0;
	}
	
	update(dt) {
		super.update(dt);
		//???
		this.guiTimer = Math.clamp(this.guiTimer + dt, 0, 1) ;

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

	onGUI(ctx) 
	{
		//Health bar
		if(this.health >= this.maxHealth) return;
		let pos = WorldToIsometric(this.pos);
			
		let ws = 15;
		DrawBox(pos.x-camera.x-ws/2, pos.y-camera.y+30, ws, 2, "rgba(50, 50, 50, 1)");
		
		let w = Math.clamp(this.health / this.maxHealth, 0, 1);
		
		//???
		this.guiHealth = Math.lerp(this.guiHealth, w, this.guiTimer);
		//let gw = Math.clamp(enemiesHpBar[i], 0, 1);

		DrawBox(pos.x-camera.x-ws/2, pos.y-camera.y+30, ws * w, 2, "rgba(250, 250, 250, 1)");

		DrawBox(pos.x-camera.x-ws/2, pos.y-camera.y+30, ws * this.guiHealth, 2, "rgba(250, 50, 50, 1)");
	}

	setDamage(dmg){
		this.health -= dmg.value;
		this.onGetDamage(dmg);
		if(this.health <= 0)
			this.death();

	}

	onGetDamage(dmg){
		this.guiTimer = 0;
		return;
	}

	death(){
		this.alive = false;
	}
}