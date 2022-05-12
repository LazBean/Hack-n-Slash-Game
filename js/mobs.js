
//PLAYER
/*(function() {
    function Player() {
        this.name = 'player';
		this.speed = 128;
		this.dir = [0, 0, 0];
		this.pos = [50 + randomFRange(0,200), 50 + randomFRange(0,50), 0];
		this.sprite = new Sprite('res/tiles.png', [0, 80], [24, 32], 8, [0,1,0,2], -10);
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.curAnim = [];
		this.animIdle = [0];
		this.animWalk = [0,1,0,2];
		
		this.isJumping = false;
		
		entities.push(this);
    };

    Player.prototype = {
        update: function(dt) {
            this.sprite.update(dt);
		
		
			//anim
			if(vectorLength([this.dir[0], this.dir[1], 0]) == 0){
				this.curAnim = this.animIdle;
			}else{
				this.curAnim = this.animWalk;
			}
			
			this.timer -= dt * vectorLength([this.dir[0]*this.speed, this.dir[1]*this.speed, 0]);
			if(this.timer<=0){
				this.curFrame = (this.curFrame+1)%this.curAnim.length;
				this.sprite.frames = [this.curAnim[this.curFrame]];
				this.timer = 8;
			}
			
			//movement
			this.dir = [0,0,this.dir[2]];
			if(input.isDown('W')){
				this.dir[1] = 1;	this.sprite.pos = [0,176];
			}
			if(input.isDown('S')){
				this.dir[1] = -1;	this.sprite.pos = [0,112];
			}
			if(input.isDown('A')){
				this.dir[0] = -1;	this.sprite.pos = [0,80];
			}
			if(input.isDown('D')){
				this.dir[0] = 1;	this.sprite.pos = [0,144];
			}
			
			if(input.isDown('space') && !this.isJumping){
				this.dir[2] = 128;
				this.isJumping = true;
			}
			if(this.pos[2] == 0){
				this.isJumping = false;
			}
			
			//this.dir[1] *= 0.666;
			
			//pickup gold
			for(var i=0; i<entities.length; i++){
				
				var e = entities[i];
				if(e.name == "coin" && Distance(this.pos, e.pos)<16 && !e.picked){
					entities[i].pickup(this);
				}
			}
			
			this.dir = vectorLerp(this.dir, [0,0,-128], 0.05);
			
			//console.log(this.dir[2]);
			
			this.pos = [this.pos[0] + this.dir[0] * this.speed * dt, 
						this.pos[1] + this.dir[1] * this.speed * dt, 
						this.pos[2] + this.dir[2] * dt];
					
			this.pos[2] = Math.clamp(this.pos[2],0,999);
        },

        render: function(ctx){
			this.sprite.offset = [0,12];
			this.sprite.depth = -this.pos[1]+this.pos[2]+1;
			renderData.push(this);
			//shadow
			renderData.push({
				pos: [this.pos[0], this.pos[1], 0],
				sprite: new Sprite('res/tiles.png', [0, 72], [16, 8],0,[0], -this.pos[1]),
			});
		},
		
		
		remove: function(){
			
		}
    };

    window.Player = Player;
})();
*/






//CHEST
(function() {
    function Chest() {
        this.name = 'chest';
		this.speed = 1;
		this.dir = [0, 0, 0];
		this.pos = [50 + randomFRange(0,200), 50 + randomFRange(0,50), 0];
		this.sprite = new Sprite('res/tiles.png', [0,224], [32, 32], 0, [0], -30);
		
		this.timer = 0;
		
		this.isOpened = false;
		this.spawnCoin = 0;
		this.nextSpawnTimer = 0;
		
		entities.push(this);
    };

    Chest.prototype = {
        update: function(dt) {
            this.sprite.update(dt);
				
			this.timer -= dt;
			if(this.timer<=0){
				//this.sprite.frames = [randomRange(0,3)];
				this.timer = 0.2;
			}
			
			//spawn coins
			this.nextSpawnTimer -= dt;
			if(this.nextSpawnTimer<=0 && this.spawnCoin>0){
				var coin = new Coin();
				coin.pos = this.pos;
				coin.dir = [randomFRange(-1,1)*512, randomFRange(-1,-0.2)*256, randomFRange(0.5,1) * 512];
				
				this.spawnCoin--;
				this.nextSpawnTimer = 0.1;
			}
			
			if(Distance(player.pos, this.pos) < 32 && !this.isOpened){
				this.isOpened = true;
				this.open();
				
				this.dir =  vectorNormalize(vectorDir(player.pos, this.pos));
			}
			
			
			this.dir = vectorLerp(this.dir, [0,0,0], 0.2);
			
			
			this.pos = [this.pos[0] + this.dir[0] * this.speed, 
						this.pos[1] + this.dir[1] * this.speed, 
						this.pos[2] + this.dir[2] * this.speed];
        },

        render: function(ctx){
			this.sprite.offset = [0,6];
			this.sprite.depth = -this.pos[1]+this.pos[2]+1;
			renderData.push(this);
			//shadow
			renderData.push({
				pos: [this.pos[0], this.pos[1], 0],
				sprite: new Sprite('res/tiles.png', [0, 248], [32, 24],0,[0], -this.pos[1]),
			});
		},
		
		
		open: function(){
			this.sprite.frames = [1];
			this.spawnCoin += 300;
		},
		
		remove: function(){
			var index = entities.indexOf(this);
			if (index > -1) {
				entities.splice(index, 1);
			}
		}
    };

    window.Chest = Chest;
})();






//COIN
(function() {
    function Coin() {
        this.name = 'coin';
		this.speed = 1;
		this.dir = [0, 0, 0],
		this.pos = [50 + randomFRange(0,200), 50 + randomFRange(0,50), 0];
		this.sprite = new Sprite('res/tiles.png', [48, 0], [8, 8], 8, [0,1,2,3], -40);
		
		this.picked = false;
		this.target = null;
		
		this.timer = 0;
		
		entities.push(this);
    };

    Coin.prototype = {
        update: function(dt) {
            this.sprite.update(dt);
					
			this.timer -= dt;
			if(this.timer<=0){
				//this.sprite.frames = [randomRange(0,3)];
				this.timer = 0.2;
			}
			
			
			//magnit
			if(this.target != null && this.picked){

				this.pos = vectorLerp(this.pos, this.target.pos, 0.2);
				
				if(Distance(this.target.pos, this.pos)<=2){
					goldCount++;
					audio.play('audio/money.wav');
					this.remove();
				}
			}else{
				/*this.pos[2] = 2;
				this.dir = [0, 0, Math.cos(gameTime*10)*4];*/
			}
			
			this.dir = vectorLerp(this.dir, [0,0,-128], 0.2);
			
			
			this.pos = [this.pos[0] + this.dir[0] * this.speed * dt, 
						this.pos[1] + this.dir[1] * this.speed * dt, 
						this.pos[2] + this.dir[2] * dt];
						
			this.pos[2] = Math.clamp(this.pos[2],0,999);
		},

        render: function(ctx){
			this.sprite.depth = -this.pos[1]+this.pos[2]+1;
			renderData.push(this);
			//shadow
			renderData.push({
				pos: [this.pos[0], this.pos[1], 0],
				sprite: new Sprite('res/tiles.png', [48, 8]  , [8, 8],0,[0], -this.pos[1]),
			});
		},
		
		
		pickup: function(e){
			this.picked = true;
			this.target = e;
		},
		
		remove: function(){
			var index = entities.indexOf(this);
			if (index > -1) {
				entities.splice(index, 1);
			}
		}
    };

    window.Coin = Coin;
})();









//BALL
(function() {
    function Ball() {
        this.name = 'ball';
		this.speed = 1;
		this.dir = [0, 0, 0];
		this.pos = [50 + randomFRange(0,200), 50 + randomFRange(0,50), 64];
		this.sprite = new Sprite('res/tiles.png', [64, 224], [24, 24], 0, [0,1], -30);
		
		this.timer = 0;
		this.curFrame = 0;
		
		this.isOpened = false;
		this.spawnCoin = 0;
		this.nextSpawnTimer = 0;
		
		entities.push(this);
    };

    Ball.prototype = {
        update: function(dt) {
            this.sprite.update(dt);
				
			this.timer -= dt * vectorLength([this.dir[0], this.dir[1], 0]);
			if(this.timer<=0){
				this.curFrame = (this.curFrame+1)%2;
				this.sprite.frames = [this.curFrame];
				this.timer = 2;
			}
			
			
			
			if(Distance(player.pos, this.pos) < 16 && !this.isOpened){
				
				this.dir =  vectorNormalize(vectorDir(player.pos, this.pos));
				this.dir[2] += 64;
				this.dir[0] *= 128;
				this.dir[1] *= 128;
			}
			
			
			this.dir = vectorLerp(this.dir, [0,0,-128], 0.02);
			
			
			this.pos = [this.pos[0] + this.dir[0] * this.speed * dt, 
						this.pos[1] + this.dir[1] * this.speed * dt, 
						this.pos[2] + this.dir[2] * dt];
				
			if(this.pos[2] <= 0){
				this.dir[2] = -this.dir[2] * 0.5;
			}
			this.pos[2] = Math.clamp(this.pos[2],0,999);
        },

        render: function(ctx){
			this.sprite.offset = [0,8];
			this.sprite.depth = -this.pos[1]+this.pos[2]+1;
			renderData.push(this);
			//shadow
			renderData.push({
				pos: [this.pos[0], this.pos[1], 0],
				sprite: new Sprite('res/tiles.png', [64, 248]  , [24, 24],0,[0], -this.pos[1]),
			});
		},
		
		
		remove: function(){
			var index = entities.indexOf(this);
			if (index > -1) {
				entities.splice(index, 1);
			}
		}
    };

    window.Ball = Ball;
})();


