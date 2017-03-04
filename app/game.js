class Game {

	constructor(canvasID){
		this.canvas = document.getElementById('canvas'),
		this.context = this.canvas.getContext('2d');
		this.camera = [0, 0];
		this.map = new Map(130);
		this.player = new Player([0, 0]);
		this.viewPort = new ViewPort(40);
		this.scale;
	}

	start(){
		this.player.listenForMovement();
		this.map.buildMaze(5);
		this.player.coord = this.map.start;
		const self = this;

		window.requestAnimFrame(function(){
			self.gameLoop()
		});

	}

	gameLoop(){
		this.setScreen();

		const offset = this.viewPort.offset(
			this.player.coord, 
			this.scale, 
			this.context
		), self = this;

		this.context.save();
		this.context.scale(this.scale, this.scale);
		this.map.draw(this.context, offset);
		this.player.draw(this.context, this.scale, offset);
		this.context.restore();

		window.requestAnimFrame(function(){
			self.gameLoop()
		});
	}

	setScreen(){
		this.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		this.scale = window.innerHeight/700;
	}
}