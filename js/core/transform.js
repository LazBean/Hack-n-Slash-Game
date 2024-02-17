class Transform extends Component {

	constructor(pos = {x:0, y:0, z:0}) {
		super(null);
		this.position = pos || {x:0, y:0, z:0};
		this.rotation = 0;
		this.scale = { x: 1, y: 1, z: 1 };
	}
         
	update(dt) 
	{
		super.update(dt);
	}

	render(ctx) 
	{
		super.render(ctx);
	}
}