
//define the world object
var World = function(config) {			

	this.track = [];								 //list of x,y coordinates for the track
	this.scenery = [];								 //list of scenery object locations
	this.objects = [];								 //list of interactive objects in the world
	this.hitboxes = [];								 //master list of hitboxes in the world
	this.vehicle = {};								 //object to hold the vehicle information
	this.screenLocation = { x:0, y:0 };				 //used to track the global X-coordinate of the left and top edges of the screen
	this.displayLocation = config.displayLocation;   //used to offset the object on the screen
	this.surfaceThickness = config.surfaceThickness; //used to draw the 'road'


	//object to hold world configuration data
	this.config = {						
		gravity : config.gravity,
		friction : config.friction
	};									

	this.updateScreen = function(obj) {
		
		this.screenLocation.x = obj.location.x - obj.drawLocation.x;
		this.screenLocation.y = obj.location.y - obj.drawLocation.y;
	}


	//method to add a new vehcile into the world
	this.newVehicle = function(config) {
		this.vehicle = new Car_Model(config);
	}

	this.newWheel = function(config) {
		this.vehicle = new Wheel_Model(config);
	}

	//method to add a new track into this.track
	this.newTrack = function() {

		//track is currently too 'jagged' - too much 'noise'
		//need to slow down the changes - if trackChange changed last time, then don't change it this time

		//define some configuration parameters
		var steepness = 1;					//maximum hill steepness - 0.5 fairly flat, 10 probably too steep
		var pointiness = 1;					//maximum change in the steepness at any given point
		var smoothness = 3;					//larger number = smooth track, smaller = more jagged
		var maxHillHeight = 200;			//maximum size of a hill (peak to valley)

		//initialize some key variables
		var trackLength = canvas.width*20;
		var startHeight = canvas.height/2;
		var trackHeight = canvas.height/2;
		var trackChange = 0;
		var trackDelta = 0;

		//generate the track itself
		for(x=0; x<=trackLength; x++) {
			
			if(x<400) {
				this.track[x] = startHeight;
			} else {

				//update the track location
				trackHeight = trackHeight + trackChange;
				this.track[x]=trackHeight;

				//update the rate at which the track location is changing
				if((trackHeight-startHeight) > maxHillHeight) {
					trackDelta = (Math.random() * (pointiness/2) - (pointiness/2))/smoothness; 		//hill too high - trackDelta between -pointiness/2 and 0
				} else if ((trackHeight-startHeight) < -1*maxHillHeight) {
					trackDelta = (Math.random() * (pointiness/2))/smoothness; 						//track too low - trackDelta between 0 abnd pointiness/2
				} else {
					trackDelta = (Math.random() * pointiness - (pointiness/2))/smoothness; 			//track level ok - trackDelta between -pointiness/2 and pointiness/2
				}
				
				trackChange = trackChange + trackDelta;
				trackChange = Math.max(trackChange, -1*steepness);
				trackChange = Math.min(trackChange, steepness);
			}

		};

		//define the draw routine for the track
		this.drawTrack = function(ctx,location) {

			//start index needs to be 'displayLocation' behind the car

		    //set the colors for drawing the face
		    var sky_color = 'rgba(145,185,250,1)';
		    var grnd_color = 'rgba(50,150,50,1)';
		    var road_color = 'rgba(50,50,50,1)';
		    ctx.lineWidth = 1;

		    //define the start and end indexes of what we need to draw
		    var startIndex = this.screenLocation.x;
		    var endIndex = startIndex + canvas.width;

		    //start the path
		    var sky_pth = new Path2D();
		    var road_pth = new Path2D();
		    var grnd_pth = new Path2D();

	    	//move the canvas to the baseline position
	    	ctx.translate(0,-1*location.y);


		    //loop over the track vertices
		    for(var i=0;i<=canvas.width;i++) {

		        sky_pth.moveTo(i,world.track[i+startIndex]);
		        sky_pth.lineTo(i+1,world.track[i+startIndex+1]);
		        sky_pth.lineTo(i+1,-1*canvas.height);

		        ctx.strokeStyle = grnd_color;
		        grnd_pth.moveTo(i,world.track[i+startIndex]);
		        grnd_pth.lineTo(i+1,world.track[i+startIndex+1]);
		        grnd_pth.lineTo(i+1,canvas.height*2);

		        ctx.strokeStyle = road_color;
		        road_pth.moveTo(i,world.track[i+startIndex]);
		        road_pth.lineTo(i+1,world.track[i+startIndex+1]);

		    };

		    //draw the sky
		    ctx.strokeStyle = sky_color;
		    ctx.stroke(sky_pth);

		    //draw the ground
		    ctx.strokeStyle = grnd_color;
		    ctx.stroke(grnd_pth);

		    //drawingw the road
		    ctx.strokeStyle = road_color;
		    context.lineWidth = this.surfaceThickness;
		    ctx.stroke(road_pth);

	        //move the canvas back to where the car is
	        ctx.translate(0,location.y);

	        // ctx.moveTo(0,canvas.height/2);
	        // ctx.lineTo(canvas.width, canvas.height/2);
	        // ctx.stroke();


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


