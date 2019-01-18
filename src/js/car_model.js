//Basic Car Model
//---------------
//3d directions based on https://www.youtube.com/watch?v=PptiB5H2Qhg

//generates a car object
//adds the faces of the car object to the world.faces array
//adds the car hitbox(s) to the world.hitboxes array and links them to triggers
//adds appropriate triggers to the world.triggers array and links them to the correct faces
	//example uses - push the car if hit by another car; damage the car if hit by another car


var car = function(config, world) {

	//empty object to hold faceID's for each face
	this.faces = {
		frontID : 0,
		backID : 0,
		leftID : 0,
		rightID : 0,
		topID : 0,
		bottomID : 0
	};

	//position - located at the center of the car
	this.p = {
		x = config.p.x,
		y = config.p.y,
		z = config.p.z
	};

	//velocity
	this.v = {
		x : config.v.x,
		y : config.v.y,
		z : config.v.z
	};

	//acceleration
	this.a = {
		x : config.a.x,
		y : config.a.y,
		z : config.a.z
	};

	//direction
	this.d = {
		phi : 		config.d.phi,
		theta_z : 	config.d.theta_z,
	};

	//angular velocity
	this.w = {
		phi : config.w.phi,
		theta_z : config.w.theta_z,
	};

	//angular acceleration
	this.o = {
		phi : config.o.phi,
		theta_z : config.o.theta_z,
	};

	this.length = config.length;
	this.width = config.width;
	this.height = config.height;

	//array of all wheels
	this.wheels = [
		{
			width : 	config.wheels[0].width,
			diameter : 	config.wheels[0].diameter,
			grip :		config.wheels[0].grip,
			angle : 	{ 							
				phi : config.wheels[0].angle.phi,
				theta_z : config.wheels[0].angle.theta_z,
			},		
			location :  {							//center of car is (0,0,0)
				x : config.wheels[0].location.x		
				y : config.wheels[0].location.y
				z : config.wheels[0].location.z
			},
			force :	config.wheels[0].force,			//magnitude of force - direction is given by wheels[0].angle
			health : config.wheels[0].health		//grip modifier
		},{},{},...
	];

	this.steering_wheels = config.steering_wheels;		//array of indexes from wheels[] that lists all wheels that steer

	this.engine = {
		status :		config.engine.status,		
		output :		config.engine.output,
		drive_wheels :	config.engine.drive_wheels,	//array of indexes from wheels[] that lists all wheels that are driven by the engine
		health	:   	config.engine.health		//power modifier
	};

	this.drivetrain = {
		efficiency :    config.drivetrain.efficiency,	//engine output modifier
		health : 		config.drivetrain.health		//efficiency modifier
	}

	this.update = function() {

		//calculate the actual engine output going to the drive wheels
		var engine_output = this.engine.output * this.engine.health * this.drivetrain.efficiency * this.drivetrain.health;

		//assume each wheel provides the same power output (is this realistic?)
		var wheel_output = engine_output / this.engine.drive_wheels.length;

		//calculate the total force and moment on the vehicle (in world coordinates)
		var total_force = {
			x : 0, y : 0, z : 0
		};

		var total_moments = {
			phi : 0,
			theta_z : 0
		}
		for(i=0; i<this.engine.drive_wheels.length;i++) {

			//TODO: should only do this if the wheel is on the ground!

			//calculate the x,y,z components of the force (in world coordinates)
			var wheel_force = new Vertex(0,0,0);
			wheel_force.x = wheel_output * Math.sin(this.wheels[this.engine_drive_wheels[i]].theta_z) * Math.sin(this.wheels[this.engine.drive_wheels[i]].phi);
			wheel_force.y = wheel_output * Math.cos(this.wheels[this.engine.drive_wheels[i]].angle.theta_z);
			wheel_force.z = wheel_output * Math.sin(this.wheels[this.engine.drive_wheels[i]].theta_z) * Math.cos(this.wheels[this.engine.drive_wheels[i]].phi);

			//add to total force
			total_force.x += wheel_force.x;
			total_force.y += wheel_force.y;
			total_force.z += wheel_force.z;

			//calculate the moments associated with these forces and add them to the total moments

			//add to the total moments

		}

		//apply total force to update x,y,z components of acceleration
		//apply acceleration to update each velocity component
		//apply velocity to update x,y,z position of the car

		//apply moments to update angular acceleration components (change in phi and theta_z)
		//apply angular acceleration to update angular velocity
		//apply angular velocity to update vehicle direction (phi and theta_z)

		//based on new location and angles, update the vertices of each face

	}

	//add each phase into the world.faces array and record the faceID in this.faces = {}
	//update the appropriate faceID

	//create a single hitbox for the car
	//this.hitbox = new Collision_Box(config);


}
