
class Particle
{

	constructor(manager) 
	{
		this.manager = manager;

		this.speed = 1;
		this.pos = {x:0, y:0, z:0};
		this.vel = {x:0, y:0, z:0};

		this.time = 1;
		this.lifeTimer = 1;
	}
	
	update(dt) {

		let r = 0.5
		//this.pos.x = r * Math.cos(this.time * 10)
		//this.pos.y = r * Math.sin(this.time * 10)
		//this.pos.z = r * (this.time * 10)

		
		//Movement
		this.pos = vectorAdd(this.pos, vectorMultiply(this.vel, dt));	//

		//this.vel = vector(this.manager.volLinear);
		let vol = vectorAdd( vector(this.manager.volLinear), {x:0, y:0, z:-10})

		this.vel = vectorLerp(this.vel, vol, dt)


		if(this.pos.z <= 0 && this.vel.z < 0){
			this.pos.z = 0.01;
			//this.vel.z *= -1;
			this.manager.onParticleCollision(this);
		}
			

		this.time += dt;

		

		this.sprite.update(dt);

		if(this.lifeTimer <= 0)
			this.remove();
		this.lifeTimer -= dt;
	}

	render(ctx){

		let np = vector(this.pos); //vectorAdd(this.pos, this.manager.pos);
		
		renderData.push({
			pos: WorldToIsometric(np),
			sprite: this.sprite,
			depth: -(np.y+np.x)*10+5,
		});

		if(this.pos.z <=0) return;
		np.z = 0;
		//shadow
		renderData.push({
			pos: WorldToIsometric(np),
			sprite: new Sprite('res/misc.png', [0, 8], [2, 2],0,[0]),
			depth: -(np.y+np.x)*10+1,
		});

	}

	remove()
	{
		var index = this.manager.particles.indexOf(this);
		if (index > -1)	this.manager.particles.splice(index, 1);
	}
}