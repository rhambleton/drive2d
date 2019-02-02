
//define the world object
var World = function(config) {			

	this.track = [];		//list of x,y coordinates for the track
	this.scenery = [];		//list of scenery object locations
	this.objects = [];		//list of interactive objects in the world
	this.hitboxes = [];		//master list of hitboxes in the world
	this.player = {};		//object to hold all the player data

	//object to hold world configuration data
	this.config = {						
		gravity : config.gravity,
		friction : config.friction
	};									

	//method to add the player into the world
	this.addPlayer = function(config) {

	}; //end of this.addPlayer()


	//method to add a new track into this.track
	this.newTrack = function() {

		//track is currently too 'jagged' - too much 'noise'
		//need to slow down the changes - if trackChange changed last time, then don't change it this time

		//define some configuration parameters
		var steepness = 1;			//maximum hill steepness - 0.5 fairly flat, 10 quite steep
		var smoothness = 5;			//larger number = smooth track, smaller = more jagged

		//initialize some key variables
		var trackLength = canvas.width*20;
		var maxHeight = canvas.width - 200;
		var trackHeight = canvas.height/2;
		var trackChange = 0;
		var trackDelta = 0;

		//generate the track itself
		for(x=0; x<=trackLength; x++) {
			
			//update the track location
			trackHeight = trackHeight + trackChange;
			this.track[x]=trackHeight;

			//update the rate at which the track location is changing
			trackDelta = (Math.random() * 2 - 1)/smoothness; 		//add 1, subtract 1, stay the same
			trackChange = trackChange + trackDelta;
			trackChange = Math.max(trackChange, -1*steepness);
			trackChange = Math.min(trackChange, steepness);

		};

		//generate the scenery
		//generate the objects

	}; //this.newTrack()

	//method to save the track to a .track file
	this.saveTrack = function(config) {

	}; //end this.saveTrack()

	//method to load a track from a .track file
	this.loadTrack = function(config) {

	}; //end this.loadTrack()

};


