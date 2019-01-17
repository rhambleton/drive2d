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

//define the projection type
var projectionType = 'weak-perspective';
//var projectionType = 'better-perspective';  //should be better, but isn't
//var projectionType = 'orthographic';      //functional, but not real helpful
//var projectionType = 'full-perspective';   //not functional yet

//specify whether or not to display the crosshair
var crosshair = {
    on : 1,                             // 1=on, 0=off
    size : 16,                          // size of crosshair
    color : 'rgba(255,255,255,0.2)'     // color of crosshair
}

//define the maximum drawing distance - EXPERIMENTAL - currently can cause crashes when almost all faces are clipped
var drawLimit = 0;  //0 disables this feature, positive integers set the drawing distance

//set the offset between the viewport window and the 3d world origin
var dx = canvas.width / 2;
var dy = canvas.height / 2;

//initialize an empty keymap for tracking keyboard input
var keymap = new Object();

//initialize the animation function (browser specific)
var lastCalledTime=performance.now();
var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

//define reusable variables
var ctr; //used to store the center of an object
var wdth; //used to store the width of the an object (x-axis)
var hgth; //used to store the height of an object (y-axis)
var dpth; //used to store the depth of an object (z-axis)
var active_hitboxes //used to store number of objects we are touching (to enable movement)

//initialize the world object
var config = {
    gravity : 40,   //level of gravity in the world
    friction : 0.2   //level of friction in the world (air friction, etc.);
};
var world = new World(config);


//define the main animiation loop
function drawAndUpdate(zmap,currentT) {

    //console.log(viewPort.location.y);

    //clear the previous frame
    context.clearRect(0,0,canvas.width,canvas.height);

    //initialize array of all hitboxes that collide with the player
    var all_hitboxes = [];

    //rotate the viewport

        //TODO - apply moment, angular acceleration, angular velocity to do this.
        // acceleration = moment / mass;   //this should probably be some sort of moment of inertia
        // velocity = velocity + accleration
        // angle = angle + velocity
        //
        // do the above for all 3 components (yaw, pitch and roll)
        // need to watch the signs!

    //update the player direction
    viewPort.yaw += viewPort.turn.x;
    viewPort.pitch += viewPort.turn.y;
    viewPort.roll += viewPort.turn.z;

    //backup old values - force, acceleration, velocity, location
    var old = {
        force: {
            x : viewPort.force.x,
            y : viewPort.force.y,
            z : viewPort.force.z
        },
        acceleration: {
            x : viewPort.acceleration.x,
            y : viewPort.acceleration.y,
            z : viewPort.acceleration.z
        },
        velocity: {
            x : viewPort.velocity.x,
            y : viewPort.velocity.y,
            z : viewPort.velocity.z
        },
        location: {
            x : viewPort.location.x,
            y : viewPort.location.y,
            z : viewPort.location.z
        }
    };

    //update worldVelocity components

        //player.force should ve in player coordinates
        //viewPort.force should be in world coordinates
        //viewPort.acceleration should be world coordinates
        //viewPort.velocity should be in world coordinates

    //convert force to world coordinates
    var worldForce = changeToWorldBasis(player.force, viewPort);

    viewPort.force.x = worldForce.x - world.config.friction*viewPort.velocity.x;
    viewPort.acceleration.x = viewPort.force.x / viewPort.mass;
    viewPort.velocity.x += viewPort.acceleration.x;      
    if(viewPort.velocity.x < 0) {
        viewPort.velocity.x = Math.max(-375, viewPort.velocity.x);
    } else {
        viewPort.velocity.x = Math.min(375, viewPort.velocity.x);
    }


    viewPort.force.y = worldForce.y - world.config.gravity - world.config.friction*viewPort.velocity.y; 
    viewPort.acceleration.y = viewPort.force.y / viewPort.mass;
    viewPort.velocity.y += viewPort.acceleration.y;        
    if(viewPort.velocity.y < 0) {
        viewPort.velocity.y = Math.max(-375, viewPort.velocity.y);
    } else {
        viewPort.velocity.y = Math.min(375, viewPort.velocity.y);
    }

    
    viewPort.force.z = worldForce.z - world.config.friction*viewPort.velocity.z;
    viewPort.acceleration.z = viewPort.force.z / viewPort.mass;
    viewPort.velocity.z += viewPort.acceleration.z;
    if(viewPort.velocity.z < 0) {
        viewPort.velocity.z = Math.max(-375, viewPort.velocity.z);
    } else {
        viewPort.velocity.z = Math.min(375, viewPort.velocity.z);
    }


    //convert velocity to world coordinates
    //var worldVelocity = changeToWorldBasis(viewPort.velocity, viewPort);
    var worldVelocity = viewPort.velocity;

    //apply x direction motion
    viewPort.location.x += worldVelocity.x;

    //check for collisions
    player.hitbox = new collision_box({
        ctr : viewPort.location,
        width : player.width,
        height : player.height,
        depth : player.depth,
        state : 1,
        triggerID : "",
        triggerCode : ""
    });
    var collision = check_collision(player.hitbox, world.hitboxes);

    //loop over all the faces we hit and see if we have hit any active hitboxes
    var collision_counter = 0;
    for(h=0; h<collision.hitboxes.length; h++) {

        //copy this hitbox into the 'all_hitboxes' array
        all_hitboxes.splice(all_hitboxes.length,0,collision.hitboxes[h]);

        //check if this hitbox is active
        if(collision.hitboxes[h].state == 1) {
            collision_counter++;
        } //end check if this hitbox is active

    } //end loop over faces we hit

    //check if we found any active collisions
    if(collision_counter != 0) {

        //we have hit an active hitbox - we cannot move this way (could modify this to create bouncy walls)
        viewPort.force.x = 0;
        viewPort.acceleration.x = 0;
        viewPort.velocity.x = 0;
        viewPort.location.x = old.location.x;

    } //end check if we found any active collisions


    //apply y direction motion
    if(player.jetpack == 0) {
        viewPort.location.y += viewPort.velocity.y;    
    } else if (player.force.y > 0) {
        viewPort.location.y += 10;
    } else if (player.force.y < 0) {
        viewPort.location.y -= 10;
    }
    
    //check for collisions
    player.hitbox = new collision_box({
        ctr : viewPort.location,
        width : player.width,
        height : player.height,
        depth : player.depth,
        state : 1,
        triggerID : "",
        triggerCode : ""
    });
    var collision = check_collision(player.hitbox, world.hitboxes);

     //loop over all the faces we hit and see if we have hit any active hitboxes
    var collision_counter = 0;
    for(h=0; h<collision.hitboxes.length; h++) {

        //copy this hitbox into the 'all_hitboxes' array
        all_hitboxes.splice(all_hitboxes.length,0,collision.hitboxes[h]);

        //check if this hitbox is active
        if(collision.hitboxes[h].state == 1) {
            collision_counter++;
        } //end check if this hitbox is active

    } //end loop over faces we hit

    //check if we found any active collisions
    if(collision_counter != 0) {

        //we have hit an active hitbox - we cannot move this way (could modify this to create a bouncy floor...)
        viewPort.force.y = 0;
        viewPort.acceleration.y = 0;
        viewPort.velocity.y = 0;        
        viewPort.location.y = old.location.y;

    } //end check if we found any active collisions


    
    //apply z-direction motion
    viewPort.location.z += worldVelocity.z;

    //update the player hitbox
    player.hitbox = new collision_box({
        ctr : viewPort.location,
        width : player.width,
        height : player.height,
        depth : player.depth,
        state : 1,
        triggerID : "",
        triggerCode : ""
    });

    //check for collisions
    var collision = check_collision(player.hitbox, world.hitboxes);

    //loop over all the facess we hit and see if we have hit any active hitboxes
    var collision_counter = 0;
    for(h=0; h<collision.hitboxes.length; h++) {

        //copy this hitbox into the 'all_hitboxes' array
        all_hitboxes.splice(all_hitboxes.length,0,collision.hitboxes[h]);

        //check if this hitbox is active
        if(collision.hitboxes[h].state == 1) {
            collision_counter++;
        } //end check if this hitbox is active

    } //end loop over objects we hit

    //check if we found any active collisions
    if(collision_counter != 0) {

        //we have hit an active hitbox - we cannot move this way (could modify this to create bouncy walls)
        viewPort.force.z = 0;
        viewPort.acceleration.z = 0;
        viewPort.velocity.z = 0;
        viewPort.location.z = old.location.z;

    } //end check if we found any active collisions

    //update the player hitbox with the final location and finalize the collision list
    player.hitbox = new collision_box({

        ctr : viewPort.location,
        width : player.width,
        height : player.height,
        depth : player.depth,
        state : 1,
        triggerID : "",
        triggerCode : ""

    });

    //check if we are falling - if so, refresh the page to start again
    if (viewPort.location.y < -10000) {
        location.reload();
    }
    
    //used to see if we can move
    active_hitboxes = 0;

    //loop over all the hitboxes we have collided with - check for triggers
    for(c=0; c<all_hitboxes.length; c++) {

        // check that this hitbox is not inactive
        if(all_hitboxes[c].state != 0) {

            //count how many hit boxes are active
            active_hitboxes++;

            var this_triggerID = all_hitboxes[c].triggerID;

            if(this_triggerID !== "") {

                //activate this trigger
                world.triggers[this_triggerID].activate(all_hitboxes[c].triggerCode);
            }            
        }  // end check that hitbox is not inactive

    }

    //update all interactive elements (triggers)
    for(t=0; t<world.triggers.length; t++) {
        world.triggers[t].update(world);
    }

    //render the world
    render(viewPort, world.faces, context, zmap, dx, dy);
    if(crosshair.on == 1) {
        draw_crosshair(context,crosshair.size,crosshair.color);    
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
        
        drawAndUpdate();
    
    });

} // end of main animation loop

//add event listeners
   
   //keyboard listener - key press
   window.onkeydown = window.onkeyup = function (e) {
            
        e = e || event; // to deal with IE
        keymap[e.keyCode] = e.type == 'keydown';

        //if we are touching something
        if(active_hitboxes > 0 || player.jetpack == 1) {

            if (keymap[65] == true) {
                //A
                player.force.x = -1*player.strength.x;
            }
            if (keymap[68] == true) {
                //D
                player.force.x = player.strength.x;
            }
            if (keymap[87] == true) {
                //W
                player.force.z = player.strength.z;
            }
            if (keymap[83] == true) {
                //S
                player.force.z = -1*player.strength.z;
            }
            if (keymap[38] == true) {
                //UP
                player.force.y = player.strength.y;                    
            }
            if (keymap[40] == true) {   
                player.force.y = -1*player.strength.y;
            }

        }

        if (keymap[37] == true) {
            viewPort.turn.x = -1 * Math.PI / 120;
        }
        if (keymap[39] == true) {
            viewPort.turn.x = Math.PI / 120;
        }

        if (keymap[74] == true) {
            //J
            if(player.jetpack == 0) {
                player.jetpack = 1;
            } else { player.jetpack = 0; }
            console.log("jetpack: "+player.jetpack);
        }


        if (e.type == "keyup") {
            if(e.keyCode == 65 || e.keyCode == 68) {
                player.force.x = 0;
            }
            if(e.keyCode == 87 || e.keyCode == 83) {
                player.force.z = 0;
            }
            if(e.keyCode == 38 || e.keyCode == 40) {
                player.force.y = 0;
            }
            if(e.keyCode == 37 || e.keyCode == 39) {
                viewPort.turn.x = 0;
            }
        } // end check for key release

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
    max_distance : drawLimit

};

//create our viewPort
var viewPort = new viewPort (config);


//initialize the player object
var player = {

    health: 100,
    jetpack: 0,         //0 = on; 1=off
    height: 600,
    width: 400,
    depth: 400,
    hitbox : new collision_box({
        ctr : viewPort.location,
        width : 400,
        height : 600,
        depth : 400,
        state : 1,
        triggerID : "",
        triggerCode : ""
    }),
    force : {
        x : 0,
        y : 0,
        z : 0
    },
    strength : {
        x : 10,
        y : 70,
        z : 10,
    }
};



// // EXAMPLE: manually adding faces

// //create face and hitbox
// var config = {
//     ctr : new Vertex(0,0-canvas.height/2,0),
//     width : canvas.width,
//     height : 0,
//     depth : canvas.width,
//     id : "face"+world.faces.length,
//     fill : 'rgba(100,100,100,1.0)',
//     stroke : 'rgba(0,0,0,1.0)',
//     state : 1,
//     triggerID : "",
//     triggerCode : ""
// }
// // world.faces[world.faces.length] = new Face(config);
// // world.hitboxes[world.hitboxes.length] = new collision_box(config);

// //add another face
// config.ctr.y = canvas.height/2;
// world.faces[world.faces.length] = new Face(config);
// world.hitboxes[world.hitboxes.length] = new collision_box(config);

// // //add another face
// // config.ctr.z += canvas.width;
// // config.ctr.y = canvas.height/2;
// // world.faces[world.faces.length] = new Face(config);
// // world.hitboxes[world.hitboxes.length] = new collision_box(config);

// //add another face
// config.ctr.z += canvas.width;
// config.ctr.y = -1*canvas.height/2;
// world.faces[world.faces.length] = new Face(config);
// world.hitboxes[world.hitboxes.length] = new collision_box(config);



// // EXAMPLE: manually configure a hallway
// var config = {
//     location : new Vertex(0,0,0),                   //this defines the start of our hallway (based on main grid)
//     typeList : [0,90,0,10,1,91,1,11,2,92,2,12,3,93,3,13],               //this defines the sections of our hallway
//     force_direction : 0,                            //this can be used to over ride direction and just build things in a straight line
//     direction : 0,                                  //if we force the direction, this sets the direction
//     stroke : 'rgba(0,0,0,1)',                       //this sets the outline color for the polygons
//     fill : {
//         ceiling : ['rgba(100,100,100,1)'],          //this sets the fill color for 'ceiling' polygons
//         floor : ['rgba(200,50,100,1)'],             //this sets the fill color for 'floor' polygons
//         wall : ['rgba(100,100,100,1)'],             //this sets the fill color for 'wall' polygons
//         door : ['rgba(50,50,50,1)']                 //this sets the fill color for 'door' polygons
//     }
// }

// world.new_hallway(config, world);



// //EXAMPLE: configure a gen_hallway
// var config = {

//     location : new Vertex(0,0,0),
//     length : 20,
//     branches : 0,
//     stroke : 'rgba(0,0,0,1)', 
//     fill : {
//         ceiling : ['rgba(100,100,100,1)'],
//         floor : ['rgba(200,50,100,1)'],
//         wall : ['rgba(100,100,100,1)'],
//         door : ['rgba(50,50,50,1)']
//     },
//     branchiness : 0,
//     branch_limit : 0,
//     bendiness : 60,
//     turn_limit : 1,
//     straight_limit : 10,
//     initial_direction : 0,
//     door_frequency : 20
// };

// world.random_hallway(config,world);




// //EXAMPLE: draw a predefined map
// var level = {

//         // map must be rectangular
//         // (0,0) coordinate is top left corner of this array

//         map : [

//                 [80,80,13,30,30,10,80,80,80,80],
//                 [80,80,33,50,50,50,90,10,80,80],
//                 [13,92,50,50,50,31,80,33,90,10],
//                 [ 3,80,33,50,50,50,90,11,80, 1],
//                 [ 3,80,12,50,32,11,80,80,80, 1],
//                 [ 3,80,80,91,80,80,80,80,80, 1],
//                 [12, 2, 2,11,80,80,80,80,80,11],
//                 [80,80,80,80,80,80,80,80,80,80],
//                 [80,80,80,80,80,80,80,80,80,80],
//                 [80,80,80,80,80,80,80,80,80,80]

//         ],
//         config : {
//             stroke : 'rgba(0,0,0,1)',
//             fill : {
//                 ceiling : ['rgba(100,100,100,1)'],
//                 floor : ['rgba(200,50,100,1'],
//                 wall : ['rgba(100,100,100,1)'],
//                 door : ['rgba(50,50,50,1']
//             },
//             player_start : {
//                 row : 3,
//                 column : 4,
//                 direction : 1
//             }
//         }
// };
// world.draw_level(level,world,viewPort);


// // EXAMPLE: draw a random level of specified size and with fixed parameters
// var config = {

//     size : 15,                               //the level will fit a square with sides of this length
//     hallways : 150,                          //this many hallways will be generated within the square (some may overlap each other)
//     length : 1,                              //this is the maximum length of each hallway
//     stroke : 'rgba(0,0,0,1)',                //color for the stroke of each polygon
//     fill : {                                 
//         ceiling : ['rgba(100,100,100,1)'],   //color to fill the ceiling
//         floor : ['rgba(50,50,50,1'],         //color to fill the floor 
//         wall : ['rgba(100,100,100,1)'],      //color to fill the walls
//         door : ['rgba(50,50,50,1']           //color to fill any doors (doors not implemented yet)
//     },
// };
// world.random_level(config,world,viewPort);

// EXAMPLE: draw a random level of specified size and with randomized parameters
var sze = 15;
var lgth = 1+Math.random()*sze/2;
var hlwys = 150/(2*lgth) + Math.random()*150/(2*lgth);     //divide by hallway length to prevent too many sections slowing everything down
var min = 20;
var max = 50;

var config = {

    size : sze,                               //the level will fit a square with sides of this length
    hallways : hlwys,                          //this many hallways will be generated within the square (some may overlap each other)
    length : lgth,                              //this is the maximum length of each hallway
    min_squares : min,                        //minimum number of square segments in the level
    max_squares : max,                        //maximum number of square segments in the level
    stroke : 'rgba(0,0,0,1)',                //color for the stroke of each polygon
    fill : {                                 
        ceiling : ['rgba(100,100,100,1)'],   //color to fill the ceiling
        floor : ['rgba(50,50,50,1'],         //color to fill the floor 
        wall : ['rgba(100,100,100,1)'],      //color to fill the walls
        door : ['rgba(50,50,50,1']           //color to fill any doors (doors not implemented yet)
    },
};
world.random_level(config,world,viewPort);



//start the animation loop
var zmap = [];
drawAndUpdate(zmap);



