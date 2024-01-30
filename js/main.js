// =========================================================================

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//canvas.style.width = "1024px";
//canvas.style.height = "512px";

canvas.width = 768; //1024-256;
canvas.height = 432; //512-128;


document.body.appendChild(canvas);


var fontSize = 16;
ctx.font = fontSize+'px pixelfont';
ctx.imageSmoothingEnabled = false;
//ctx.filter = "blur(1px)"

var camera = {x:-canvas.width/2, y:-canvas.height/4};


//INIT RESOURCES
resources.load([
	'res/bg-main-menu.png',
	'res/tiles.png',
	'res/gui.png',
	'res/font.png',
	'res/player.png',
	'res/playerW.png',
	'res/skeleton.png',
	'res/particles.png',
	'res/misc.png',
	'res/slash.png',
]);
resources.onReady(init);




var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


//=========
var gameTime = 0;

var lastTime;
var dt;

//Init
function init() {
  
	level.start();
	
    lastTime = Date.now();
    main();
}

//Main Loop
function main() {
    var now = Date.now();
    dt = (now - lastTime) / 1000.0;

    update(dt);
    render();
	
	resetInput();
	TakeFPS(dt);
	
	lastTime = now;
    requestAnimFrame(main);
};

//UPDATE
function update(dt) {
    gameTime += dt;
		
	level.update(dt);
};

//FPS COUNTER
var fps   = 0;
var accum   = 0;
var frames  = 0;
var timeleft = 0.5;

function TakeFPS(dt)
{
	timeleft -= dt;
	accum += 1/dt;
	++frames;
	
	if( timeleft <= 0.0 ){
		fps = accum/frames;

		timeleft = 0.5;
		accum = 0.0;
		frames = 0;
	}
	
	//SHOW FPS
	DrawBox(0,canvas.height,60,15, "rgba(0, 0, 0, 0.5)");
	DrawText(5, canvas.height-3, 'FPS ' + fps.toFixed(2), "rgba(160, 160, 160, 1)");
}




//RENDER
function render(){
	DrawBox(0,canvas.height, canvas.width, canvas.height, "rgba(0, 0, 0, 1)");	//clear

    // Render 
	level.render(ctx);
	
	pushToRender();

	onGUI(ctx);
}


function onGUI(ctx){
	
	level.onGUI(ctx);

	let sprite = new Sprite('res/bg-main-menu.png', [0,  0], [canvas.width, canvas.height]);
	GUIDrawSprite(0, canvas.height, sprite);

	//DrawUI();
	
	//entity info
	for(var i=0; i<entities.length; i++){
		
		/*var e = entities[i];
		if(pointInBox(mouseWorld, e.pos, 16)){
			var x = mouse[0] + 20;
			var y = mouse[1] + 20;
			
			
			DrawBox(x, y, 100, 100, "rgba(0, 0, 0, 0.5)");
			DrawText(x+5, y-10, 'Name: '+e.name, "rgba(160, 160, 160, 1)");
			DrawText(x+5, y-40, 'Speed: '+e.speed, "rgba(128, 128, 128, 1)");
			DrawText(x+5, y-50, 'Selected['+e.selected+']', "rgba(128, 128, 128, 1)");
			
			DrawText(x+5, y-60, 'type['+(e.constructor.name)+']', "rgba(128, 128, 128, 1)");
				
			if(e instanceof Human){
				DrawText(x+5, y-30, 'Health: '+e.health, "rgba(255, 128, 128, 1)");
			}
				
			if(e instanceof Projectile){
				DrawText(x+5, y-90, 'lifetime: '+(e.lifeTime).toFixed(2)+'', "rgba(128, 128, 128, 1)");
			}
			
			DrawRect(e.pos[0]-10-camera[0], e.pos[1]+11-camera[1], 20, 20, colorStr(256,128,0,(mousePress0)? 0.8 : 0.5) );
			break;
		}*/
	}
	
	
	
}


//SORTING RENDER
var renderData = [];

function pushToRender(){
	renderData.sort(function(a, b) {
	
		if((a==null || a.sprite==null) && (b==null || b.sprite==null) )		return;
		else if(a==null || a.sprite==null)		return parseFloat(b.sprite.depth);
		else if(b==null || b.sprite==null) 		return parseFloat(a.sprite.depth)
		
		if(a.depth==null)	a.depth = 0;
		if(b.depth==null)	b.depth = 0;
		return (parseFloat(a.depth) - parseFloat(b.depth));	// + (parseFloat(a.pos[1]*10) - parseFloat(b.pos[1]*10))
		//return parseFloat(a.pos[1]) - parseFloat(b.pos[1]);
		
	});
	
	for(var i=0; i<renderData.length; i++){
		renderEntity(renderData[i]);
	}
	renderData = [];
}

function renderEntity(e){
	if(e==null || e.sprite==null) return;

	ctx.save();
	ctx.translate(Math.round(e.pos.x+e.sprite.offset[0]-camera.x), canvas.height-Math.round((e.pos.y)+e.sprite.offset[1]-camera.y));

	e.sprite.render(ctx);
	ctx.restore();
}



//console.log(getImageData(resources.get('res/tiles.png')))
function getImageData( image ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

}

function getPixel( imagedata, x, y ) {

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}

//var imagedata = getImageData( imgTexture.image );
//var color = getPixel( imagedata, 10, 10 );

