
class Sprite {
    constructor(url, pos, size, pivot = [0.5, 0.5]) {
        this.url = url;
        this.pos = pos;
        this.size = size;
        this.rect = { x: pos[0], y: pos[1], width: size[0], height: size[1] };
        this.pivot = {x: pivot[0], y: pivot[1]};
    }

    render(ctx, {x, y, angle = 0, scale = 1, flipX = false}) {
        const img = resources.get(this.url);
        if (!img) return;

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.scale(flipX ? -scale : scale, scale);

        const offsetX = (flipX ? -1 : 1) * this.pivot.x * this.rect.width;
        const offsetY = this.pivot.y * this.rect.height;

        ctx.drawImage(
            img,
            this.rect.x, this.rect.y, this.rect.width, this.rect.height,
            -offsetX, -offsetY, this.rect.width * scale, this.rect.height * scale
        );

        ctx.restore();
    }
}


//SORTING RENDER
var renderData = [];

function pushToRender(){
    renderData.sort(function(a, b) {
        let depthA = a.depth || 0;
        let depthB = b.depth || 0;

        return depthA - depthB;
    });

    for(var i=0; i<renderData.length; i++){
        renderSprite(renderData[i]);
    }
    renderData = [];
}

//RENDER SPRITE
function renderSprite(e) {
    if (e == null || e.sprite == null) return;
	let offset = e.offset ? e.offset : [0,0];
    ctx.save();
    ctx.translate(Math.round(e.pos.x - camera.x), canvas.height - Math.round(e.pos.y - camera.y));

    e.sprite.render(ctx, {
        x: e.offset ? e.offset[0] : 0, 
		y: e.offset ? e.offset[1] : 0, 
        angle: e.angle,
        scale: e.scale,
        flipX: e.flipX
    });
    ctx.restore();
}