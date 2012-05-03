function AudioManager(options) {
	this.soundPath = 'sounds/';
	this.sounds = [];
	this.init(options);
}

AudioManager.prototype = {
	init: function(options) {
		var i,
			sound,
			length = options.sounds.length,
			filename;

		for(i=0; i<length; i++) {
			filename = options.sounds[i];
			sound = document.createElement('audio');
			sound.src = this.soundPath + filename;
			sound.load();
			this.sounds[filename] = sound;
		}
	},
	play: function(filename) {
		var sound = this.sounds[filename];

		if(sound) {
			sound.play();
		}
	}
};