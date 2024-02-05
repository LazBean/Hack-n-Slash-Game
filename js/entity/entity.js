

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

	onGUI(ctx) 
	{
		
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
