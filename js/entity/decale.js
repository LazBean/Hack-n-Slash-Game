class Decale extends Entity 
{

	constructor(name) 
	{
		super(name);

		this.sprite = new Sprite('res/misc.png', [0, 32], [16, 16], 1, [randomRange(0,5)]);

		this.collide = false;

		decales.push(this);
		if(decales.length > maxDecales){
			decales[0].remove();
		}
	}
	
	update(dt) {
		super.update(dt);
	}

	render(ctx){
		//super.render(ctx);

		renderData.push({
			pos: WorldToIsometric(this.pos),
			sprite: this.sprite,
			depth: -(this.pos.y+this.pos.x)*10-1,
		});
	}

	remove()
	{
		var index = decales.indexOf(this);
		if (index > -1)	decales.splice(index, 1);

		super.remove();
	}
}