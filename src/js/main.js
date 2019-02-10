//TODO - gravity / jetpack / look up down / jump crouch
//TODO - camera sway when walking
//TODO - level editing/loading/saving
//TODO - mouse look
//TODO - switch to full-perspective once implemented

//initialize the main canvas variables
var canvas = document.getElementById("viewPort");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var context = canvas.getContext('2d');

//initialize the animation function (browser specific)
var lastCalledTime=performance.now();
var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

//initialize the world object
var config = {
    gravity : 40,   //level of gravity in the world
    friction : 0.2,   //level of friction in the world (air friction, etc.);
    displayLocation : new Vertex2D(200,canvas.height/2-67) //location to display vehicle
};
var world = new World(config);

world.newTrack();

//define the player vehicle
var config = {
    color : 'rgba(150,0,0,1)',
    mass : 100,
    length : 100,
    height : 50,
    location : new Vertex2D(200,canvas.height/2-67),
    angle : 0,
    wheel : [
        //rear wheel
        {
            location : new Vertex2D(-55,34),
            grip : 1,
            radius : 27,
            spring : 0.5,
            damper : 1,
            tireSize : 12,
            tireColor : 'rgba(30,30,30,1)',
            wheelColor : 'rgba(200,200,200)'
        },
        //front wheel
        {
            location : new Vertex2D(55,34),
            grip : 1,
            radius : 27,
            spring : 0.5,
            damper : 1,
            tireSize : 12,
            tireColor : 'rgba(30,30,30,1)',
            wheelColor : 'rgba(200,200,200)'
        }
    ],
    drivetrain : {
        efficiency : 1,
        drivewheels : [0,1],
    },
    engine : {
        output : 100
    }

};
world.newVehicle(config);

var speedx = 0;
var speedy = 0;

//define the main animiation loop
function drawAndUpdate(currentT) {

    //clear the previous frame
    context.clearRect(0,0,canvas.width,canvas.height);

    //draw the track
    world.drawTrack(context,world.vehicle.location);

    //update the vehicle
    world.vehicle.update();
    
    //draw the vehicle
    world.vehicle.draw(context,location);

    if(world.vehicle.location.x < world.track.length - 1) {
        world.vehicle.location.x+=speedx;
    }
    world.vehicle.location.y += speedy;
    
    if(world.vehicle.location.x < 0) {
        world.vehicle.location.x = 0;
        speedx = 0;
    }

    // restart the loop
    //setTimeout(drawAndUpdate,100);
    requestAnimationFrame(function() {
            
        // //this code writes the frame rate to the console    
        // if(!lastCalledTime) {
        //     lastCalledTime = performance.now();
        //     fps = 0;
        //     return;
        // }
        // delta = (performance.now() - lastCalledTime)/1000;
        // lastCalledTime = performance.now();
        // fps = 1/delta;
        // console.clear();
        // console.log("FPS: "+fps);
        
        drawAndUpdate(location);
    
    });

} // end of main animation loop

//add event listeners
   
//keyboard listener - detects keypress and passes it to the player model
window.onkeydown = window.onkeyup = function (e) {
        
    e = e || event; // to deal with IE

    if(e.keyCode == 65) {
        speedx--;
    }

    if(e.keyCode == 68) {
        speedx++;
    }

    if(e.keyCode == 87) {
        speedy--;
    }

    if(e.keyCode == 83) {
        speedy++;
    }


}; // end key press listener


drawAndUpdate();



