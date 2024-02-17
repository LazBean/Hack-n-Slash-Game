
class Entity extends GameObject {

    constructor(pos = {x:0, y:0, z:0}) {
		super("Entity", pos);

		this.addComponent(new Motor());
		this.addComponent(new SpriteRenderer(new Sprite('res/particles.png', [0, 16], [8, 8])));
		this.addComponent(new Animator(
			new Animation([
				new Sprite('res/particles.png', [0, 16], [8, 8]),
				new Sprite('res/particles.png', [8, 16], [8, 8]),
				new Sprite('res/particles.png', [16, 16], [8, 8]),
				new Sprite('res/particles.png', [24, 16], [8, 8]),
			], 8, true) 
		));
		this.getComponent(Animator).play();
    }

	update(dt) {
		super.update(dt);

		this.getComponent(Motor).vel.x = Math.cos(Date.now() / 1000) * 1;
		this.getComponent(Motor).vel.y = Math.sin(Date.now() / 1000) * 1;
	}

	render(ctx){
		super.render(ctx);
	}

	onGUI(ctx) 
	{
		super.onGUI(ctx);

		DrawText(10, 50, 'Player Pos: ' + this.transform.position.x.toFixed(2) + ", " + this.transform.position.y.toFixed(2), "rgba(160, 160, 160, 1)");
		DrawText(10, 40, 'Player Dir: ' + this.getComponent(Motor).dir.x.toFixed(2) + ", " + this.getComponent(Motor).dir.y.toFixed(2), "rgba(160, 160, 160, 1)");
	}
}
  

// class Entity 
// {
// 	constructor(name="?") 
// 	{
// 		this.name = name;
// 		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2]);

// 		this.speed = 0;
// 		this.pos = {x:0, y:0, z:0};
// 		this.vel = {x:0, y:0, z:0};
// 		this.dir = {x:0, y:0, z:0};

// 		this.collide = true;
		
// 		entities.push(this);
// 	}
         
// 	update(dt) 
// 	{
		
// 	}

// 	render(ctx) 
// 	{
// 		this.sprite.offset = [0,12];
// 		this.sprite.depth = -this.pos.y+this.pos.z+1;
// 		renderData.push(this);
// 	}

// 	onGUI(ctx) 
// 	{
		
// 	}
  
// 	remove()
// 	{
// 		var index = entities.indexOf(this);
// 		if (index > -1)	entities.splice(index, 1);
// 	}

// 	move(){
		
// 	}

	

// 	collisionTilemap(){
		
// 	}
// }
