
var player;
var players = {};
var networkPlayerObjects = {};

(function() {
    
	let playerID;
	let playerRef;

	function update(){
		if(player == null || players[playerID] == undefined) return;
		players[playerID].x = player.pos.x;
		players[playerID].y = player.pos.y;

		playerRef.set(players[playerID]);
	}

    function connect() {

		// MULTIPLAYER AUTH
		firebase.auth().onAuthStateChanged((user) => {
			console.log(user);
			if(user){
				//logged in!
				playerID = user.uid;
				playerRef = firebase.database().ref('players/'+playerID);

				playerRef.set({
					id: playerID,
					name: "Bean",
					color: colorStr(randomRange(50,255), randomRange(50,255), randomRange(50,255), 1),
					x: 3,
					y: 3,
					coins: 0,
				});

				//Remove me when im disconnected
				playerRef.onDisconnect().remove();

				//Start game
				//...
				const allPlayersRef = firebase.database().ref('players');
				const allCoinsRef = firebase.database().ref('coins');

				allPlayersRef.on("value", (snapshot) => {
					//Whenever a change occurs
					players = snapshot.val() || {};
					Object.keys(players).forEach((key) => {
						const characterState = players[key]
						p = networkPlayerObjects[key]
						p.name = characterState.name;
						p.color = characterState.color;
						p.pos = {x:characterState.x, y:characterState.y, z:0}
					})
					
				})

				allPlayersRef.on("child_added", (snapshot) => {
					//Whenever a new node is added the tree
					const addedPlayer = snapshot.val();
					character = new Player(addedPlayer.name);
					character.color = addedPlayer.color
					
					if(addedPlayer.id === playerID){
						player = character;
						console.log(player)
					}
					
					networkPlayerObjects[addedPlayer.id] = character;
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
		update: update,
    };

})();