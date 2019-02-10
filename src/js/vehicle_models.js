//this file defines the various vehicle models
// models define the movement physics and vehicle controls
// models must include an 'update()' method which is called by the main game loop to update the model
// models must include a 'control()' method which is called by the keyboard handler to process the user input

//currently implemented models
//Car - simulates a pedestrain who can jump and has a jetpack


//define the player model
var Car_Model = function(config) {

	//config.mass						mass of vehicle
	//config.length						length of vehicle (nominal)
	//config.height						height of vehicle (nominal)
	//config.location					vertex2D representing center location of vehicle
	//config.angle						angle of vehicle body
	//config.wheel						object defining wheel characteristics
		//config.wheel[n].location			vertex2D representing offset from center location of vehicle to center of the wheel
		//config.wheel[n].grip 				grip modifier for this wheel
		//config.wheel[n].radius    		radius of the wheel
		//config.wheel[n].spring    		spring constant for wheel
		//config.wheel[n].damping   		damping coefficient for wheel
		//config.wheel[n].tireColor			color of the tire
		//config.wheel[n].wheelColor		color of the hub
	//config.drivetrain					object holding drivetrain information
		//config.drivetrain.efficiency		efficiency of drive train
	//config.engine						object holding engine informaation
		//config.engine.output				engine output force


	//define vehicle parameters
	this.color = config.color;
	this.mass = config.mass;
	this.length = config.length;
	this.height = config.height;
	this.location = config.location;
	this.angle = config.angle;
	this.wheel = config.wheel
	this.drivetrain = config.drivetrain;
	this.engine = config.engine;


	//define method to draw the vehicle
	this.draw = function(ctx,location) {

		//rotate the canvas
		ctx.translate(world.displayLocation.x,world.displayLocation.y);
		ctx.rotate(this.angle);

		//draw the wheels
		for(i=0;i<this.wheel.length;i++) {

			//console.log(JSON.stringify(location));

			//draw tires
			ctx.beginPath();
			ctx.arc(this.wheel[i].location.x,this.wheel[i].location.y,this.wheel[i].radius-this.wheel[i].tireSize/2,0,2*Math.PI);
			ctx.strokeStyle = this.wheel[i].tireColor;
			ctx.lineWidth = this.wheel[i].tireSize;
			ctx.stroke();

			//draw wheels
			ctx.beginPath();
			ctx.arc(this.wheel[i].location.x,this.wheel[i].location.y,this.wheel[i].radius-this.wheel[i].tireSize,0,2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = 'rgba(100,100,100)';
			ctx.fill();

		};

		//draw the body work
		ctx.beginPath();
		ctx.moveTo(this.wheel[1].location.x+this.wheel[1].radius+3,30);
		ctx.lineTo(this.wheel[1].location.x+this.wheel[1].radius+15,30);
		ctx.arcTo (this.wheel[1].location.x+this.wheel[1].radius+25,30,this.wheel[1].location.x+this.wheel[1].radius+25,30-10,10);
		ctx.lineTo(this.wheel[1].location.x+this.wheel[1].radius+25,30-30)
		ctx.arcTo (this.wheel[1].location.x+this.wheel[1].radius+25,30-40,this.wheel[1].location.x+this.wheel[1].radius+15,30-40,10);
		ctx.lineTo(this.wheel[1].location.x,30-40);
		ctx.arcTo (this.wheel[1].location.x-5,30-40,this.wheel[1].location.x-10,30-45,10);
		ctx.lineTo(this.wheel[1].location.x-40,30-75);
		ctx.arcTo (this.wheel[1].location.x-45,30-80,this.wheel[1].location.x-50,30-80,10);
		ctx.lineTo(this.wheel[0].location.x-3,30-80)
		ctx.arcTo (this.wheel[0].location.x-43,30-80,this.wheel[0].location.x-43,30-50,30)
		ctx.lineTo(this.wheel[0].location.x-43,30-10)
		ctx.arcTo (this.wheel[0].location.x-43,30,this.wheel[0].location.x-33,30,10)
		ctx.arcTo (this.wheel[0].location.x-30,30,this.wheel[0].location.x-30,30-3,3)
		ctx.arcTo (this.wheel[0].location.x-30,30-3-this.wheel[0].radius, this.wheel[0].location.x,30-3-this.wheel[0].radius,30)
		ctx.arcTo (this.wheel[0].location.x+this.wheel[0].radius+3,30-3-this.wheel[0].radius,this.wheel[0].location.x+this.wheel[0].radius+3,30-3,30)
		ctx.lineTo(this.wheel[1].location.x-this.wheel[1].radius-6,30);
		ctx.arcTo (this.wheel[1].location.x-this.wheel[1].radius-3,30, this.wheel[1].location.x-this.wheel[1].radius-3,30-3,3);
		ctx.arcTo (this.wheel[1].location.x-this.wheel[1].radius-3,30-3-this.wheel[1].radius,this.wheel[1].location.x,30-3-this.wheel[1].radius,this.wheel[1].radius+3);
		ctx.arcTo (this.wheel[1].location.x+this.wheel[1].radius+3,30-3-this.wheel[1].radius,this.wheel[1].location.x+this.wheel[1].radius+3,30-3,this.wheel[1].radius+3);
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();

		//draw the windows
		ctx.beginPath();
		ctx.moveTo(this.wheel[1].location.x-45,-10);
		ctx.lineTo(this.wheel[1].location.x-45,-40);
		ctx.lineTo(this.wheel[1].location.x-15,-10);
		ctx.lineTo(this.wheel[1].location.x-45,-10);
		ctx.stroke();
		ctx.fillStyle = 'rgba(145,185,250,1)';
		ctx.fill();
		
		//put the canvas back
		ctx.rotate(-1*this.angle);
		ctx.translate(-1*(world.displayLocation.x), -1*(world.displayLocation.y));


	}; //this.draw()


	//define vehicle movement physics
	this.update = function(location) {

	
		//check if any of the wheels are touching the track
		for(var i=0; i<this.wheel.length; i++) {
			
			this.wheel[i].glbLocation = {};
			this.wheel[i].glbLocation.x = this.location.x + this.wheel[i].location.x;
			this.wheel[i].glbLocation.y = this.location.y + this.wheel[i].location.y;
			this.wheel[i].contactAngle = this.wheelContact(i,world.track);

			console.log(this.wheel[i].contactAngle*180/Math.PI);

			if(this.wheel[i].contactAngle === false) {
				//no contact has occurred
				//need to apply 'torque' to rotate the vehicle (change theta)
			} else {
				
				//the wheel is in contact with the track
				//use the contact angle to determine forces


			}		

		}



		//for each wheel
			//get the array of contact angles
			//calculate the forces on the wheel
			//calcualte the reactions on the wheel
			//move everything to the CG of the vehicle (forces and moments)

		//for the front collision box
			//check if each side has hit the ground
			//for each side
				//calculate the reactions on the car
					//move everything to the CG

		//pull in any user input
			//calculate and apply any moments/forces

		//apply all the moments and forces to the vehicle
			//update acceleration
			//upadte velocity
			//update location
			//update angular acceleration
			//update angular velocity
			//update rotation angle

	};

	//define vehicle controls
	this.control = function(e) {

	};

	//method to find the location at which the provided wheel touches the track
	this.wheelContact = function(i,track) {

		//obj must be an object with two properties
		//obj.location = vertex2D containing the center of the wheel (global coordinates)
		//obj.radius = the radius of the wheel
		var obj = this.wheel[i];

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
		var max_x = obj.glbLocation.x + obj.radius;
		var min_x = obj.glbLocation.x - obj.radius;

		//for each x value 
		for(var x=min_x;x<=max_x;x++) {

			//get the track y value
			y = track[x];

			//calculate distance from x,y to center of obj
			dist = Math.sqrt(((obj.glbLocation.x - x)*(obj.glbLocation.x - x)) + ((obj.glbLocation.y - y)*(obj.glbLocation.y - y)));

			//check if the distance from the track to the center of the circle is <= the radius
			if(dist <= obj.radius) {
			
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

			ave_x = Math.floor(total / contact.length);
		}

		console.log("AVERAGE X: "+ave_x);

		//calculate the contact angle
		delta_y = track[ave_x] - obj.glbLocation.y;
		delta_x = ave_x - obj.glbLocation.x;
		console.log("delta_y: "+delta_y);
		console.log("delta_x: "+delta_x);
		contact_angle = Math.atan(delta_x/delta_y)

		//return contact angle
		return contact_angle;

	}

}; //end Car_Model
