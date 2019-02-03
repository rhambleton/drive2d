//TODO - implement code for terrain
//TODO - full perspective projection

//define what a vertex is
var Vertex = function (x, y, z) {

    //
    //        |   
    //        |  /
    //        | / Z
    //      Y |/
    //        +-----
    //          X
    //

    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);

};

//define what a 2d vertex is
var Vertex2D = function(x, y) {

    //
    //     |
    //   Y |
    //     |
    //     +--------
    //         X


    this.x = parseFloat(x);
    this.y = parseFloat(y);

}; // end of vertex2D


//define what a collision box is
var collision_box = function(config) {

    // config.ctr = Vertex(x,y,z)       // coordinates of the center of the face
    // config.depth;                    // depth along the z-axis
    // config.width;                    // width along the x-axis
    // config.height;                   // height along the y-axis
    // config.state = 0 | 1 | 2;        // 0 = inactive, 1=active, 2=transparent
    // config.triggerID = XX;           // the ID of the trigger to activate
    // config.triggerCode = 0;          // this ode will bbe passed to the 'activate' method of the trigger - used to select from multiple actions

    this.max_x = config.ctr.x + (config.width/2);
    this.min_x = config.ctr.x - (config.width/2);

    this.max_y = config.ctr.y + (config.height/2);
    this.min_y = config.ctr.y - (config.height/2);

    this.max_z = config.ctr.z + (config.depth/2);
    this.min_z = config.ctr.z - (config.depth/2);

    this.state = config.state;

    this.triggerID = config.triggerID;
    this.triggerCode = config.triggerCode;

}; //end collision box definition


//function to check for collsions between a test collision_box and an array of objects
function check_collision(test, hitboxes) {

    var collision = {};
    var x_axis_test;
    var y_axis_test;
    var z_axis_test;
    collision.test = 0;
    collision.indexList = [];
    collision.hitboxes = [];

    //loop over the hitboxes for this target
    for (var j=0; j<hitboxes.length; j++) {

        x_axis_test = (test.min_x <= hitboxes[j].max_x && test.max_x >= hitboxes[j].min_x);
        y_axis_test = (test.min_y <= hitboxes[j].max_y && test.max_y >= hitboxes[j].min_y);
        z_axis_test = (test.min_z <= hitboxes[j].max_z && test.max_z >= hitboxes[j].min_z);

        if(x_axis_test && y_axis_test && z_axis_test ) {

            //the test object has collided with the target object
            collision.test = 1;
            collision.indexList[collision.indexList.length] = j;
            collision.hitboxes[collision.hitboxes.length] = hitboxes[j];

        } //end test for collision with this hitbox

    } // end loop over this targets hitboxes

    // console.log("inside: "+JSON.stringify(collision));
    return collision;

}; //end check_collision


// define what a viewPort is
var viewPort = function (input) {

    //a viewPort represents the view of the world (such as the player's screen)
    //it has a location in the 3d space - represented by a 3d vertex at the center of the screen
    //it has a width and a height - represented by scalar objects
    //it has three angles that specify it's orientation vs the world
    //  pitch is the angle of rotation around the X-Axis 
    //  yaw is the angle of rotation around the Y-axis        
    //  roll is the angle of rotation around the Z-Axis
    //moving the viewport's location will move the view within the 3d world
    //viewPorts are rectangular
    //
    //   0         3
    //   +---------+
    //   |         |
    //   |    +    |
    //   |         |
    //   +---------+
    //   1         2
    //

    this.location = input.location;
    this.width = input.width;
    this.height = input.height;
    this.pitch = input.pitch;
    this.yaw = input.yaw;
    this.roll = input.roll;
    this.mass = 1;
    this.max_distance = input.max_distance;

    //represent x,y,z components of force, speed and accleration with vertex objects
    this.speed = new Vertex(0,0,0);
    this.velocity = new Vertex(0,0,0);
    this.acceleration = new Vertex(0,0,0);
    this.force = new Vertex(0,0,0);

    //represent angular velcocity, acceleration and moments with 3 components of vertex objects
    this.turn = new Vertex(0,0,0);                      //to be removed later
    this.angular_velocity = new Vertex(0,0,0);
    this.angular_acceleration = new Vertex(0,0,0);
    this.moments = new Vertex(0,0,0);

    //calculate the locations of the vertices
    this.vertices = [

        new Vertex(this.location.x - this.width/2, this.location.y + this.height/2, this.location.z), // 0
        new Vertex(this.location.x - this.width/2, this.location.y - this.height/2, this.location.z), // 1
        new Vertex(this.location.x + this.width/2, this.location.y - this.height/2, this.location.z), // 2
        new Vertex(this.location.x + this.width/2, this.location.y + this.height/2, this.location.z)  // 3

    ]; //end of vertices

    //define the update function
    this.update = function () {

        //apply the forces to update the acceleration
        this.acceleration.x = this.force.x / this.mass;
        this.acceleration.y = this.force.y / this.mass;
        this.acceleration.z = this.force.z / this.mass;

        //apply the acceleration to update the velocity
        this.speed.x += this.acceleration.x;
        this.speed.y += this.acceleration.y;
        this.speed.z += this.acceleration.z;

        //apply the speed to update the location
        this.location.x += this.speed.x;
        this.location.y += this.speed.y;
        this.location.z += this.speed.z;

    }


}; // end of view port definition


//function to project the 3D space onto our 2D viewing window
function project(M, type, viewPort) {

    switch(type) {

        case "orthographic" :
            return new Vertex2D(M.x, M.y)
        
        case "weak-perspective" :
            
            //generally reliable
            var d = 200; //focal length       
            var r = d / M.z;
            return new Vertex2D(r*M.x, r*M.y);

        case "better-perspective" :

            //better is relative - this doesn't really work at all
            var d = 650; //focal length
            var r = d / Math.sqrt((M.x*M.x)+(M.z*M.z))
            return new Vertex2D(r*M.x, r*M.y);

        case "full-perspective" :
            // incomplete and non-functional
            var focal_length = 200;

            //define a temporary point which we will then rotate
            var tempVtx = new Vertex(0, 0, 0);
            var x = M.x - viewPort.x;
            var y = M.y - viewPort.y;
            var z = M.z - viewPort.z;

            //TOD DO using wikipedia var cx = Math.cos(viewPort.)

            //tempVtx.x = (Math.cos(viewPort.pitch) * ((Math.sin(viewPort.yaw)*y) + (Math.cos(viewPort.pitch)*x))) - Math.sin(viewPort.pitch);
            
            var dx = (Math.cos(viewPort.yaw)*((Math.sin(viewPort.roll)*y)+(Math.cos(viewPort.roll)*x))) - (Math.sin(viewPort.yaw)*z);
            var dy = (Math.sin(viewPort.pitch)*((Math.cos(viewPort.yaw)*z)+(Math.sin(viewPort.yaw)*((Math.sin(viewPort.roll)*y)+Math.cos(viewPort.roll)*x)))) + (Math.cos(viewPort.pitch)*((Math.cos(viewPort.roll)*y)+(Math.sin(viewPort.roll)*x)));
            var dz = (Math.cos(viewPort.pitch)*((Math.cos(viewPort.yaw)*z)+(Math.sin(viewPort.yaw)*((Math.sin(viewPort.roll)*y)+Math.cos(viewPort.roll)*x)))) - (Math.sin(viewPort.pitch)*((Math.cos(viewPort.roll)*y)+(Math.sin(viewPort.roll)*x)));

            tempVtx.x = (focal_length/dz)*dx;
            tempVtx.y = (focal_length/dz)*dy;

            return new Vertex2D(tempVtx.x, tempVtx.y);

    } // end switch

}; // end of project()





//function to render all the faces in the world
function render (world,location,ctx) {

    
    world.track.draw(ctx,location);   
    
    //rotate canvas by -1 world.vehicle.angle
    world.vehicle.draw(ctx,location);
    //rotate canvas by world.vehicle.angle

}; // end render()
