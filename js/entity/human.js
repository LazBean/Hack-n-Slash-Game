class Human extends GameObject {
    constructor(name, animations) {
      super(name);
      this.addComponent(new SpriteRenderer(this, new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0, 1, 0, 2])));
      this.addComponent(new Animator(this, animations));
    //   this.addComponent(new HealthComponent(this, 10));
    }
  
    
}
  