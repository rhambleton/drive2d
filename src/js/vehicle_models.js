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

		//draw the wheels
		for(i=0;i<this.wheel.length;i++) {

			//console.log(JSON.stringify(location));

			//draw tires
			ctx.beginPath();
			ctx.arc(this.location.x+this.wheel[i].location.x,this.location.y+this.wheel[i].location.y,this.wheel[i].radius-this.wheel[i].tireSize/2,0,2*Math.PI);
			ctx.strokeStyle = this.wheel[i].tireColor;
			ctx.lineWidth = this.wheel[i].tireSize;
			ctx.stroke();

			//draw wheels
			ctx.beginPath();
			ctx.arc(this.location.x+this.wheel[i].location.x,this.location.y+this.wheel[i].location.y,this.wheel[i].radius-this.wheel[i].tireSize,0,2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = 'rgba(100,100,100)';
			ctx.fill();

		};

		//draw the body work
		ctx.beginPath();
		ctx.moveTo(this.location.x+this.wheel[1].location.x+this.wheel[1].radius+3,this.location.y+30);
		ctx.lineTo(this.location.x+this.wheel[1].location.x+this.wheel[1].radius+15,this.location.y+30);
		ctx.arcTo (this.location.x+this.wheel[1].location.x+this.wheel[1].radius+25,this.location.y+30,this.location.x+this.wheel[1].location.x+this.wheel[1].radius+25,this.location.y+30-10,10);
		ctx.lineTo(this.location.x+this.wheel[1].location.x+this.wheel[1].radius+25,this.location.y+30-30)
		ctx.arcTo (this.location.x+this.wheel[1].location.x+this.wheel[1].radius+25,this.location.y+30-40,this.location.x+this.wheel[1].location.x+this.wheel[1].radius+15,this.location.y+30-40,10);
		ctx.lineTo(this.location.x+this.wheel[1].location.x,this.location.y+30-40);
		ctx.arcTo (this.location.x+this.wheel[1].location.x-5,this.location.y+30-40,this.location.x+this.wheel[1].location.x-10,this.location.y+30-45,10);
		ctx.lineTo(this.location.x+this.wheel[1].location.x-40,this.location.y+30-75);
		ctx.arcTo (this.location.x+this.wheel[1].location.x-45,this.location.y+30-80,this.location.x+this.wheel[1].location.x-50,this.location.y+30-80,10);
		ctx.lineTo(this.location.x+this.wheel[0].location.x-3,this.location.y+30-80)
		ctx.arcTo (this.location.x+this.wheel[0].location.x-43,this.location.y+30-80,this.location.x+this.wheel[0].location.x-43,this.location.y+30-50,30)
		ctx.lineTo(this.location.x+this.wheel[0].location.x-43,this.location.y+30-10)
		ctx.arcTo (this.location.x+this.wheel[0].location.x-43,this.location.y+30,this.location.x+this.wheel[0].location.x-33,this.location.y+30,10)
		ctx.arcTo (this.location.x+this.wheel[0].location.x-30,this.location.y+30,this.location.x+this.wheel[0].location.x-30,this.location.y+30-3,3)
		ctx.arcTo (this.location.x+this.wheel[0].location.x-30,this.location.y+30-3-this.wheel[0].radius, this.location.x+this.wheel[0].location.x,this.location.y+30-3-this.wheel[0].radius,30)
		ctx.arcTo (this.location.x+this.wheel[0].location.x+this.wheel[0].radius+3,this.location.y+30-3-this.wheel[0].radius,this.location.x+this.wheel[0].location.x+this.wheel[0].radius+3,this.location.y+30-3,30)
		ctx.lineTo(this.location.x+this.wheel[1].location.x-this.wheel[1].radius-6,this.location.y+30);
		ctx.arcTo (this.location.x+this.wheel[1].location.x-this.wheel[1].radius-3,this.location.y+30, this.location.x+this.wheel[1].location.x-this.wheel[1].radius-3,this.location.y+30-3,3);
		ctx.arcTo (this.location.x+this.wheel[1].location.x-this.wheel[1].radius-3,this.location.y+30-3-this.wheel[1].radius,this.location.x+this.wheel[1].location.x,this.location.y+30-3-this.wheel[1].radius,this.wheel[1].radius+3);
		ctx.arcTo (this.location.x+this.wheel[1].location.x+this.wheel[1].radius+3,this.location.y+30-3-this.wheel[1].radius,this.location.x+this.wheel[1].location.x+this.wheel[1].radius+3,this.location.y+30-3,this.wheel[1].radius+3);
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();

		//draw the windows
		ctx.beginPath();
		ctx.moveTo(this.location.x+this.wheel[1].location.x-45,this.location.y-10);
		ctx.lineTo(this.location.x+this.wheel[1].location.x-45,this.location.y-40);
		ctx.lineTo(this.location.x+this.wheel[1].location.x-15,this.location.y-10);
		ctx.lineTo(this.location.x+this.wheel[1].location.x-45,this.location.y-10);
		ctx.stroke();
		ctx.fillStyle = 'rgba(145,185,250,1)';
		ctx.fill();
		
	}; //this.draw()


	//define vehicle movement physics
	this.physics = function() {

	};

	//define vehicle controls
	this.control = function(e) {

	};


}; //end Car_Model
