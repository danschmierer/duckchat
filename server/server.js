var util = require("util"),
	io = require("socket.io"), 
	Player = require("./Player").Player,
	players = [];
	
function init() {
	players = [];
	
	socket = io.listen(8000);
	socket.configure(function() {
		socket.set("transports", ["websocket"]);
		socket.set("log level", 2);
	});
	
	setEventHandlers();
}

var setEventHandlers = function() {
	socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
	util.log("New player has connected: " + client.id);
	
	client.on("disconnect", onClientDisconnect);
	client.on("new player", onNewPlayer);
	client.on("move player", onMovePlayer);
	client.on("quack", onQuack);
}

function onClientDisconnect() {
	util.log("Player has disconnected: " + this.id);
	var removePlayer = playerById(this.id);
	
	if(!removePlayer) {
		return;
	}
	
	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit("remove player", {id:this.id});
}

function onNewPlayer(data) {
	var existingPlayer,
		newPlayer = new Player(data.x, data.y, data.playerType),
		i;
	
	newPlayer.id = this.id;
	players.push(newPlayer);
	
	//tell everyone about new player
	this.broadcast.emit("new player", {id:newPlayer.id, x:newPlayer.getX(), y:newPlayer.getY(), playerType:data.playerType});
	
	//tell current user about existing players
	//TODO: batch this into single call?
	for(i=0; i<players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {clientId:this.id, id:existingPlayer.id, x:existingPlayer.getX(), y:existingPlayer.getY(), playerType:existingPlayer.getPlayerType()});
	}
}

function onMovePlayer(data) {
	var player = playerById(this.id);
	
	player.setTargetX(data.x);
	player.setTargetY(data.y);
	this.broadcast.emit("move player", {id:player.id, x:player.getTargetX(), y:player.getTargetY()});
}

function onQuack(data) {
	var player = playerById(this.id);
	
	this.broadcast.emit("quack", {id:this.id, x:player.getX(), y:player.getY()});
}

function playerById(id) {
	var i;
	
	for(i=0; i<players.length; i++) {
		if(players[i].id == id) {
			return players[i];
		}
	}
}

init();