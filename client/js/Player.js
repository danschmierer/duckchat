function Player  (startX, startY, id, typeId) {
	var x = startX,
		y = startY,
		targetX = startX,
		targetY = startY,
		stepX = 10,
		playerType = typeId,
		avatar = $('<div id="' + id + '" class="user d' + playerType +' flip"></div>').appendTo("#container");
		
	avatar.css('left', x);
	avatar.css('top', y);
	
	var setDirection = function() {
		var flip = targetX < x;
		$('#' + id).toggleClass('flip', flip);
	};
	
	return {
		id : id,
		getX: function() {
			return x;
		},
		getY: function() {
			return y;
		},
		setX: function(newX) {
			x = newX;
		},
		setY: function(newY) {
			y = newY;
		},
		setTargetX: function(newTargetX) {
			targetX = newTargetX;
			setDirection();
		},
		setClickHandler : function(onClick) {
			avatar.click(onClick);
		},
		update: function() {
			if(x != targetX) {
				var stepVal = Math.abs(x - targetX);
				if(stepVal > stepX) {
					stepVal = stepX;
				}

				if(x < targetX) {
					x += stepVal;
				} else {
					x -= stepVal;
				}
				avatar.css('left', x);
			}
		}
	}
	
}