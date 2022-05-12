

class Entity 
{
	constructor(name) 
	{
		this.name = name;
		this.speed = 0;
		this.dir = [0, 0, 0];
		this.pos = [50 + randomFRange(0,200), 50 + randomFRange(0,50), 0];
		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2], -10);
		
		entities.push(this);
	}
         
	update(dt) 
	{
		
	}

	render(ctx) 
	{
		this.sprite.offset = [0,12];
		this.sprite.depth = -this.pos[1]+this.pos[2]+1;
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
}



class Player extends Entity 
{

	constructor(name) 
	{
		super(name);
		
		this.speed = 128;
		this.dir = [0, 0, 0];
		this.pos = [50 + randomFRange(0,200), 50 + randomFRange(0,50), 0];
		this.sprite = new Sprite('res/player.png', [0, 0], [32, 32], 8, [0,1,2,3,4,5,6,7], -10);
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [0,1,2,3,4,5,6,7];
		
		this.isJumping = false;

		this.actionTimer = 0;
		this.lastDir = [0,0,0];
	}
	
	update(dt) 
	{
		super.update(dt);
		//this.sprite.update();
		
		//anim
		if(!this.isJumping){

			if(vectorLength([this.dir[0], this.dir[1], 0]) == 0){

				this.sprite.pos = [0,0];
			}else{
				this.sprite.pos = [0,32];
			}
		}
		
		this.timer -= dt * vectorLength([this.dir[0]*this.speed, this.dir[1]*this.speed, 0]);
		if(this.timer<=0){
			this.curFrame = (this.curFrame+1)%this.curAnim.length;
			this.sprite.frames = [this.curAnim[this.curFrame]];
			this.timer = 8;
		}
		
		//movement

		if(!this.isJumping){
			this.dir = [0,0,this.dir[2]];

			if(input.isDown('W')){
				this.dir[1] = 1;	
			}
			if(input.isDown('S')){
				this.dir[1] = -1;
			}
			if(input.isDown('A')){
				this.dir[0] = -1;	this.sprite.scaleX = -1;
			}
			if(input.isDown('D')){
				this.dir[0] = 1;	this.sprite.scaleX = 1;
			}

			if(input.isDown('space') && !this.isJumping){
				this.actionTimer = 0.8;
				
				this.isJumping = true;
				this.sprite.pos = [0,64];
			}

			
		}
		
		
		
		if(this.actionTimer <= 0){
			this.isJumping = false;
		}

		this.actionTimer -= dt;
		
		
		//pickup gold
		for(var i=0; i<entities.length; i++){
			
			var e = entities[i];
			if(e.name == "coin" && Distance(this.pos, e.pos)<16 && !e.picked){
				entities[i].pickup(this);
			}
		}
		
		
		//this.dir = vectorLerp(this.dir, [0,0,-128], 0.05);
		this.lastDir = this.dir;
		
		
		this.pos = [this.pos[0] + this.dir[0] * this.speed * dt, 
					this.pos[1] + this.dir[1] * this.speed * dt, 
					this.pos[2] + this.dir[2] * dt];
				
		this.pos[2] = Math.clamp(this.pos[2],0,999);
	}

	render(ctx)
	{
		this.sprite.offset = [0,16];
		this.sprite.depth = -this.pos[1]+this.pos[2]+1;
		renderData.push(this);
		//shadow
		renderData.push({
			pos: [this.pos[0], this.pos[1], 0],
			sprite: new Sprite('res/misc.png', [0, 0], [16, 8],0,[0], -this.pos[1]),
		});
	}
}
