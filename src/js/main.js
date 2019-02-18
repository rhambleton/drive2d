
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
    gravity : 2,   //level of gravity in the world
    friction : 10,   //level of friction in the world (air friction, etc.);
    displayLocation : new Vertex2D(200,canvas.height/2), //location to display vehicle
    surfaceThickness : 10,

};
var world = new World(config);
world.newTrack();

//define the player vehicle
var config = {
    color : 'rgba(150,0,0,1)',
    mass : 100,
    length : 100,
    height : 50,
    drawLocation : new Vertex2D(250,canvas.height/2+50),
    location : new Vertex2D(300,canvas.height/2),    
    angle : 0,
    wheel : [
        //rear wheel
        {
                mass : 100,
                radius : 30,
                offset :  new Vertex2D(-50,-50),                             //offset from center of vehicle defined above
                drawLocation : new Vertex2D(0,0),             //location will be calculated by vehicle model
                location : new Vertex2D(0,0),                 //location will be calculated by vehicle model
                angle : 0,
                grip : 0.93,
                tireSize : 12,
                tireColor : 'rgba(30,30,30,1)',
                wheelColor : 'rgba(200,200,200,1)',
                txtColor : 'rgba(175,175,175,1)',
                axleColor : 'rgba(0,0,0,1)',
                axleSize : 3,
                driveWheel : 1,
                output : 10000,
                friction : 0.8,
                tireBounce : 0.1
        },
        // //front wheel
        // {
        //         mass : 100,
        //         radius : 30,
        //         offset :  new Vertex2D(50,-50),               //offset from center of vehicle defined above
        //         drawLocation : new Vertex2D(0,0),             //location will be calculated by vehicle model
        //         location : new Vertex2D(0,0),                 //location will be calculated by vehicle model
        //         angle : 0,
        //         grip : 1,
        //         tireSize : 10,
        //         tireColor : 'rgba(30,30,30,1)',
        //         wheelColor : 'rgba(200,200,200,1)',
        //         txtColor : 'rgba(175,175,175,1)',
        //         axleColor : 'rgba(0,0,0,1)',
        //         axleSize : 3,
        //         driveWheel : 1,
        //         output : 10000,
        //         friction : 0.8,
        //         tireBounce : 0.1
        // },
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

// //define the wheel object
// var config = {

//     mass : 100,
//     radius : 30,
//     drawLocation : new Vertex2D(250,canvas.height/2),             //location of wheel in relation to the default draw point on the screen
//     location : new Vertex2D(300,canvas.height/2),
//     angle : 0,
//     grip : 1,
//     tireSize : 10,
//     tireColor : 'rgba(30,30,30,1)',
//     wheelColor : 'rgba(200,200,200,1)',
//     txtColor : 'rgba(175,175,175,1)',
//     axleColor : 'rgba(0,0,0,1)',
//     axleSize : 3,
//     driveWheel : 1,
//     output : 10000,
//     friction : 0.8,
//     tireBounce : 0.1

// }
// world.newWheel(config);

var drive = 0;

//define the main animiation loop
function drawAndUpdate(currentT) {

    //clear the previous frame
    context.clearRect(0,0,canvas.width,canvas.height);

    //update the vehicle
    world.vehicle.update();

    //update the screen location
    world.updateScreen(world.vehicle);

    //draw the track
    world.drawTrack(context,world.screenLocation);

    //draw the vehicle
    world.vehicle.draw(context,world.screenLocation);

    console.log(world.track[world.vehicle.location.x] + " : " + world.vehicle.location.y);

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
        
    world.vehicle.control(e);

}; // end key press listener


drawAndUpdate();



