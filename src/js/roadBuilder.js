
//define the world object
var World = function(config) {			

	this.track = [];		//list of x,y coordinates for the track
	this.scenery = [];		//list of scenery object locations
	this.objects = [];		//list of interactive objects in the world
	this.hitboxes = [];		//master list of hitboxes in the world
	this.vehicle = {};		//object to hold the vehicle information

	//object to hold world configuration data
	this.config = {						
		gravity : config.gravity,
		friction : config.friction
	};									


	//method to add a new vehcile into the world
	this.newVehicle = function(config) {
		this.vehicle = new Car_Model(config);
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
		this.track.draw = function(ctx,location) {

		    //set the colors for drawing the face
		    var sky_color = 'rgba(145,185,250,1)';
		    var grnd_color = 'rgba(50,150,50,1)';
		    var road_color = 'rgba(50,50,50,1)';
		    ctx.lineWidth = 10;

		    //define the start and end indexes of what we need to draw
		    var startIndex = location.x;
		    var endIndex = startIndex + canvas.width;

		    //start the path
		    var sky_pth = new Path2D();
		    var road_pth = new Path2D();
		    var grnd_pth = new Path2D();

		    //loop over the track vertices
		    for(var i=0;i<=endIndex;i++) {

		        sky_pth.moveTo(i,world.track[i+startIndex]-location.y);
		        sky_pth.lineTo(i+1,world.track[i+startIndex+1]-location.y);
		        sky_pth.lineTo(i+1,0);

		        ctx.strokeStyle = grnd_color;
		        grnd_pth.moveTo(i,world.track[i+startIndex]-location.y);
		        grnd_pth.lineTo(i+1,world.track[i+startIndex+1]-location.y);
		        grnd_pth.lineTo(i+1,canvas.height);

		        ctx.strokeStyle = road_color;
		        road_pth.moveTo(i,world.track[i+startIndex]-location.y);
		        road_pth.lineTo(i+1,world.track[i+startIndex+1]-location.y);

		    };

		    //draw the sky
		    ctx.strokeStyle = sky_color;
		    ctx.stroke(sky_pth);

		    //draw the ground
		    ctx.strokeStyle = grnd_color;
		    ctx.stroke(grnd_pth);

		    //drawingw the road
		    ctx.strokeStyle = road_color;
		    context.lineWidth = 15;
		    ctx.stroke(road_pth);

		};

		//generate the scenery
		//generate the objects

	}; //this.newTrack()

	//method to find the location at which the provided wheel touches the track
	this.wheelContact = function(obj) {

		//obj must be an object with two properties
		//obj.location = vertex2D containing the center of the wheel (global coordinates)
		//obj.radius = the radius of the wheel


		//initial empty list of contacts and a few other placeholder variables
		var contact = [];
		var dist = 0;
		var y = 0;
		var total = 0;
		var ave_x = 0;
		var delta_x = 0;
		var delta_y = 0;
		var contact_angle = 0;

		//determine the max/min x values of the object
		var max_x = obj.location.x + obj.radius;
		var min_x = obj.location.x - obj.radius;
		
		//for each x value 
		for(var x=min_x;x<=max_x;x++) {

			//get the track y value
			y = this.track[x];

			//calculate distance from x,y to center of obj
			dist = Math.sqrt(((obj.location.x - x)*(obj.location.x - x)) + ((obj.location.y - y)*(obj.location.y - y)));

			//check if the distance from the track to the center of the circle is <= the radius
			if(dist <= obj.radius && this.track[x] <= obj.location.y) {
				
				contact[contact.length] = x;

			}

		} //end loop over x values

		if(contact.length == 0) {
			return false;
		} else {

			total = 0;

			//calculate average x value
			for(j=0; j<contact.length; j++) {
				total += contact[j];
			}

			ave_x = total / contact.length;
		}


		//calculate the contact angle
		delta_y = obj.location.y - this.track[ave_x];
		delta_x = ave_x - obj.location.x;
		contact_angle = Math.arctan(delta_x/delta_y)

		//return contact angle
		return contact_angle;

	}


	//method to save the track to a .track file
	this.saveTrack = function(config) {

	}; //end this.saveTrack()

	//method to load a track from a .track file
	this.loadTrack = function(config) {

	}; //end this.loadTrack()

};


