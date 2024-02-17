
//
var debugMode = false;
var cursorTilePos = {x:0,y:0,z:0};
var gameStarted = false
//
var entities = [];
var particles = [];

var maxDecales = 100;
var decales = [];



var enemies = [];
var enemiesSpawnTimer = 0;

var mapData = [
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,2,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,2,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,2,2],
	[0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2],
	[0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,2],
	[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
];

//???
var dmgParticles = [];
var enemiesHpBar = [];

var t = 0
var sliderValue = 0.8;

// better try quadtree to optimize
function getEntitiesToCollideWith(pos)
{
	es = []
	for(var i=0; i<entities.length; i++){
		var e = entities[i];
		if(vectorMagnitude(vectorDir(pos, e.pos)) < 2)
			es.push(e)
	}
	return es;
}



var level = {
    
	map: tilemap,
	
	//UPDATE
	start: function() {
		this.map = tilemap;
		this.map.data = mapData;
		this.map.create(16,8);


		//MOB
		gameStarted = true;
		player = new Player()


		
		for(var i=0; i<entities.length; i++) {
			//entities[i].start();
		}
		for(var i=0; i<particles.length; i++) {
			//particles[i].start();
		}
		
		
		for(var i=0; i<10; i++){
			//spawnParticle([50,20]);
		}
		
		for(var i=0; i<10; i++){
			//spawnHuman([randomRange(10,canvas.width-20),canvas.height-20]);
		}
	},
	
	update: function(dt) {
	
		this.map.update(dt);
		
		for(var i=0; i<entities.length; i++) {
			entities[i].update(dt);
		}
		
		for(var i=0; i<particles.length; i++) {
			particles[i].update(dt);
		}

		//Spawn Enemies
		if(enemies.length <= 3 && enemiesSpawnTimer<=0){

			for(var i=0; i<randomRange(1,5); i++) {
				let s = new Skeleton();
				//Spawn Point
				let sPos = {x: randomFRange(-1,1), y:randomFRange(-1,1), z:0}
				sPos = vectorMultiply( vectorNormalize(sPos), randomFRange(5.0, 6.0));
				sPos = vectorAdd(sPos, {x:this.map.width/2, y:this.map.height/2, z:0});
				s.pos = sPos;

				s.maxHealth = 40;
				s.health = s.maxHealth;
				let r = randomFRange(0,1);
				if(r > 0.70){
					s.health = randomRange(s.maxHealth/2, s.maxHealth);
				}
				

				enemies.push(s);
			}
			//
			enemiesSpawnTimer = randomFRange(5, 10);
		}
		enemiesSpawnTimer -= dt;

		//
		
		
		//Player controller
		if(player != undefined){
			let dir = {x:0, y:0, z:player.dir.z};

			//Player movement
			if(input.isDown('W')){
				dir.y = 1;	
			}
			if(input.isDown('S')){
				dir.y = -1;
			}
			if(input.isDown('A')){
				dir.x = -1;	
			}
			if(input.isDown('D')){
				dir.x = 1;	
			}
			dir = vectorRotate(dir, 45);
			dir = vectorNormalize(dir);

			///???
			//dir.z = player.vel.z;

			if(!player.isActing){
				player.vel = {
					x:dir.x * player.speed, 
					y:dir.y * player.speed, 
					z:player.vel.z,
				};

				player.dir = dir;
				
				if(!vectorEquals(dir, vector(0,0,0)))			
					player.lookDir = dir;
			}
				
				

			//jump
			if(input.isDown('space')){
				player.jump();
			}
			//attack
			if(input.isDown('e')){
				player.attack();
			}

			//Camera follows player
			var playerToScreen = WorldToIsometric(player.pos);
			camera.x = playerToScreen.x-canvas.width/2;
			camera.y = playerToScreen.y-canvas.height/2;

			network.updatePlayerRef();
		}
		
    },
	
	render: function(ctx){
		
		for(var i=0; i<entities.length; i++) {
			entities[i].render(ctx);
		}
		this.map.render(ctx);


		

		// DEBUG MODE
		if(!debugMode) return;
		// GHOST TILE
		cursorTilePos = ScreenToIsometric(mouse);

		cursorTilePos.x = Math.round(cursorTilePos.x);
		cursorTilePos.y = Math.round(cursorTilePos.y);

		if(mousePressL && input.isDown('CTRL')){
			this.map.setTile(cursorTilePos.x,cursorTilePos.y, 2);
		}
		if(mousePressR && input.isDown('CTRL')){
			this.map.setTile(cursorTilePos.x,cursorTilePos.y, 0);
		}

		renderData.push({
			pos: WorldToIsometric(cursorTilePos),
			sprite: new Sprite('res/tiles.png', [64, 0]  , [32, 16],0,[0], 0),
			depth: 1000,
		});
	},
	
	onGUI: function(ctx){
	
		for(var i=0; i<entities.length; i++) {
			entities[i].onGUI(ctx);
		}

		//Control tips
		DrawText(10, 20, 'move - WASD' + '   attack - E' + '   dodge - SPACE', "rgba(160, 160, 160, 1)");
		
		if(GUIButton(canvas.width-24, canvas.height-0, 24, 24, "E")){
			debugMode = !debugMode;
			audio.play('audio/hoverUI.wav');
		}
		
		//Coins
		//GUIDrawTextSprite("GOLD:"+goldCount, 100, canvas.height-4);

		


		if(debugMode){
			DrawText(mouse.x + 10, mouse.y-10, cursorTilePos.x+', '+cursorTilePos.y, "rgba(160, 160, 160, 1)");

			DrawText(10, canvas.height-40, "Entities: " + entities.length, "rgba(160, 160, 160, 1)");
			//Decales
			DrawText(10, canvas.height-50, "Decales: " + decales.length, "rgba(160, 160, 160, 1)");
		}

		
		//???
		//dmgParticles
		for(var i=0; i<dmgParticles.length; i++){
			let e = dmgParticles[i];
			if(e.t<=0){
				var index = dmgParticles.indexOf(e);
				if (index > -1)	dmgParticles.splice(index, 1);
				continue;
			} 
			e.pos = vectorAdd(e.pos, vectorMultiply(e.dir, 0.05) );
			//e.pos.z += 1.2;
			let pos = WorldToIsometric(e.pos);

			DrawText(pos.x-camera.x-15/2, pos.y-camera.y+30, ""+e.dmg, "rgba(200, 10, 10, 1)");
			
			e.t -= 0.01;
		}
		
		

		// DEBUG
		//let x = 300
		//let y = 300
		//let xx = Math.max(mouse.x - x, 0)
		//let yy = Math.max(y - mouse.y, 0)
		//DrawBox(300, 300, 100, 100, "rgba(50, 50, 50, 1)")
		//GUIDrawSlicedSprite(300,300, xx, yy, panelSpritePack.sprites)
		//DrawCircle(mouse.x, mouse.y,1)
		
		//

		//Show players names
		Object.keys(networkPlayerObjects).forEach((key) => {
			let p = networkPlayerObjects[key]
			let pos = WorldToIsometric(p.pos)
			DrawText(pos.x-camera.x-(p.name.length*6/2), pos.y-camera.y+40, p.name, (p.color != undefined)? p.color :"rgba(160, 160, 160, 1)");
		})

		
		//Draw oval under Player
		/*if(player != null){
			let p = WorldToIsometric(player.pos)

			let r = 10;
			DrawOval(p.x-camera.x, p.y-camera.y, r, r/2, 'rgba(255, 255, 255, 1)', false);
		}*/
		

		/*for(var i=0; i<players.length; i++) {
			let p = players[i];
			let pos = WorldToIsometric(p.pos)
			DrawText(pos.x-camera.x-(p.name.length*6/2), pos.y-camera.y+40, p.name, (p.color != undefined)? p.color :"rgba(160, 160, 160, 1)");
		}*/
		

		// Main Menu
		if(gameStarted == true) return;
		var menuRect = {x:canvas.width/2-60, y:canvas.height/2+75, w:120, h:150}

		GUIDrawSlicedSprite(menuRect.x, menuRect.y, menuRect.w, menuRect.h, panelSpritePack.sprites);
		DrawText(menuRect.x+5, menuRect.y-1, 'MENU', "rgba(60, 60, 100, 1)");

		if(GUIButton(menuRect.x + menuRect.w/2-50, menuRect.y -12-20, 100, 24, "Connect")){

			audio.play('audio/hoverUI.wav');
			network.connect()
		}

		sliderValue = GUISlider(menuRect.x + menuRect.w/2-50, menuRect.y -100, 100, 30, sliderValue, 0.5, 1, 0.1);

		
		
	}
		
		
	
};




















clr  = {r: 255, g: 128, b: 0, a: 128};

black = {r: 0, g: 0, b: 0, a: 255};
red = {r: 255, g: 0, b: 0, a: 255};

var getPixel = function(x,y){
	//ctx.save();
	//ctx.restore();
	var data = ctx.getImageData(x, y, 1, 1).data;
	var color = {r: data[0], g: data[1], b: data[2], a: data[3]};
	return color;
}

var setPixel = function (x,y,c) {
    var p = ctx.createImageData(1,1);
    p.data[0]=c.r;
    p.data[1]=c.g;
    p.data[2]=c.b;
    p.data[3]=c.a;
    ctx.putImageData(p,Math.ceil(x|0),Math.ceil(y|0));
}

var setPixels = function(xx,yy,w,h,c){

	for(var x=0; x<w; x++){
		for(var y=0; y<h; y++){
			setPixel(xx+x, yy+y, c);
		}
	}
}

var multiplyPixel = function(c1, c2){
	var c = c1;
	c[0] = (c1[0]/255)*(c2[0]/255)*255;
	c[1] = (c1[1]/255)*(c2[1]/255)*255;
	c[2] = (c1[2]/255)*(c2[2]/255)*255;
	return c;
}

var luminance = function(color){
	color[0] = color[0] / 2;
	color[1] = color[1] / 2;
	color[2] = color[2] / 2;
	return color;
}

var light = function(xx,yy,w,h){

	for(var x=0; x<w; x++){
		for(var y=0; y<h; y++){
			c = getPixel(xx+x, yy+y);
			setPixel(xx+x, yy+y, c);
		}
	}
}












