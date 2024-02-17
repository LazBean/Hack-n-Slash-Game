class Animation {
  constructor(frames, frameRate=8, loop=true) {
    this.frames = frames;
    this.frameRate = frameRate;
    this.loop = loop;
  }
}

// animator.OnFrameChanged = (frameIndex) => {
// 	console.log(`Switching frame to: ${frameIndex}`);
// };
class Animator extends Component {
  constructor(animation) {
    super();
    this.animation = animation;
    this.speed = 1;

    this.currentFrameIndex = 0;
    this.timer = 0;
    this.isPlaying = false;
  }

  OnAnimationStart = null;
  OnAnimationEnd = null;
  OnFrameChanged = null;

  play(animation = null) {
    if (animation !== null) {
      this.animation = animation;
      this.currentFrameIndex = 0;
    } else if (!this.animation) {
      console.error("Animator.play() called without an animation");
      return;
    }

    // this.speed = 1;
    this.timer = 1 / (this.animation.frameRate * this.speed);
    this.isPlaying = true;
  
    this.updateFrame();
    this.OnAnimationStart?.();
  }
  
  

  update(dt) {
    if (!this.isPlaying || !this.animation) return;
  
    this.timer -= dt;
    if (this.timer <= 0) {
      
      this.currentFrameIndex++;
      if (this.currentFrameIndex >= this.animation.frames.length) {
        if (this.animation.loop) {
          this.currentFrameIndex = 0;
        } else {
          this.isPlaying = false;
          this.currentFrameIndex = 0;
          this.OnAnimationEnd?.();
          return;
        }
      }
      this.timer = 1 / (this.animation.frameRate * this.speed);
      this.updateFrame();
    }
  }

  updateFrame() {
    const spriteRenderer = this.gameObject.getComponent(SpriteRenderer);
    if (spriteRenderer && this.animation.frames.length > 0) {
      spriteRenderer.sprite = this.animation.frames[this.currentFrameIndex];
      this.OnFrameChanged?.(this.currentFrameIndex);
    }
  }
  
  stop() {
    this.isPlaying = false;
    this.currentFrameIndex = 0;
    this.OnAnimationEnd?.();
  }

  pause() {
    this.isPlaying = false;
  }
}
  