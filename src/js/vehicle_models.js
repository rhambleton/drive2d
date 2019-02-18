//this file defines the various vehicle models
// models define the movement physics and vehicle controls
// models must include an 'update()' method which is called by the main game loop to update the model
// models must include a 'control()' method which is called by the keyboard handler to process the user input

//currently implemented models
//Car - simulates a pedestrain who can jump and has a jetpack


//define the car model
var Car_Model = function(config) {

	//config.mass						mass of vehicle
	//config.length						length of vehicle (nominal)
	//config.height						height of vehicle (nominal)
	//config.location					vertex2D representing center location of vehicle
	//config.angle						angle of vehicle body (theta)
	//config.wheel						array of objects defining wheel characteristics
		//config.mass						mass of wheel
		//config.radius 					radius of wheel
		//config.location					vertex2D representing center location of wheel in global coordinates
		//config.drawLocation				location of wheel in relation to the default draw point on the screen
		//config.angle						angle of wheel body (theta)
		//config.grip 						grip modifier for this wheel
		//config.tireSize 					size of the tire
		//config.tireColor					color of the tire
		//config.wheelColor					color of the hub
		//config.driveWheel					is this a drive wheel
		//config.output						output of this wheel
		//config.friction					friction factor for this wheel
		//config.tireBounce					bounceiness of the tire = 1.0 perfect bounce (no energy loss), 0=no bounce



	//define vehicle parameters
	this.color = config.color;
	this.mass = config.mass;
	this.length = config.length;
	this.height = config.height;
	this.drawLocation = config.drawLocation;
	this.location = config.location;
	this.angle = config.angle;
	this.wheel = [];
	for(w=0; w<config.wheel.length; w++) {
		this.wheel[w] =  new Wheel_Model(config.wheel[w]);
		this.wheel[w].offset = config.wheel[w].offset;
		this.wheel[w].drawLocation.x = config.drawLocation.x + config.wheel[w].offset.x;
		this.wheel[w].drawLocation.y = config.drawLocation.y + config.wheel[w].offset.y;
		this.wheel[w].location.x = config.location.x + config.wheel[w].offset.x;
		this.wheel[w].location.y = config.location.y + config.wheel[w].offset.y;
	}

	//define method to draw the vehicle
	this.draw = function(ctx) {

		//draw the wheels
		for(w=0; w<this.wheel.length; w++) {
			this.wheel[w].draw(ctx);
		}

	}; //this.draw()


	//define vehicle movement physics
	this.update = function(location) {

		//loop over all of the wheels
		for(w=0; w<this.wheel.length; w++) {
			
			//update the wheel forces (not movement/velocity/etc.)
			this.wheel[w].update();

			//add those forces to the main vehicle (force/moments)

		}

		//update the vehicle location/angle

		//update the wheel position/angle based on the vehicle location/angle
		this.location.x = this.wheel[0].location.x - this.wheel[0].offset.x;
		this.location.y = this.wheel[0].location.y - this.wheel[0].offset.y;

	};

	//define vehicle controls
	this.control = function(e) {

	    e = e || event; // to deal with IE

	    if(e.type == 'keydown') {
		    if(e.keyCode == 65) {
		        drive = -1;
		    }

		    if(e.keyCode == 68) {
		        drive = 1;
		    }	    	
	    } else {
	    	drive = 0;
	    }

	};



}; //end Car_Model


//define the Wheel model
var Wheel_Model = function(config) {

	//config.mass						mass of wheel
	//config.radius 					radius of wheel
	//config.location					vertex2D representing center location of wheel in global coordinates
	//config.drawLocation				location of wheel in relation to the default draw point on the screen
	//config.angle						angle of wheel body (theta)
	//config.grip 						grip modifier for this wheel
	//config.tireSize 					size of the tire
	//config.tireColor					color of the tire
	//config.wheelColor					color of the hub
	//config.driveWheel					is this a drive wheel
	//config.output						output of this wheel
	//config.friction					friction factor for this wheel
	//config.tireBounce					bounceiness of the tire = 1.0 perfect bounce (no energy loss), 0=no bounce


	//define wheel parameters
	this.mass = config.mass;
	this.radius = config.radius;
	this.location = config.location;
	this.drawLocation = config.drawLocation;
	this.angle = config.angle;
	this.grip = config.grip;
	this.tireSize = config.tireSize;
	this.tireColor = config.tireColor;
	this.wheelColor = config.wheelColor;
	this.txtColor = config.txtColor;
	this.axleColor = config.axleColor;
	this.axleSize = config.axleSize;
	this.driveWheel = config.driveWheel;
	this.output = config.output;
	this.contactAngle = 0;
	this.friction = config.friction;
	this.tireBounce = config.tireBounce;
	this.forces = {
		x : 0,
		y : 0
	};
	this.accel = {
		x : 0,
		y : 0
	};
	this.velocity = {
		x : 0,
		y : 0,
	};
	this.alpha = 0;

	//calculate wheel moment of inertia
	this.inertia = (2/3)*this.mass*this.radius*this.radius;

	//define method to draw the vehicle
	this.draw = function(ctx) {

		//rotate the canvas
		ctx.translate(this.drawLocation.x,this.drawLocation.y);
		ctx.rotate(this.angle);

		//draw tire
		ctx.beginPath();
		ctx.arc(0,0,this.radius-this.tireSize/2,0,2*Math.PI);
		ctx.strokeStyle = this.tireColor;
		ctx.lineWidth = this.tireSize;
		ctx.stroke();

		//draw wheel
		ctx.beginPath();
		ctx.arc(0,0,this.radius-this.tireSize,0,2*Math.PI);
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.fillStyle = this.wheelColor;
		ctx.fill();

		//draw axle
		ctx.beginPath();
		ctx.arc(0,0,this.axleSize,0,2*Math.PI);
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.fillStyle = this.axleColor;
		ctx.fill();
		
		//draw txt
		ctx.beginPath();
		ctx.lineWidth = this.tireSize/4;
		ctx.strokeStyle = this.txtColor;
		ctx.arc(0,0,this.radius-this.tireSize/2,0,Math.PI/6);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.tireColor;
		ctx.arc(0,0,this.radius-this.tireSize/2,Math.PI/6,Math.PI/5);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.txtColor;
		ctx.arc(0,0,this.radius-this.tireSize/2,Math.PI/5,Math.PI/2);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = this.tireSize/4;
		ctx.strokeStyle = this.txtColor;
		ctx.arc(0,0,this.radius-this.tireSize/2,Math.PI,7*Math.PI/6);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.tireColor;
		ctx.arc(0,0,this.radius-this.tireSize/2,7*Math.PI/6,6*Math.PI/5);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.txtColor;
		ctx.arc(0,0,this.radius-this.tireSize/2,6*Math.PI/5,3*Math.PI/2);
		ctx.stroke();

		//put the canvas back
		ctx.rotate(-1*this.angle);
		ctx.translate(-1*(this.drawLocation.x), -1*(this.drawLocation.y));


	}; //this.draw()


	//define vehicle movement physics
	this.update = function(location) {
		
		//TODO: only update forces - do movement updates in the main vehicle model
		//TODO: allow for applied forces - to allow transfer of forces from other parts of the vehicle
		//TODO: implment Fmax as a limit for the drive force (remaining force should just spin the wheel)


		var contactData = this.wheelContact(this, world.track);

		//apply gravity to this wheel
		this.forces.y = -1 * this.mass * world.config.gravity;
		this.forces.x = 0;

		//populate the global position of this wheel
		this.contactAngle = contactData.angle;

		//check if we are on the ground
		if(contactData.contact !== false) {

			//error correction if the wheel is 'inside' the track
			this.location.y = world.track[this.location.x]-this.radius;

			//we are on the ground remove the component of the force normal to the ground and modify the velocity
			
			//calculate friction force (air friction)
			var fforce_x = -1 * this.velocity.x * world.config.friction;
			var fforce_y = -1 * this.velocity.y * world.config.friction;

			this.forces.x += fforce_x;
			this.forces.y += fforce_y;

			//break y force and velocity into two components - one perpendicular and one parallel to the ground
			var yforce_normal = this.forces.y*Math.cos(this.contactAngle);
			var yforce_parallel = this.forces.y*Math.sin(this.contactAngle);
			var yveloc_normal = this.velocity.y*Math.cos(this.contactAngle);
			var yveloc_parallel = this.velocity.y*Math.sin(this.contactAngle);

			//break x force into two compoents - one perpendicular and one parallel to the ground
			var xforce_normal = this.forces.x*Math.sin(this.contactAngle);				
			var xforce_parallel = this.forces.x*Math.cos(this.contactAngle);
			var xveloc_normal = this.velocity.x*Math.sin(this.contactAngle);			
			var xveloc_parallel = this.velocity.x*Math.cos(this.contactAngle);			

			//calculate the parallel force from the motor torque
			var mforce_parallel = this.driveWheel * drive * this.output / this.radius;

			//calculate tforce_normal and Fmax
			var tforce_normal = xforce_normal + yforce_normal;
			var Fmax = -1*tforce_normal * this.grip * drive;
			
			//calculate the actual driving force and the residual driving force
			if(Fmax < 0) {
				var aforce_parallel = Math.max(Fmax, mforce_parallel);
				var residual_force = Math.min(0, mforce_parallel - Fmax);
			} else {
				var aforce_parallel = Math.min(Fmax, mforce_parallel);
				var residual_force = Math.max(0, mforce_parallel - Fmax);
			}

			//calculate total normal and parallel forces and velocities
			var tforce_normal = 0;															//ground absorbs normal force
			var tforce_parallel = xforce_parallel + yforce_parallel + aforce_parallel;		//add up all parallel forces
			var taccel_parallel = tforce_parallel / this.mass;
	
			var tveloc_normal = -1 * (yveloc_normal + xveloc_normal) * this.tireBounce;		//tire bounces of ground
			var tveloc_parallel = xveloc_parallel + yveloc_parallel + taccel_parallel;		//add up all parallel forces

			//break normal forces and velocities into x and y components
			var force_normal_y = tforce_normal * Math.cos(this.contactAngle);
			var force_normal_x = tforce_normal * Math.sin(this.contactAngle);
			var veloc_normal_y = tveloc_normal * Math.cos(this.contactAngle);
			var veloc_normal_x = tveloc_normal * Math.sin(this.contactAngle);

			//break parallel forces and velocities into x and y components
			var force_parallel_y = tforce_parallel * Math.sin(this.contactAngle);
			var force_parallel_x = tforce_parallel * Math.cos(this.contactAngle);
			var veloc_parallel_y = tveloc_parallel * Math.sin(this.contactAngle);
			var veloc_parallel_x = tveloc_parallel * Math.cos(this.contactAngle);

			//recombine x and y forces and velocities
			this.forces.x = force_normal_x + force_parallel_x;
			this.forces.y = force_normal_y + force_parallel_y;
			this.velocity.x = veloc_normal_x + veloc_parallel_x;		//without drive both normal and parallel are 0 - why!!?
			this.velocity.y = veloc_normal_y + veloc_parallel_y;

			//calculate wheel rotation
			this.alpha = (tveloc_parallel / this.radius) + ((residual_force * this.radius)/this.inertia);

			//rotate the wheel
			this.angle += this.alpha;

		} else {

			//rotate the wheel
			var moment = (this.output * drive * this.radius);
			var omega = moment / this.inertia;
			this.alpha += omega; 
			this.angle += this.alpha;

			//move the wheel
			this.accel.x = this.forces.x/this.mass;
			this.accel.y = this.forces.y/this.mass;
			this.velocity.x += this.accel.x;
			this.velocity.y += this.accel.y;

		}

		//console.log(Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y));

		this.location.x = Math.round(this.location.x + this.velocity.x);
		this.location.y = Math.round(this.location.y - this.velocity.y);

	};

	//define vehicle controls
	this.control = function(e) {

	    e = e || event; // to deal with IE

	    if(e.type == 'keydown') {
		    if(e.keyCode == 65) {
		        drive = -1;
		    }

		    if(e.keyCode == 68) {
		        drive = 1;
		    }	    	
	    } else {
	    	drive = 0;
	    }

	};

	//method to find the location at which the provided wheel touches the track
	this.wheelContact = function(obj, track) {

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
		var return_object = {
			contact : false,
			min_dist : 100000,
			min_dist_x : 0,
			max_dist : 0,
			max_dist_x : 0,
			angle : 0
		};

		//determine the max/min x values of the object
		var max_x = obj.location.x + obj.radius;
		var min_x = obj.location.x - obj.radius;

		//for each x value 
		for(var x=min_x;x<=max_x;x++) {

			//get the track y value
			y = track[x];

			//calculate distance from x,y to center of obj
			dist = Math.sqrt(((obj.location.x - x)*(obj.location.x - x)) + ((obj.location.y - y)*(obj.location.y - y)));
			return_object.min_dist = Math.min(dist,return_object.min_dist);
			return_object.min_dist_x = x;
			return_object.max_dist = Math.max(dist,return_object.max_dist);
			return_object.max_dist_x = x;


			//check if the distance from the track to the center of the circle is <= the radius
			if(dist <= obj.radius) {
			
				contact[contact.length] = x;

			}

		} //end loop over x values

		if(contact.length == 0) {
			
			return_object.contact = false;
			return return_object;

		} else {

			total = 0;

			//calculate average x value
			for(j=0; j<contact.length; j++) {
				total += contact[j];
			}

			ave_x = Math.floor(total / contact.length);
		}

		//calculate the contact angle
		delta_y = track[ave_x] - obj.location.y;
		if(delta_y == 0) {
			contact_angle = Math.PI/2;
		} else {
			delta_x = ave_x - obj.location.x;
			contact_angle = Math.atan(delta_x/delta_y)			
		}

		return_object.contact = true;
		return_object.angle = contact_angle;

		//return contact angle
		return return_object;

	}

}; //end Car_Model
