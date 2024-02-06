class Scene {
    constructor() {
      this.gameObjects = [];
    }
  
    instantiate(gameObject) {
      this.gameObjects.push(gameObject);
    }

    destroy(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
          this.gameObjects.splice(index, 1);
        }
    }
  
    update(dt) {
      this.gameObjects.forEach(obj => obj.update(dt));
    }
  
    render(ctx) {
      this.gameObjects.forEach(obj => obj.render(ctx));
    }

    onGUI(ctx) {
      this.gameObjects.forEach(obj => obj.onGUI(ctx));
    }
  }
  