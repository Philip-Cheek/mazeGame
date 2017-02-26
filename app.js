window.onload = function(){
	var game = new Game('canvas');
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

var Game = function(canvasID){
	this.canvas = document.getElementById('canvas'),
	this.context = this.canvas.getContext('2d');
	this.camera = [0, 0];
	this.background = new Background();
	this.player = new Guy([0, 0]);
	this.scale;
}

Game.prototype.start = function(){
	var self = this;

	this.player.listenForMovement();
	this.background.buildMaze(90);
	window.requestAnimFrame(gameLoop);

	function gameLoop(){
		self.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
		self.canvas.height = window.innerHeight;
		self.canvas.width = window.innerWidth;
		self.scale = window.innerHeight/700;
		self.context.save();
		self.context.scale(self.scale, self.scale);
		self.background.draw(self.context);
		self.player.draw(self.context, self.scale);
		self.context.restore();

		window.requestAnimFrame(gameLoop)
	}
};

var Guy = function(initCoord){
	this.coord = initCoord;
	this.keys = {
		'left': false,
		'right': false,
		'up': false,
		'down': false,
	}
	this.speed = 8;
	this.maxDistance = 500;
	this.pointer = [0, 0];
	this.dimen = {
		'width': 60,
		'height': 60
	}
}

Guy.prototype.draw = function(ctx, scale){
	ctx.save();
	ctx.fillStyle = 'blue';
	ctx.fillRect(this.coord[0], this.coord[1], this.dimen.width, this.dimen.height);
	ctx.restore();

	this.updateCoord(scale);
}

Guy.prototype.listenForMovement = function(){
	var self = this;

	document.addEventListener('mousemove', function(e){
		self.pointer = [e.pageX, e.pageY]
	});
};

Guy.prototype.updateCoord = function(scale){
	var maxDist = this.maxDistance,
		coord = [
			this.coord[0] + (this.dimen.width)/2 * scale,
			this.coord[1] + (this.dimen.height)/2 * scale
		], pointer = [this.pointer[0]/scale, this.pointer[1]/scale];

		xDist = pointer[0] - coord[0],
		yDist = pointer[1] - coord[1],
		dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)),

		speed = dist <  maxDist ? this.speed * (dist/maxDist) : this.speed,
		angle = dist > 0 ? Math.asin(yDist/dist) : 0,

		xVelocity = speed * Math.cos(angle),
		yVelocity = speed * Math.sin(angle);

	if (pointer[0] < coord[0]){ xVelocity *= -1 };

	this.coord[0] += xVelocity;
	this.coord[1] += yVelocity;
};

var Background = function(){
	this.tiles = [];
	this.start;
	this.end;
}

Background.prototype.draw = function(ctx){
	ctx.save();
	ctx.fillStyle = 'green';

	for (var y = 0; y < this.tiles.length; y++){
		for (var x = 0; x < this.tiles[y].length; x++){
			if (this.tiles[y][x]){
				ctx.fillRect(x * 5, y * 5, 5, 5);
			}
		}
	}

	ctx.restore();

}

Background.prototype.buildMaze = function(size){
	var maze = new Maze(size);
		fullSize = (size * 2) + 1,
		ends = ['start', 'end'],
		self = this;

	maze.assemble();

	for (var col = 0; col < fullSize; col++){
		this.tiles[col] = [];
		for (var row = 0; row < fullSize; row++){
			this.tiles[col].push(true);
		}
	}

	for (var c = 0; c < size; c++){
		for (var r = 0; r < size; r++){
			var mTile = maze.map[c][r],
				coord = [(r * 2) + 1, (c * 2) + 1];

			if (mTile && mTile.visited){
				this.tiles[coord[1]][coord[0]] = false;

				for (var i = 0; i < mTile.carve.length; i++){
					cCoord = [coord[0] + mTile.carve[i][0], coord[1] + mTile.carve[i][1]];
					this.tiles[cCoord[1]][cCoord[0]] = false;
				}
			}
		}
	}

	for (var x = 0; x < ends.length; x++){
		if (maze[ends[x]]){
			var end = maze[ends[x]],
			eCoord = [end[0] * 2 + 1, end[1] * 2 + 1];

			if (end[0] === 0){
				this.tiles[eCoord[1]][eCoord[0] - 1] = false;
			}else if (end[0] == size - 1){
				this.tiles[eCoord[1]][eCoord[0] + 1] = false;
			}else if (end[1] === 0){
				this.tiles[eCoord[1] - 1][eCoord[0]] = false;
			}else if (end[1] == size - 1){
				this.tiles[eCoord[1] + 1][eCoord[0]] = false;
			}

			this[ends[x]] == eCoord;

		}
	}
}


var Maze = function(size){
	this.map = [];
	this.size = size;
	this.start;
	this.end;
}

Maze.prototype.assemble = function(){
	var directions = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0]
	], self = this;

	for (var c = 0; c < this.size; c++){
		var row = [];

		for (var r = 0; r < this.size; r++){
			row.push({
				'carve': [], 
				'visited': false,
				'end': false,
			})
		}

		this.map.push(row);
	}

	carve(0, 0, shuffle(directions));

	function carve(x, y, directions){
		self.map[y][x].visited = true;

		for (var i = 0; i < directions.length; i++){
			var dir = directions[i],
				newX = x + dir[0],
				newY = y + dir[1],
				inXBounds = newX < self.size && newX >= 0,
				inYBounds = newY < self.size && newY >= 0;

			if (inXBounds && inYBounds && !self.map[newY][newX].visited){
				self.map[y][x].carve.push(dir);
				carve(newX, newY, shuffle(directions));
			}
		}
	}

	this.pickEnds();
}

Maze.prototype.pickEnds = function(){
	if (!this.start || !this.end){
		var sides = [[0, null], [this.size - 1, null], [null, 0], [null, this.size - 1]],
			side = sides[Math.floor(Math.random() * sides.length)];

		console.log("SIDE", side);
		for (var i = 0; i < side.length; i++){
			if (side[i] !== 0 && !side[i]){
				side[i] = Math.floor(Math.random() * this.size);
			}
		}

		console.log(side, this.size - 1);
		if (this.map[side[1]][side[0]] && this.map[side[1]][side[0]].visited && !this.start){
			this.start = side;
		}else if (this.map[side[1]][side[0]] && this.map[side[1]][side[0]].visited){
			this.end = side;
		}

		this.pickEnds();
	}



}

function shuffle(a){
	for (var i = a.length - 1; i >= 0; i--){
		var index = Math.floor(Math.random() * (i + 1)),
			temp = a[index];

		a[index] = a[i];
		a[i] = temp;
	}

	return a;
}


