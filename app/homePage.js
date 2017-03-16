class HomePage{
	constructor(config){
		this.canvas = document.getElementById(config.canvasID);
		this.title = document.getElementById(config.titleID);
		this.menu = document.getElementById(config.menuID);
		this.start = document.getElementById(config.startID);
		this.context = this.canvas.getContext('2d');
		this.maze = new Map();
		this.tHeight = 0;
		this.mHeight = 0;
		this.mRate = 3;
		this.maze = new Map(10);
		this.UIDone = false;
		this.sRate = 100;
		this.zoom = 1.005;
		this.scale;
		this.startBool = false;
	}

	init(){
		const self = this;

		this.title.style.display = 'initial';
		this.title.style.height = 0;
		this.initMenu();
		this.maze.buildBackground(70, '#4c6b8a');


		window.requestAnimFrame(function(){
			self.animate();
		})
	}

	animate(){
		const self = this;

		if (!this.UIDone){ this.revealUI() }
        this.setScreen();
    	const offset = this.centerOffset();

		this.maze.draw(this.context, offset, this.scale);

		if (this.sRate > 900){
			this.zoom = .995;
		}else if (this.zoom < 1 && this.sRate < 100){
			this.zoom = 1.005
		}

		this.sRate *= this.zoom;

		if (!this.startBool){
			window.requestAnimFrame(function(){
				self.animate();
			});
		}else{
			console.log("WHORT")
			this.menu.style.display = 'none';
			this.title.style.display = 'none';
			var game = new Game('canvas');
			game.start();
		}
	}

	centerOffset(){
		return [
			this.maze.dimen()[0]/2 - (window.innerWidth/2)/this.scale,
			this.maze.dimen()[1]/2 - (window.innerHeight/2)/this.scale

		];
	}
	revealUI(){
		const rDegree = (this.tHeight * .1) * 360,
		      menuHeight = (this.menu.offsetHeight/window.innerHeight) * 100;

		if (rDegree < 361){
			this.growMenu(rDegree);
		}else if (this.mHeight < 50 - menuHeight/2){
			this.dropMenu(menuHeight);
		}else{
			this.UIDone = true;
		}
	}

	growMenu(rDegree){
		const self = this,
			  newHeight = this.tHeight.toString() + '%',
			  newDegree = 'rotate(' + rDegree.toString() + 'deg)',
			  top = 50 - (40 * this.tHeight * .1),
			  newTop = top.toString() + '%';

		this.title.style.height = newHeight;
	    this.title.style.transform = newDegree;
	    this.title.style.top = newTop;

    	this.tHeight += 0.4;
	}

	initMenu(){
		const self = this;
		this.menu.style.display = 'none';

		const menuHeight = (this.menu.offsetHeight/window.innerHeight) * 100;
		console.log(this.menu.offsetHeight, menuHeight)
		this.menu.style.top = "-" + menuHeight + '%';
		this.mHeight = menuHeight * -1;
		this.start.onclick = function(){
			self.startBool = true;
			console.log(self.startBool);
		}
	}

	dropMenu(menuHeight){
		const self = this;

		if (this.menu.style.display != 'initial'){
			this.menu.style.display = 'initial'
		};

		this.menu.style.top = this.mHeight.toString() + '%';
		this.mHeight += this.mRate;
		this.mRate *= .98;
	}

	setScreen(){
        // // this.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.scale = window.innerHeight/this.sRate;
        this.context.scale(this.scale, this.scale)
	}
}
