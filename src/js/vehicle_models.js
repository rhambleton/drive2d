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
	//config.wheel						object defining wheel characteristics
		//config.wheel[n].location			vertex2D representing offset from center location of vehicle to center of the wheel
		//config.wheel[n].grip 		x		grip modifier for this wheel
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

		//loop over the wheels applying the forces, and carrying them forward
		for(var i=0; i<this.wheel.length; i++) {
			
			//populate the global position of this wheel
			this.wheel[i].glbLocation = {};
			this.wheel[i].glbLocation.x = this.location.x + this.wheel[i].location.x;
			this.wheel[i].glbLocation.y = this.location.y + this.wheel[i].location.y;
			this.wheel[i].contactAngle = this.wheelContact(i,world.track);

			//apply all forces to this wheel and sum them
				//gravity in negative y direction
				//if drive wheel - drive force in positive alpha direction
				//carry over force from previous wheel

			//resolve forces into 2 components (Yalpha and Xalpha)
				//if Yalpha<0 make it 0 (apply normal force)

			//if this is not the last wheel
				//populate the global position of the next wheel
				//calculate the angle from this wheel to the next wheel

				//resolve remaining force into 2 components (Ytheta and Xtheta)
					//apply Xtheta to the next wheel
					//apply Ytheta to the CG and add a clockwise torque (|Ytheta|*(Xcg-X))

			//if this is the last wheel
				//apply Xtheta to the CG and add a clockwise torque (|Xtheta|*(Ycg-Y))
				//apply Ytheta to the CG and add a clcokwise torque (|Ytheta|*(Xcg-X))



		}

		//now have alpha, beta and theta (TODO - support more than 2 wheel)
		var alpha = this.wheel[0].contactAngle;
		var beta = this.wheel[0].contactAngle;
		var theta = this.angle;

		


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

		//calculate the contact angle
		delta_y = track[ave_x] - obj.glbLocation.y;
		delta_x = ave_x - obj.glbLocation.x;
		contact_angle = Math.atan(delta_x/delta_y)

		//return contact angle
		return contact_angle;

	}

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
	this.txtColor = config.txtColor
	this.driveWheel = config.driveWheel;
	this.output = config.output;
	this.contactAngle = 0;
	this.friction = config.friction;
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
	this.draw = function(ctx,location) {


		//rotate the canvas
		ctx.translate(world.displayLocation.x,world.displayLocation.y);
		ctx.rotate(this.angle);


		//draw tire
		ctx.beginPath();
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,0,2*Math.PI);
		ctx.strokeStyle = this.tireColor;
		ctx.lineWidth = this.tireSize;
		ctx.stroke();

		//draw wheel
		ctx.beginPath();
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-(3*this.tireSize/2),0,2*Math.PI);
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.fillStyle = this.wheelColor;
		ctx.fill();
		
		//draw txt
		ctx.beginPath();
		ctx.lineWidth = this.tireSize/4;
		ctx.strokeStyle = this.txtColor;
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,0,Math.PI/6);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.tireColor;
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,Math.PI/6,Math.PI/5);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.txtColor;
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,Math.PI/5,Math.PI/2);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = this.tireSize/4;
		ctx.strokeStyle = this.txtColor;
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,Math.PI,7*Math.PI/6);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.tireColor;
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,7*Math.PI/6,6*Math.PI/5);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = this.txtColor;
		ctx.arc(this.drawLocation.x,this.drawLocation.y,this.radius-this.tireSize,6*Math.PI/5,3*Math.PI/2);
		ctx.stroke();

		//put the canvas back
		ctx.rotate(-1*this.angle);
		ctx.translate(-1*(world.displayLocation.x), -1*(world.displayLocation.y));


	}; //this.draw()


	//define vehicle movement physics
	this.update = function(location) {
		
		//apply gravity to this wheel
		this.forces.y = -1 * this.mass * world.config.gravity;
		this.forces.x = 0;

		//populate the global position of this wheel
		this.contactAngle = this.wheelContact(this, world.track);

		//if the wheel is touching something
		if(this.contactAngle !== false) {

			//apply the drive force to this wheel
			console.log("x0: "+this.forces.x);
			this.forces.y += (this.output) * Math.sin(this.contactAngle) * drive;
			this.forces.x += (this.output) * Math.cos(this.contactAngle) * drive;

			//apply the friction force to this wheel
			console.log("x1: "+this.forces.x);
			this.forces.y -= (this.velocity.y) * world.config.friction*this.friction;
			this.forces.x -= (this.velocity.x) * world.config.friction*this.friction;
			console.log("x2: "+this.forces.x);

			//any other forces would need to be added in here, before the normal force is calculated and applied

			//calculate the normal force component perpendicular to the track
			var normal = -1 * (this.forces.y*Math.cos(this.contactAngle) + this.forces.x*Math.cos(this.contactAngle + Math.PI/2));
			var normaly = normal * Math.cos(this.contactAngle);
			var normalx = normal * Math.cos(this.contactAngle + Math.PI/2);
			this.forces.y += normaly;
			this.forces.x += normalx;
			console.log("x3: "+this.forces.x);

			//calculate the angle of the velocity relative to the track
			normal = -1 * (this.velocity.y*Math.cos(this.contactAngle) + this.velocity.x*Math.cos(this.contactAngle + Math.PI/2));
			normaly = normal * Math.cos(this.contactAngle);
			normalx = normal * Math.cos(this.contactAngle + Math.PI/2);
			this.velocity.y += normaly;
			this.velocity.x -= normalx;

		}

		//calculate acceleration of the center of the wheel
		this.accel.x = this.forces.x / this.mass;
		this.accel.y = this.forces.y / this.mass;

		//calculate velocity of the center of the wheel
		this.velocity.x += this.accel.x;
		this.velocity.y += this.accel.y;
		this.velocity.x = Math.round(this.velocity.x, 0.001);
		this.velocity.y = Math.round(this.velocity.y, 0.001);

		//update the location of the wheel
		this.location.x += this.velocity.x;
		this.location.y -= this.velocity.y;					//negative because canvas y-axis is inverted

		this.location.x = Math.round(this.location.x);
		this.location.y = Math.round(this.location.y);


		//rotate the wheel
		var moment = this.output * drive * this.radius;
		var omega = moment / this.inertia;
		this.alpha += omega; 
		this.angle += this.alpha;


		//console.log(JSON.stringify(this.forces));
		
			//gravity in negative y direction
			//if drive wheel - drive force in positive alpha direction
			//carry over force from previous wheel

		//resolve forces into 2 components (Yalpha and Xalpha)
			//if Yalpha<0 make it 0 (apply normal force)

		//if this is not the last wheel
			//populate the global position of the next wheel
			//calculate the angle from this wheel to the next wheel

			//resolve remaining force into 2 components (Ytheta and Xtheta)
				//apply Xtheta to the next wheel
				//apply Ytheta to the CG and add a clockwise torque (|Ytheta|*(Xcg-X))

		//if this is the last wheel
			//apply Xtheta to the CG and add a clockwise torque (|Xtheta|*(Ycg-Y))
			//apply Ytheta to the CG and add a clcokwise torque (|Ytheta|*(Xcg-X))



		


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

		//determine the max/min x values of the object
		var max_x = obj.location.x + obj.radius;
		var min_x = obj.location.x - obj.radius;

		//for each x value 
		for(var x=min_x;x<=max_x;x++) {

			//get the track y value
			y = track[x];

			//calculate distance from x,y to center of obj
			dist = Math.sqrt(((obj.location.x - x)*(obj.location.x - x)) + ((obj.location.y - y)*(obj.location.y - y)));

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

		//calculate the contact angle
		delta_y = track[ave_x] - obj.location.y;
		if(delta_y == 0) {
			contact_angle = Math.PI/2;
		} else {
			delta_x = ave_x - obj.location.x;
			contact_angle = Math.atan(delta_x/delta_y)			
		}


		//return contact angle
		return contact_angle;

	}

}; //end Car_Model
