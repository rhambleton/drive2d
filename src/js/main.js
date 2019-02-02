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
    friction : 0.2   //level of friction in the world (air friction, etc.);
};
var world = new World(config);

world.newTrack();

var speedx = 0;
var speedy = 0;

//define the main animiation loop
function drawAndUpdate(location,currentT) {

    //clear the previous frame
    context.clearRect(0,0,canvas.width,canvas.height);

    //render the track
    render(world,location,context);

    if(location.x < world.track.length - 1) {
        location.x=location.x+speedx;
    }
    location.y = location.y+speedy;

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

//setup our viewPort
var config = {

    location: new Vertex(0,-70,0),
    width: canvas.width,
    height: canvas.height,
    pitch: 0,
    yaw: 0, //Math.PI/2,
    roll: 0,
    gravity: 1,
    max_distance : 0

};

//create our viewPort
var viewPort = new viewPort (config);


drawAndUpdate(new Vertex2D(0,0));



