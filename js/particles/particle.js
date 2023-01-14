class Particle extends Entity 
{

	constructor(manager) 
	{
		super("");

		this.manager = manager;
		this.lifeTime = 1;
	}
	
	update(dt) {
		super.update(dt);
	}

	render(ctx){
		super.render(ctx);
	}

	remove()
	{
		//var index = entities.indexOf(this);
		//if (index > -1)	entities.splice(index, 1);
	}
}