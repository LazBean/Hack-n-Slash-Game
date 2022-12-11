

class Entity 
{
	constructor(name="?") 
	{
		this.name = name;
		this.speed = 0;
		this.dir = {x:0, y:0, z:0};
		this.pos = {x:0, y:0, z:0};
		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2]);
		
		entities.push(this);
	}

	remove() 
	{
		entities.remove(this);
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
		if (index > -1) 
		{
			entities.splice(index, 1);
		}
	}

	collision(){
		es = getEntitiesToCollideWith(this.pos);
		for(var i=0; i<es.length; i++) {
			var e = es[i];
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




