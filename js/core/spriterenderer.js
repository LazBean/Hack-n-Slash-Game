
class SpriteRenderer extends Component {

    constructor(sprite) {
      super();
      
      this.sprite = sprite;
      this.depth = 0;
      this.offset = [0,0];
      this.angle = 0;
      this.flipX = false;
      this.scale = 1;
    }
  
    render(ctx) {
      let renderPos = vector(this.gameObject.transform.position);
      renderData.push({
        pos: WorldToIsometric(renderPos),
        offset: this.offset,
        sprite: this.sprite,
        depth: -(renderPos.y+renderPos.x)*10 + this.depth,
        scale: this.scale,
        angle: this.angle,
      });

    }
  }
  