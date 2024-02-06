class SpriteRenderer extends Component {
    constructor(gameObject, sprite) {
      super(gameObject);
      this.sprite = sprite;
    }
  
    render(ctx) {
      
      renderData.push({
        sprite: this.sprite,
        pos: this.gameObject.transform.position,
        
        depth: this.depth || 0, 
      });
    }
  }
  