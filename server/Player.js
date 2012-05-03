var Player = function(startX, startY, playerType) {
	var x = startX,
		y = startY,
		targetX = startX,
		playerType = playerType,
		id;
		
	var getX = function() {
		return x;
	}
	
	var getY = function() {
		return y;
	}
	
	var setX = function(newX) {
		x = newX;
	}
	
	var setY = function(newY) {
		y = newY;
	}
	
	var setTargetX = function(newX) {
		targetX = newX;
	}
	
	var getTargetX = function() {
		return targetX;
	}
	
	var getTargetY = function() {
		return targetY;
	}
	
	var setTargetY = function(newY) {
		targetY = newY;
	}
	
	var getPlayerType = function() {
		return playerType;
	}
	
	var setPlayerType = function(type) {
		playerType = type;
	}
	
	return {
		getPlayerType: getPlayerType,
		setPlayerType: setPlayerType,
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getTargetX: getTargetX,
		setTargetX: setTargetX,
		getTargetY: getTargetY,
		setTargetY: setTargetY,
		id: id
	}
}

exports.Player = Player;