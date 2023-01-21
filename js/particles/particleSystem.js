
// (!) Put particle class here and custom particle systems in other file
// (!) add advanced option variable with custom [constant|random between 2 values|curve] 
// (!) Make burst into bursts array
// (!) More shapes!

class ParticleSystem extends Entity 
{
	#time = 0;
	#durationTimer = 0;
	#emissionTimer = 0;
	#bursted = false;

	constructor() 
	{
		super();
		this.collide = false;

		this.sprite = new Sprite('res/particles.png', [0, 0], [8, 8], 4, [0,0,0,0]);

		this.particles = [];
		
		//Main
		this.duration = 5;
		this.looping = true;
		this.startLifeTime = 1;
		this.maxParticles = 1000;
		this.destroyOnEnd = true;
		
		//Emission
		this.emission = true;
		this.rateOverTime = 5;
		//this.rateOverDistance = 0;
		this.burstTime = 0;
		this.burstCount = 5;

		//Shape
		this.shapePos = {x:0, y:0, z:1};
		this.shapeScale = {x:0, y:0, z:0};

		//Velocity over lifetime
		this.volLinear = {x:1, y:0, z:0};
		this.volOrbital = {x:0, y:0, z:0};


		this.#durationTimer = this.duration;

		this.dir = {x:0, y:0, z:0};

	}
	
	update(dt) {
		super.update(dt);
		//Update particles
		for(var i=0; i<this.particles.length; i++) {
			this.particles[i].update(dt);
		}

		if(this.#durationTimer <= 0 && !this.looping){
			//Remove ParticleSystem
			if(this.destroyOnEnd && this.particles.length <= 0)
				this.remove();
			return;
		}

		//Emmision
		if(this.emission == true){

			//Constant
			if(this.#emissionTimer <= 0 && this.rateOverTime>0){

				let n = Math.floor(-this.#emissionTimer / (1/this.rateOverTime));
				
				for(var i=0; i<n; i++) {
					this.emit();

					this.#emissionTimer += 1/this.rateOverTime;
				}

			}

			//Burst
			if(this.#bursted == false && this.#time >= this.burstTime){
				
				for(var i=0; i<this.burstCount; i++) {
					this.emit();
				}
				this.#bursted = true;
			}
			
		}
		this.#emissionTimer -= dt;
		

		this.#durationTimer -= dt;
		this.#time += dt;
	}

	render(ctx){
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
		if(this.particles.length >= this.maxParticles) return;
		
		let p = new Particle(this);
		//Set start position
		let spos = {x:randomFRange(-1,1)*(this.shapeScale.x/2), y:randomFRange(-1,1)*(this.shapeScale.y/2), z:randomFRange(-1,1)*(this.shapeScale.z/2)};
		spos = vectorAdd(this.shapePos, spos);
		p.pos = vectorAdd(this.pos, spos);

		//Set lifetime
		p.lifeTimer = randomFRange(this.startLifeTime/2,this.startLifeTime); 
		
		//Set start velocity
		/*let vel = {x: randomFRange(-1,1)*0.2 + this.dir.x, y:randomFRange(-1,1)*0.2 + this.dir.y, z:1}
		vel = vectorMultiply( vectorNormalize(vel), randomFRange(1.5,5.0));
		p.vel = vel;*/
		//
		p.sprite = this.sprite;

		this.particles.push(p);
	}

	onParticleCollision(particle){
		
	}
}


//Blood splatter effect
class PSBlood extends ParticleSystem 
{
	
	constructor() 
	{
		super();

		this.sprite = new Sprite('res/particles.png', [0, 0], [8, 8], 4, [0,0,0,0]);

		this.looping = false;

		this.rateOverTime = 0;
		this.burstCount = 5;

	}


	onParticleCollision(particle){
		let r = randomFRange(0,1);
		if(r > 0.70){
			let d = new Decale();
			d.pos = particle.pos;
		}
		particle.lifeTimer = -1;
	}
}


//Ash effect
class PSAsh extends ParticleSystem 
{
	
	constructor() 
	{
		super();

		this.sprite = new Sprite('res/particles.png', [0, 8], [8, 8], 0.1, [0,1,2]);

		this.looping = false;
		this.startLifeTime = 3;

		
		this.rateOverTime = 0;
		this.burstCount = 50;

		this.shapePos = {x:0, y:0, z:0.5};
		this.shapeScale = {x:0.3, y:0.3, z:1};

	}
}