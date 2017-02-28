window.onload = function(){
	const game = new Game('canvas');
	console.log("G", game.canvas);
	game.start();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
          	window.setTimeout(callback, 1000 / 60);
          };
})();

class Game {

	constructor(canvasID){
		console.log("HAAH");
		this.canvas = document.getElementById('canvas'),
		this.context = this.canvas.getContext('2d');
		this.camera = [0, 0];
		this.background = new Background(120);
		this.player = new Guy([0, 0]);
		this.viewPort = new ViewPort(25);
		this.scale;
	}

	start(){
		this.player.listenForMovement();
		this.background.buildMaze(5);
		console.log(this.background.start);
		this.player.coord = this.background.start;
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
		this.background.draw(this.context, offset);
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

class Guy { 

	constructor(initCoord){
		this.coord = initCoord;
		this.speed = 8;
		this.maxDistance = 500;
		this.pointer = [0, 0];
		this.dimen = {
			'width': 60,
			'height': 60
		};

		this.history = [];
	}

	draw(ctx, scale, offset){
		const x = this.coord[0] - ((this.dimen.width)/2 * scale) - offset[0], 
			  y = this.coord[1] - ((this.dimen.height)/2 * scale) - offset[1];

		this.handleHistory(ctx, offset);

		ctx.save();
		ctx.fillStyle = 'blue';
		ctx.fillRect(x, y, this.dimen.width, this.dimen.height);
		ctx.restore();

		this.updateCoord(scale, offset);
	}

	listenForMovement(){
		const self = this;

		document.addEventListener('mousemove', function(e){
			self.pointer = [e.pageX, e.pageY]
		});
	}

	handleHistory(ctx, offset){
		const bounds = [
	 		window.innerWidth * -0.5,
	 		window.innerHeight * -0.5,
	 		window.innerWidth * 1.5,
	 		window.innerHeight * 1.5
		], c = this.coord;

		let novel = true;
   	
	   	ctx.save();
	   	ctx.fillStyle = 'pink';

		for (let i = this.history.length - 1; i >= 0; i--){
			const h = this.history[i],
				  x = h[0] - offset[0],
				  y = h[1] - offset[1],
				  inXBounds = x > bounds[0] && x < bounds[2],
				  inYBounds = y > bounds[1] && y < bounds[3];

			if (inXBounds && inYBounds){
				ctx.beginPath();
				ctx.arc(h[0] - offset[0], h[1] - offset[1],10,0,2*Math.PI);
				ctx.fill();
			}

			if (novel){ 
				const dist = Math.sqrt(
					Math.pow(c[0] - h[0], 2) + Math.pow(c[1] - h[1], 2)
				);

				novel = dist > 3;
			}
		}

		ctx.restore();

		if (novel){
			this.history.push([this.coord[0], this.coord[1]]);
		} 
	}

	updateCoord(scale, offset){
		const maxDist = this.maxDistance,
			pointer = [
				this.pointer[0]/scale + offset[0],
				this.pointer[1]/scale + offset[1]
			], 

			xDist = pointer[0] - this.coord[0],
			yDist = pointer[1] - this.coord[1],
			dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)),

			speed = dist <  maxDist ? this.speed * (dist/maxDist) : this.speed,
			angle = dist > 0 ? Math.asin(yDist/dist) : 0;

		let xVelocity = speed * Math.cos(angle),
			yVelocity = speed * Math.sin(angle);

		if (pointer[0] < this.coord[0]){ xVelocity *= -1 };

		this.coord[0] += xVelocity;
		this.coord[1] += yVelocity;
	}
};

class Background {

	constructor(tileSize){
		this.tSize = tileSize;
		this.tiles = [];
		this.history = [];
		this.start;
		this.end;
	}

	draw(ctx, offset){
		ctx.save();
		ctx.fillStyle = 'green';

		for (let y = 0; y < this.tiles.length; y++){
			for (let x = 0; x < this.tiles[y].length; x++){
				if (this.tiles[y][x]){
					const tX = (x * this.tSize) - offset[0],
						  tY = (y * this.tSize) - offset[1];

					ctx.fillRect(tX, tY, this.tSize, this.tSize);
				}
			}
		}

		ctx.restore();
	}

	buildMaze(size){
		const maze = new Maze(size),
			  fullSize = (size * 2) + 1;

		maze.assemble();
		this.assembleTMap(fullSize);
		this.addEnds(maze, fullSize);

		for (let c = 0; c < size; c++){
			for (let r = 0; r < size; r++){

				const mTile = maze.map[c][r],
					  coord = [(r * 2) + 1, (c * 2) + 1];

				if (mTile && mTile.visited){

					this.tiles[coord[1]][coord[0]] = false;

					for (let i = 0; i < mTile.carve.length; i++){

						const cCoord = [
							coord[0] + mTile.carve[i][0], 
							coord[1] + mTile.carve[i][1]
						];

						this.tiles[cCoord[1]][cCoord[0]] = false;
					}
				}
			}
		}
	}

	addEnds(maze, fSize){
		const ends = ['start', 'end'];

		for (let x = 0; x < ends.length; x++){
			if (maze[ends[x]]){
				const end = maze[ends[x]],
					eCoord = [end[0] * 2 + 1, end[1] * 2 + 1];

				if (end[0] === 0){
					this.tiles[eCoord[1]][eCoord[0] - 1] = false;

					this[ends[x]] = [
						eCoord[0] * (this.tSize * .95), 
						eCoord[1] * this.tSize
					];

				}else if (end[0] == maze.size - 1){
					this.tiles[eCoord[1]][eCoord[0] + 1] = false;

					this[ends[x]] = [
						eCoord[0] * (this.tSize * 1.05), 
						eCoord[1] * this.tSize
					];


				}else if (end[1] === 0){
					this.tiles[eCoord[1] - 1][eCoord[0]] = false;

					this[ends[x]] = [
						eCoord[0] * this.tSize, 
						eCoord[1] * (this.tSize * .95)
					];


				}else if (end[1] == maze.size - 1){
					this.tiles[eCoord[1] + 1][eCoord[0]] = false;

					this[ends[x]] = [
						eCoord[0] * this.tSize,
						eCoord[1] * (this.tSize * 1.05)
					];
				}
			}
		}
	}

	assembleTMap(size){
		for (let c = 0; c < size; c++){
			this.tiles[c] = [];

			for (let r = 0; r < size; r++){
				this.tiles[c].push(true);
			}
		}
	}
};


class Maze{

	constructor(size){
		this.map = [];
		this.size = size;
		this.start;
		this.end;
		this.directions = [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0]
		]
	}

	assemble(){
		for (let c = 0; c < this.size; c++){
			var row = [];

			for (var r = 0; r < this.size; r++){
				row.push({
					'carve': [], 
					'visited': false
				})
			}

			this.map.push(row);
		}

		this.carve(0, 0);
		this.pickEnds();
	}

	carve(x, y){
		this.map[y][x].visited = true;
		shuffle(this.directions);
		console.log(this.directions);

		for (let i = 0; i < this.directions.length; i++){
			const dir = this.directions[i],
				newX = x + dir[0],
				newY = y + dir[1],
				inXBounds = newX < this.size && newX >= 0,
				inYBounds = newY < this.size && newY >= 0;

			if (inXBounds && inYBounds && !this.map[newY][newX].visited){
				this.map[y][x].carve.push(dir);
				this.carve(newX, newY);
			}
		}
	}

	pickEnds(){
		if (!this.start || !this.end){

			const sides = [
				[0, null], 
				[this.size - 1, null], 
				[null, 0], 
				[null, this.size - 1]
			];

			let side = sides[Math.floor(Math.random() * sides.length)];

			for (let i = 0; i < side.length; i++){
				if (side[i] !== 0 && !side[i]){
					side[i] = Math.floor(Math.random() * this.size);
				}
			}

			const endTile = this.map[side[1]][side[0]];

			if (endTile && endTile.visited && !this.start){
				this.start = side;
			}else if (endTile && endTile.visited){
				this.end = side;
			}

			this.pickEnds();
		}
	}
};

class ViewPort {

	constructor(maxDist){
		this.coord = [0, 0];
		this.maxDist = maxDist;
	}

	offset(pCoord, scale){
		const center = [
			this.coord[0] + (window.innerWidth/2)/scale,
			this.coord[1] + (window.innerHeight/2)/scale
		], 
			maxDist = this.maxDist * scale,
			xDist = pCoord[0] - center[0],
			yDist = pCoord[1] - center[1],
			distance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));

		if (distance > maxDist){
			const angle = Math.asin(yDist/distance);
			let xOffset = Math.cos(angle) * maxDist,
				yOffset = Math.sin(angle) * maxDist;

			if (pCoord[0] < center[0]){ xOffset *= -1; }

			const mX = center[0] + xOffset,
				  mY = center[1] + yOffset;

			this.coord[0] += pCoord[0] - mX
			this.coord[1] += pCoord[1] - mY;
		}

		return this.coord;
	}
};

function shuffle(a){
	for (var i = a.length - 1; i >= 0; i--){
		var index = Math.floor(Math.random() * (i + 1)),
			temp = a[index];

		a[index] = a[i];
		a[i] = temp;
	}
}

