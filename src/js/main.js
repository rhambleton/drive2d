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
    gravity : 0.1,   //level of gravity in the world
    friction : 1,   //level of friction in the world (air friction, etc.);
    displayLocation : new Vertex2D(200,canvas.height/2-67) //location to display vehicle
};
var world = new World(config);

world.newTrack();

// //define the player vehicle
// var config = {
//     color : 'rgba(150,0,0,1)',
//     mass : 100,
//     length : 100,
//     height : 50,
//     location : new Vertex2D(200,canvas.height/2-67),
//     angle : 0,
//     wheel : [
//         //rear wheel
//         {
//             location : new Vertex2D(-55,34),
//             grip : 1,
//             radius : 27,
//             spring : 0.5,
//             damper : 1,
//             tireSize : 12,
//             tireColor : 'rgba(30,30,30,1)',
//             wheelColor : 'rgba(200,200,200)'
//         },
//         //front wheel
//         {
//             location : new Vertex2D(55,34),
//             grip : 1,
//             radius : 27,
//             spring : 0.5,
//             damper : 1,
//             tireSize : 12,
//             tireColor : 'rgba(30,30,30,1)',
//             wheelColor : 'rgba(200,200,200)'
//         }
//     ],
//     drivetrain : {
//         efficiency : 1,
//         drivewheels : [0,1],
//     },
//     engine : {
//         output : 100
//     }

// };
// world.newVehicle(config);

//define the wheel object
var config = {

    mass : 1,
    radius : 30,
    drawLocation : new Vertex(0,0),             //location of wheel in relation to the default draw point on the screen
    location : new Vertex2D(190,canvas.height/2-100),
    angle : 0,
    grip : 1,
    tireSize : 10,
    tireColor : 'rgba(30,30,30,1)',
    wheelColor : 'rgba(200,200,200,1)',
    txtColor : 'rgba(175,175,175,1)',
    driveWheel : true,
    output : 100,
    friction : 1,
    tireBounce : 0.68

}
world.newWheel(config);

var drive = 0;

//define the main animiation loop
function drawAndUpdate(currentT) {

    //clear the previous frame
    context.clearRect(0,0,canvas.width,canvas.height);

    //draw the track
    world.drawTrack(context,world.vehicle.location);

    //update the vehicle
    world.vehicle.update();
    
    //draw the vehicle
    world.vehicle.draw(context,world.vehicle.location);

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



