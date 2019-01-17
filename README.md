# Overview
This is an effort to generate a simple '3D engine' in javascript using the CANVAS element in the browser.  Short Term Goal - generate random maze of hallways and time how long the user takes to navigate the maze.  Long Term Goal - something along the lines of the original wolfenstein 3d.

# General Architecture
default.html
	- contains the basic HTML to create the CANVAS element and load the javascript files
3d.js
	- contains the javascript definitions for low level 3d objects (vertex, surface, etc.)
	- also contains the javascript functions for rendering the objects (3d->2d projection, painters algorithm, rendering, etc.)
worldbuilder.js
	- contains the higher level functions/definitions to create more complex objects (doors, mazes, hallway sections, etc.)
	- worldbuilder.js depends on 3d.js
main.js
	- this contains the main animation loop, and the configuration data
	- it depends on worldbuilder.js and 3d.js

in the long term - 3d.js and worldbuilder.js will function as libraries; main.js will be project specific

# Current Focus / Priorities

Clipping / Painter's Algorithm
	- the current algorithms are better but still fail in some circumstances - leading to some visual glitches

Frame Rate
	- the frame rate still varies somewhat - and drops quickly with polygon count - longer/more complex mazes will aggravate this issue

Level Generation
	- the hallway function works quite well
	- the maze function has some color glitches - need to investigate why
	- branches and doors are not implemented yet


# Long Term Ideas/issues/wish list
	- mouse control option / touch control for phones
	- sprites, objects, interaction (weapons, enemies, combat, etc.)
	- code cleanup
	- squares vs. triangles - this will be necessary to allow texture mapping - but that is in the far, far, far future
	- multi-level levels - currently levels exist on a single plane (no ramps, steps, etc.)
	- lighting of some sort
	- other door styles

This is VERY MUCH a work in progress.  This project is primarily a vehicle for experimentation and learning.
