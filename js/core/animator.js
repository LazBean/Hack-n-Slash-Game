class Animator extends Component {
    constructor(gameObject, animations) {
      super(gameObject);
      this.animations = animations; // Словарь анимаций: {'walk': [0,1,2,3], 'attack': [4,5,6,7]}
      this.currentAnimation = null;
      this.currentFrameIndex = 0;
      this.timer = 0;
      this.isPlaying = false;
    }
  
    play(animationName, frameRate) {
      if (this.currentAnimation !== animationName) {
        this.currentAnimation = animationName;
        this.currentFrameIndex = 0;
        this.timer = 1 / frameRate;
        this.isPlaying = true;
      }
    }
  
    update(dt) {
      if (!this.isPlaying || !(this.currentAnimation in this.animations)) return;
  
      this.timer -= dt;
      if (this.timer <= 0) {
        this.currentFrameIndex = (this.currentFrameIndex + 1) % this.animations[this.currentAnimation].length;
        this.timer = 1 / frameRate; // Предполагается, что frameRate определен глобально или передается другим способом
  
        // Обновляем текущий кадр спрайта
        const spriteRenderer = this.gameObject.getComponent(SpriteRenderer);
        if (spriteRenderer) {
          spriteRenderer.sprite.frames = [this.animations[this.currentAnimation][this.currentFrameIndex]];
        }
      }
    }
  
    stop() {
      this.isPlaying = false;
    }
  }
  