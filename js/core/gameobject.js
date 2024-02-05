class GameObject {
	constructor() {
	  this.components = [];
	  this.transform = new Transform();
	}
  
	addComponent(component) {
	  this.components.push(component);
	  component.gameObject = this;
	}

	getComponent(type) {
		return this.components.find(component => component instanceof type);
	}
  
	update(dt) {
	  this.components.forEach(component => component.update(dt));
	}

	render(ctx) 
	{
		this.components.forEach(component => component.render(ctx));
	}
}