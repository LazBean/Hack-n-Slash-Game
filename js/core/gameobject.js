class GameObject {
	constructor(name = "GameObject", pos = {x:0, y:0, z:0}) {
		this.name = name;
		this.components = [];
		this.transform = new Transform(pos);
	}
  
	addComponent(component) {
		this.components.push(component);
		component.gameObject = this;
		return component;
	}

	getComponent(type) {
		return this.components.find(component => component instanceof type);
	}
  
	update(dt) {
        this.components.forEach(component => {
            if (component.enabled !== false) {
                component.update(dt);
            }
        });
    }

    render(ctx) {
        this.components.forEach(component => {
            if (component.enabled !== false) {
                component.render(ctx);
            }
        });
    }

    onGUI(ctx) {
        this.components.forEach(component => {
            if (component.enabled !== false) {
                component.onGUI(ctx);
            }
        });
    }
}