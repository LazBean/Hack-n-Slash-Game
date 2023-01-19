class ParticleSystem extends Entity 
{
	
	constructor(name) 
	{
		super(name);


		this.maxAmount = 100;
		this.lifeTime = 1;
		this.particles = [];

		this.emitTime = 0.1;
		this.emitTimer = 0;

		this.emission = true;

		this.collide = false;
	}
	
	update(dt) {
		super.update(dt);

		for(var i=0; i<this.particles.length; i++) {
			this.particles[i].update(dt);
		}


		if(this.emission == true && this.emitTimer <= 0){

			for(var i=0; i<50; i++) {
				this.emit();
			}
			this.emitTimer = this.emitTime;

			this.emission = false;
		}
		this.emitTimer -= dt;

		if(this.particles.length <= 0 && this.emission == false)
			this.remove();
		
	}

	render(ctx){
		//super.render(ctx);

		for(var i=0; i<this.particles.length; i++) {
			this.particles[i].render(ctx);
		}
	}

	remove()
	{
		this.particles = [];
		super.remove();
	}


	emit(){
		if(this.particles.length >= this.maxAmount) return;
		
		let p = new Particle(this);
		p.lifeTimer = randomFRange(this.lifeTime/2,this.lifeTime); 
		//
		let vel = {x: randomFRange(-1,1)*0.1, y:randomFRange(-1,1)*0.1, z:10}
		vel = vectorMultiply( vectorNormalize(vel), randomFRange(0.5,5.5));
		p.vel = vel;

		this.particles.push(p);
	}
}