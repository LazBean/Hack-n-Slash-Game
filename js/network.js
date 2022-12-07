
var player;
var networkPlayers = {};
var networkPlayerObjects = {};

var networkEnemies = {};
var networkEnemyObjects = {};

(function() {
    
	let playerID;
	let playerRef;

	function updatePlayerRef(){
		if(player == null || networkPlayers[playerID] == undefined) return;

		networkPlayers[playerID].pos = player.pos;
		networkPlayers[playerID].dir = player.dir;

		//playerRef.set(networkPlayers[playerID]);
		playerRef.update({
			pos: player.pos,
			dir: player.dir,
		})
	}

	function addEnemy(){
		let id = 0
		enemyRef = firebase.database().ref(`enemies/${id}`);
		enemyRef.set({
			x:2,
			y:2,
		});
	}

	

    function connect() {

		// MULTIPLAYER AUTH
		firebase.auth().onAuthStateChanged((user) => {
			console.log(user);
			if(user){
				//logged in!
				playerID = user.uid;
				playerRef = firebase.database().ref(`players/${playerID}`);

				playerRef.set({
					id: playerID,
					name: "Bean",
					color: colorStr(randomRange(50,255), randomRange(50,255), randomRange(50,255), 1),

					pos: {x:0, y:0, z:0},
					dir: {x:0, y:0, z:0},
					coins: 0,
				});

				//Remove me when im disconnected
				playerRef.onDisconnect().remove();

				//Start game
				//...
				const allPlayersRef = firebase.database().ref('players');
				const allEnemiesRef = firebase.database().ref('enemies');

				allPlayersRef.on("value", (snapshot) => {
					//Whenever a change occurs
					networkPlayers = snapshot.val() || {};
					Object.keys(networkPlayers).forEach((key) => {
						const characterState = networkPlayers[key]

						p = networkPlayerObjects[key]
						p.name = characterState.name;
						p.color = characterState.color;
						p.pos = characterState.pos
					})
					
				})

				allPlayersRef.on("child_added", (snapshot) => {
					//Whenever a new node is added the tree
					const addedPlayer = snapshot.val();
					playerObj = new Player(addedPlayer.name);
					playerObj.color = addedPlayer.color
					
					if(addedPlayer.id === playerID){
						player = playerObj;
					}
					
					networkPlayerObjects[addedPlayer.id] = playerObj;
				})

				allPlayersRef.on("child_removed", (snapshot) => {
					//Whenever a node is removed from the tree
					const removedKey = snapshot.val().id;
					//Remove player object(entity)
					networkPlayerObjects[removedKey].remove();
					delete networkPlayerObjects[removedKey];
				})


				allEnemiesRef.on("child_added", (snapshot) => {
					//Whenever a new node is added the tree
					const addedEnemy = snapshot.val();
					enemyObj = new Skeleton("skeleton "+networkEnemies.length + 1);
					
					networkEnemyObjects[addedPlayer.id] = enemyObj;
				})

				allEnemiesRef.on("child_removed", (snapshot) => {
					//Whenever a node is removed from the tree
					const removedKey = snapshot.val().id;
					//Remove player object(entity)
					networkEnemyObjects[removedKey].remove();
					delete networkEnemyObjects[removedKey];
				})

				//...
				gameStarted = true;
				
			}
			else{
				//logged out
			}
		});

		firebase.auth().signInAnonymously().catch((error) => {
			var errorCode = error.code;
			var errorMsg = error.message;
			console.log(errorCode, errorMsg);
		});
    }

	window.network = { 
        connect: connect,
		updatePlayerRef: updatePlayerRef,
    };

})();