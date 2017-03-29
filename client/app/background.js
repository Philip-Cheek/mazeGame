"use strict";

class Background { 

	constructor(canvasID, maze, bColor, size){
		this.canvas = document.getElementById(config.canvasID);
		this.context = this.canvas.getContext('2d');
		this.maze = new Map(10);

		this.animate = {
			'sRate': 50,
			'zoom': .998
		};

		this.scale;
		this.buildBMaze(maze, bColor);
	}


	buildBMaze(maze, bColor){
		const color = bColor ? bColor : '#4c6b8a',
			  size = maze.size;

	    this.maze.buildMaze(size, [color, color], maze, true);
	}

	scaleMaze(){
		const sRate = this.animate.sRate,
	          zoom = this.animate.zoom,
	          offset = this.centerOffset();

	    this.setScreen();
		this.maze.draw(this.context, offset, this.scale);

		if (sRate > 950){
			this.animate.zoom = .998;
		}else if (zoom < 1 && sRate < 50){
			this.animate.zoom = 1.002
		}

		this.animate.sRate *= this.animate.zoom;
	}

	centerOffset(){
		return [
			this.maze.dimen()[0]/2 - (window.innerWidth/2)/this.scale,
			this.maze.dimen()[1]/2 - (window.innerHeight/2)/this.scale

		];
	}


	setScreen(){
		const sRate = this.animate.sRate;
	    this.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
	    this.canvas.height = window.innerHeight;
	    this.canvas.width = window.innerWidth;
	    this.scale = window.innerHeight/sRate;
	    this.context.scale(this.scale, this.scale)
	}
}