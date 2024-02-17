
class SpriteRenderer extends Component {

    constructor(sprite) {
      super();
      
      this.sprite = sprite;
      this.depth = 0;
      this.offset = [0,0];
      this.flipX = false;
    }
  
    render(ctx) {
      this.sprite.offset = [0,0];

      let renderPos = vector(this.gameObject.transform.position);
      renderData.push({
        pos: WorldToIsometric(renderPos),
        offset: this.offset,
        sprite: this.sprite,
        depth: -(renderPos.y+renderPos.x)*10 + this.depth,
      });

    }
  }
  