function Client() {
	
	var me = null;
		
	return {
		
		canvas: null,
		ctx: null,
		localPlayer: null,
		remotePlayers: null,
		socket: null,
		duckType: null,
		audioManager: null,
		
		init: function() {
			me = this;
			
			ducks = $.each($('.duck'), function(){
				$(this).click(me.selectDuck);
			});

			me.audioManager = new AudioManager({sounds: ['quack1.mp3']});
			me.remotePlayers = [];
			me.playerImages = [];
		},
		connect: function() {
			socket = io.connect("http://localhost", {port:8000, transports:["websocket"]});
			me.setEventHandlers();
			me.animate();
		},
		setEventHandlers: function(){
			socket.on("connect", me.onSocketConnected);
			socket.on("disconnect", me.onSocketDisconnected);
			socket.on("new player", me.onNewPlayer);
			socket.on("move player", me.onMovePlayer);
			socket.on("remove player", me.onRemovePlayer);
			socket.on("quack", me.onQuack);

			$("#container").click(me.onClickScreen);
		},
		selectDuck: function(e) {
			$("#choose").hide();
			me.duckType = e.target.id;
			me.connect();
		},
		animate: function() {
			me.draw();
			window.requestAnimFrame(me.animate);
		},
		draw: function() {
			var i;

			for(i=0; i<me.remotePlayers.length; i++) {
				var player = me.remotePlayers[i].update();
			}
		},
		onSocketConnected: function(){
			var startX = (Math.random() * window.innerWidth) >> 0,
				startY = 100;

			socket.emit("new player", {x: startX, y:startY, playerType: me.duckType});
		},
		onSocketDisconnected: function(){
			//disconnect party!
		},
		onNewPlayer: function(data){
			if(!me.remotePlayers[data.id]) {
				var newPlayer = new Player(data.x, data.y, data.id, data.playerType);

				if(data.id == data.clientId) {
					newPlayer.setClickHandler(me.onClickPlayer);
					me.localPlayer = newPlayer;
				}
				me.remotePlayers.push(newPlayer);
			}
		},
		onClickScreen: function(e) {
			me.localPlayer.setTargetX(e.clientX);
			socket.emit("move player", {x:e.clientX, y:e.clientY});
		},
		onClickPlayer: function(e) {
			socket.emit("quack");
			return false;
		},
		onMovePlayer: function(data){
			var remotePlayer = me.playerById(data.id);

			remotePlayer.setTargetX(data.x);
		},
		onRemovePlayer: function(data) {
			var removePlayer = me.playerById(data.id);

			if(!removePlayer) {
				return;
			}

			$('#' + data.id).remove();
			me.remotePlayers.splice(me.remotePlayers.indexOf(removePlayer), 1);
		},
		onQuack: function(data) {
			me.audioManager.play('quack1.mp3');
		},
		playerById: function(id) {
			var i;

			for(i=0; i<me.remotePlayers.length; i++) {
				if(me.remotePlayers[i].id == id) {
					return me.remotePlayers[i];
				}
			}
		}
	}
	
}