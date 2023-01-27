
(function() {
    
    function Sprite(url, pos, size, speed, frames, scaleX, angle, dir) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames || [0];
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
		this.scaleX = scaleX || 1;
		this.angle = angle || 0;
		this.once = false;
		this.rect = [0,0,0,0];
		this.offset = [0,0];

        this.animator = new SpriteAnimator();
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index = this._index + this.speed*dt || 0;
        },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
				frame = this.frames[0];
                //frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }
			
			var dx = -(this.size[0])/2;
			var dy = -(this.size[1])/2;
			
			var img = resources.get(this.url);
			
			//===
			ctx.rotate(this.angle*Math.PI/180);
			ctx.scale(this.scaleX, 1);
			
			var cut = (this.rect==null)? [0,0,0,0] : [this.rect[0], this.rect[1], this.rect[2], this.rect[3]];


			//void ctx.drawImage(image, dx, dy);
            //void ctx.drawImage(image, dx, dy, dWidth, dHeight);
            //void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

            //dx = Координата по оси Х, в которую будет помещён верхний левый угол 
            //dWidth = Ширина изображения
            //sx = X верхнего левого угла фрагмента, который будет вырезан
            //sWidth = Ширина фрагмента, который будет вырезан из изображения источника
            
            

			ctx.drawImage(
                img,
				x + cut[0], y + cut[1],
				this.size[0] + cut[2] , this.size[1] + cut[3],
				dx, dy,
				this.size[0] + cut[2], this.size[1] + cut[3]);
						  

        }
    };

    window.Sprite = Sprite;
})();






class SpriteAnimation
{
	constructor(name, frames, loop, lifetime) 
	{
        this.name = name || '';
        this.loop = loop || false;
        this.frames = frames || [0];
        
        this.lifetime = lifetime || frames.length*0.1;
	}
}


class SpriteAnimator
{
	constructor(animations) 
	{
        this._frame = 0;
		this._timer = 0;

        this.speed = 1;

        this.animations = animations || [];

		this.curAnimation = (this.animations.length>0)? animations[0] : undefined;
	}
	
	update(dt) {
		if(this._timer>=1){
            let anim = this.curAnimation;

			this._frame = (this._frame+1)%anim.length;
			this.sprite.frames = [anim[this._frame]];
			this._timer = 0.1;

            if(anim.loop == true){

            }else{

            }
		}
		this._timer += dt * this.animMul;
	}

    getCurrentFrame(){
        let anim = this.curAnimation;
        if(anim == undefined) return 0;
        return anim[this._frame];
    }

}



