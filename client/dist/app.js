"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App(config) {
		_classCallCheck(this, App);

		this.config = config;
		this.canvas = document.getElementById(config.canvasID);
		this.context = this.canvas.getContext('2d');
		this.timeTrial = false;
		this.twoPlayer = false;
		this.menu;
		this.setMenu();
	}

	_createClass(App, [{
		key: "setMenu",
		value: function setMenu() {
			var self = this;

			this.menu = new HomeMenu(this.config, {
				time: function time() {
					self.timeTrial = true;
				},
				two: function two(roomID) {
					self.twoPlayer = roomID;
				}
			});
		}
	}, {
		key: "run",
		value: function run(inFrame) {
			if (this.timeTrial) {
				new TimeTrial(this.config).start();
			} else if (this.twoPlayer) {
				var roomID = this.twoPlayer,
				    game = new TwoPlayer(this.config, this.twoPlayer);

				game.start();
			} else {
				var self = this;
				if (inFrame) {
					this.menu.animate();
				};

				window.requestAnimFrame(function () {
					self.run(true);
				});
			}
		}
	}]);

	return App;
}();

;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Background = function () {
	function Background(canvasID, maze, bColor, size) {
		_classCallCheck(this, Background);

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

	_createClass(Background, [{
		key: 'buildBMaze',
		value: function buildBMaze(maze, bColor) {
			var color = bColor ? bColor : '#4c6b8a',
			    size = maze.size;

			this.maze.buildMaze(size, [color, color], maze, true);
		}
	}, {
		key: 'scaleMaze',
		value: function scaleMaze() {
			var sRate = this.animate.sRate,
			    zoom = this.animate.zoom,
			    offset = this.centerOffset();

			this.setScreen();
			this.maze.draw(this.context, offset, this.scale);

			if (sRate > 950) {
				this.animate.zoom = .998;
			} else if (zoom < 1 && sRate < 50) {
				this.animate.zoom = 1.002;
			}

			this.animate.sRate *= this.animate.zoom;
		}
	}, {
		key: 'centerOffset',
		value: function centerOffset() {
			return [this.maze.dimen()[0] / 2 - window.innerWidth / 2 / this.scale, this.maze.dimen()[1] / 2 - window.innerHeight / 2 / this.scale];
		}
	}, {
		key: 'setScreen',
		value: function setScreen() {
			var sRate = this.animate.sRate;
			this.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
			this.canvas.height = window.innerHeight;
			this.canvas.width = window.innerWidth;
			this.scale = window.innerHeight / sRate;
			this.context.scale(this.scale, this.scale);
		}
	}]);

	return Background;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Clock = function () {
	function Clock(clockID, addID, startTime, interval) {
		_classCallCheck(this, Clock);

		this.clock = document.getElementById(clockID);
		this.add = document.getElementById(addID);
		this.time = startTime ? startTime : 15;
		this.left = this.time;
		this.interval = interval ? interval * 1000 : 1000;
		this.addTop = 18;
		this.stamp;
		this.fSize = 4;
		this.isAdd = false;
	}

	_createClass(Clock, [{
		key: "outOfTime",
		value: function outOfTime() {
			if (this.left < 0) {
				this.clock.style.display = 'none';
				return true;
			}

			return false;
		}
	}, {
		key: "addTime",
		value: function addTime(amount) {
			var self = this;

			this.left += amount;
			this.add.innerHTML = "+" + amount.toString();
			this.addTop = 18;
			this.isAdd = true;
			this.add.style.opacity = '0';
			this.add.style.display = 'initial';
		}
	}, {
		key: "animAdd",
		value: function animAdd() {
			var self = this,
			    dist = (18 - 8) / 2,
			    mid = (18 + 8) / 2,
			    opVal = 1 - Math.abs(mid - this.addTop) / dist;

			this.add.style.top = this.addTop.toString() + '%';
			this.add.style.opacity = opVal;
			this.addTop -= .15;

			if (this.addTop < 8) {
				this.isAdd = false;
				this.add.style.display = 'none';
			}
		}
	}, {
		key: "reSet",
		value: function reSet(time) {
			if (time) {
				this.time = time;
			}
			this.left = this.time;
		}
	}, {
		key: "showTime",
		value: function showTime() {
			this.clock.style.display = 'initial';
			this.clock.innerHTML = this.left.toString();
			this.clock.style.color = 'white';
			this.clock.style.fontSize = '3em';
		}
	}, {
		key: "tickTime",
		value: function tickTime() {
			if (!this.stamp) {
				this.stamp = new Date();
			} else if (new Date() - this.stamp >= this.interval) {
				this.stamp = new Date();
				this.left -= this.interval / 1000;
				this.clock.innerHTML = this.left.toString();
				if (this.left < 11) {
					this.fSize = 4;
				};
			}

			if (this.left < 11) {
				this.clock.style.fontSize;
				this.clock.style.fontSize = this.fSize.toString() + 'em';
				this.fSize -= .03;
			}
		}
	}]);

	return Clock;
}();

// addTime(){
// 	this.addTop *= .98;
// 	this.add.style.top = this.addTop.string();
// }
'use strict';

var config = {
  'canvasID': 'canvas',
  'titleID': 'title',
  'menuID': 'menu',
  'timeID': 'time',
  'twoID': 'two',
  'clockID': 'clock',
  'overTitle': 'overTitle',
  'overMenu': 'overMenu',
  'overlay': 'overlay',
  'home': 'home',
  'restart': 'restart',
  'addID': 'add',
  'connectID': 'connecting',
  'backID': 'back',
  'socket': io.connect()
};

window.onload = function () {
  new App(config).run();
};

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(config) {
        _classCallCheck(this, Game);

        this.canvas = document.getElementById(config.canvasID);
        this.context = this.canvas.getContext('2d');
        this.map = new Map(130);
        this.player = new Player([0, 0], {
            'player': 'white',
            'history': '#4c6b8a'
        });
        this.viewPort = new ViewPort(50);
        this.sRate = 800;
        this.stamp = true;
        this.colorHistory = [];
        this.difficulty = 5;
        this.colorSet = [];
        this.gameOver;
        this.scale;
        this.socket = config.socket;
        this.initASettings(config);
    }

    _createClass(Game, [{
        key: 'initASettings',
        value: function initASettings(config) {
            var self = this;
            this.colorSet = [['#69111e', '#7D1424'], ['#27ae60', '#2ecc71'], ['#e67e22', '#d35400'], ['#95a5a6', '#7f8c8d'], ['#9b59b6', '#8e44ad']];

            this.gameOver = new OverMenu(config, function () {
                self.gameReset();
            });

            this.socket.on('incomingMaze', function (maze) {
                self.run(maze);
            });
        }
    }, {
        key: 'start',
        value: function start() {
            this.socket.emit('requestMaze', this.difficulty);
        }
    }, {
        key: 'run',
        value: function run(maze) {
            var self = this,
                colors = this.pickTColors();

            this.map.buildMaze(this.difficulty, colors, maze);
            this.player.reSet();
            this.sRate = 4000;
            window.requestAnimFrame(function () {
                self.player.listen = false;
                self.introLoop();
            });
        }
    }, {
        key: 'introLoop',
        value: function introLoop() {
            var self = this;

            this.setScreen();
            this.context.save();
            this.context.scale(this.scale, this.scale);

            var vCenter = [this.map.dimen()[0] / 2, this.map.dimen()[1] / 2],
                offset = this.viewPort.offset(vCenter, this.scale);

            this.map.visualForm(this.context, offset, this.stamp, this.scale);
            this.stamp = !this.stamp;
            this.context.restore();

            if (this.map.visualComplete()) {
                this.player.listen = false;
                this.setPCoordAtStart();
                window.requestAnimFrame(function () {
                    self.segueLoop();
                });
            } else {
                window.requestAnimFrame(function () {
                    self.introLoop();
                });
            }
        }
    }, {
        key: 'segueLoop',
        value: function segueLoop() {
            var self = this,
                oldScale = this.scale;

            this.sRate *= .99;
            this.setScreen();
            var percent = (4000 - this.sRate) / (4000 - 800);
            var offset = this.viewPort.zoom(this.player.coord, this.scale, percent);

            this.context.scale(this.scale, this.scale);
            this.drawScreen(offset);

            window.requestAnimFrame(function () {
                if (self.sRate > 800) {
                    self.segueLoop();
                } else {
                    self.player.listen = true;
                    self.player.listenForMovement();
                    self.gameLoop();
                }
            });
        }
    }, {
        key: 'gameLoop',
        value: function gameLoop() {
            this.setScreen();
            var self = this,
                offset = this.viewPort.offset(this.player.coord, this.scale),
                pCollision = this.map.checkCollision(this.player.coord, this.player.dimen);

            if (pCollision.status && pCollision.finish) {
                this.win();
                return;
            } else if (pCollision.status) {
                this.setPCoordAtStart();
            }

            this.context.scale(this.scale, this.scale);
            this.drawScreen(offset);

            window.requestAnimFrame(function () {
                self.gameLoop();
            });
        }
    }, {
        key: 'drawScreen',
        value: function drawScreen(offset) {
            var ctx = this.context,
                scale = this.scale;

            this.map.draw(ctx, offset, scale);
            this.player.handleHistory(ctx, offset, scale);
            this.player.draw(ctx, offset, scale);
        }
    }, {
        key: 'win',
        value: function win() {
            this.player.reSet(true);
            this.finishLoop();
        }
    }, {
        key: 'finishLoop',
        value: function finishLoop() {
            var self = this;
            this.sRate *= 1.01;

            this.setScreen();
            var vCenter = [this.map.dimen()[0] / 2, this.map.dimen()[1] / 2];

            var percent = (this.sRate - 800) / (4000 - 800),
                offset = this.viewPort.zoom(vCenter, this.scale, percent);

            this.context.scale(this.scale, this.scale);
            this.drawScreen(offset);

            window.requestAnimFrame(function () {
                if (self.sRate < 4000) {
                    self.finishLoop();
                } else {
                    self.difficulty += 2;
                    self.start();
                }
            });
        }
    }, {
        key: 'gameReset',
        value: function gameReset() {
            this.difficulty = 5;
            this.start();
        }
    }, {
        key: 'setScreen',
        value: function setScreen() {
            this.context.clearRect(0, 0, self.canvas.height, self.canvas.width);
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
            this.scale = window.innerHeight / this.sRate;
        }
    }, {
        key: 'setPCoordAtStart',
        value: function setPCoordAtStart() {
            this.player.coord = [this.map.start[0], this.map.start[1]];
        }
    }, {
        key: 'pickTColors',
        value: function pickTColors() {
            var randomIDX = Math.floor(Math.random() * this.colorSet.length);

            if (this.colorHistory.length == this.colorSet.length) {
                this.colorHistory = [this.colorHistory[this.colorHistory.length - 1]];
            }

            for (var i = 0; i < this.colorHistory.length; i++) {
                if (this.colorHistory[i] == randomIDX) {
                    return this.pickTColors();
                }
            }

            this.colorHistory.push(randomIDX);
            return this.colorSet[randomIDX];
        }
    }]);

    return Game;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeMenu = function () {
	function HomeMenu(config, startCallbacks) {
		_classCallCheck(this, HomeMenu);

		this.title = document.getElementById(config.titleID);
		this.menu = document.getElementById(config.menuID);
		this.timeTrial = document.getElementById(config.timeID);
		this.twoPlayer = document.getElementById(config.twoID);
		this.connect = document.getElementById(config.connectID);
		this.back = document.getElementById(config.backID);
		this.timeStart = startCallbacks.time;
		this.twoStart = startCallbacks.two;
		this.socket = config.socket;
		this.background;
		this.animInfo = {};
		this.init(config.canvasID);
	}

	_createClass(HomeMenu, [{
		key: 'init',
		value: function init(canvasID) {
			var self = this;

			this.animInfo = {
				'titleHeight': 0,
				'menuHeight': 0,
				'rate': 3,
				'uiDone': false,
				'connecting': false,
				'conFrame': 0
			};

			this.socket.on('backgroundMaze', function (maze) {
				self.background = new Background(canvasID, maze);
				self.setMenu();
			});
		}
	}, {
		key: 'setMenu',
		value: function setMenu() {
			this.menu.style.display = 'initial';
			this.title.style.display = 'initial';
			this.connect.style.display = 'none';
			this.back.style.display = 'none';
			this.title.style.height = 0;

			var s = this,
			    menuOffset = this.menu.offsetHeight,
			    menuHeight = menuOffset / window.innerHeight * 100;

			this.timeTrial.onclick = function () {
				s.closeUI();
				s.timeStart();
			};

			this.back.onclick = function () {
				s.connect.style.display = 'none';
				s.twoPlayer.disabled = false;
				s.timeTrial.disabled = false;
				s.twoPlayer.style.display = 'initial';
				s.timeTrial.style.display = 'initial';
				s.animInfo.connecting = false;
				s.animInfo.conFrame = 0;
				s.connect.innerHTML = 'connecting';
				s.socket.emit('leaveQueue');
				s.back.style.display = 'none';
			};

			this.twoPlayer.onclick = function () {
				s.socket.emit('connectTwoP');
				s.twoPlayer.disabled = true;
				s.timeTrial.disabled = true;
				s.twoPlayer.style.display = 'none';
				s.timeTrial.style.display = 'none';
				s.connect.style.display = 'initial';
				s.back.style.display = 'initial';
				s.animInfo.connecting = true;
			};

			this.socket.on('connectedTwoP', function (roomID) {
				s.closeUI();
				s.twoStart(roomID);
			});

			this.menu.style.top = "-" + menuHeight.toString() + "%";
			this.animInfo.menuHeight = menuHeight * -1;
		}
	}, {
		key: 'closeUI',
		value: function closeUI() {
			this.menu.style.display = 'none';
			this.title.style.display = 'none';
		}
	}, {
		key: 'animate',
		value: function animate() {
			if (!this.background) {
				return;
			};
			if (!this.animInfo.uiDone) {
				this.revealUI();
			}

			if (this.connect) {
				this.conElipse();
			}
			this.background.scaleMaze();
		}
	}, {
		key: 'conElipse',
		value: function conElipse() {
			var cHTML = this.connect.innerHTML;
			if (this.animInfo.conFrame % 20 == 0) {
				if (cHTML.length == "connecting".length + 3) {
					this.connect.innerHTML = "connecting";
				} else {
					this.connect.innerHTML += ".";
				}
			}

			this.animInfo.conFrame++;
		}
	}, {
		key: 'revealUI',
		value: function revealUI() {
			var tHeight = this.animInfo.titleHeight,
			    mHeight = this.animInfo.menuHeight,
			    rDegree = tHeight * .1 * 360,
			    menuOffset = this.menu.offsetHeight,
			    menuHeight = menuOffset / window.innerHeight * 100;

			if (rDegree < 361) {
				this.growTitle(rDegree);
			} else if (mHeight < 50 - menuHeight / 2) {
				this.dropMenu(menuHeight);
			} else {
				this.animInfo.uiDone = true;
			}
		}
	}, {
		key: 'growTitle',
		value: function growTitle(rDegree) {
			var self = this,
			    tHeight = this.animInfo.titleHeight,
			    newHeight = tHeight.toString() + '%',
			    newDegree = 'rotate(' + rDegree.toString() + 'deg)',
			    top = 50 - 40 * tHeight * .1,
			    newTop = top.toString() + '%';

			this.title.style.height = newHeight;
			this.title.style.transform = newDegree;
			this.title.style.top = newTop;

			this.animInfo.titleHeight += 0.4;
		}
	}, {
		key: 'dropMenu',
		value: function dropMenu(menuHeight) {
			var self = this,
			    mHeight = this.animInfo.menuHeight;

			this.menu.style.top = mHeight.toString() + '%';
			this.animInfo.menuHeight += this.animInfo.rate;
			this.animInfo.rate *= .98;
		}
	}]);

	return HomeMenu;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(tileSize) {
        _classCallCheck(this, Map);

        this.tSize = tileSize;
        this.tiles = [];
        this.start;
        this.sTiles = {};
        this.ends = [];
        this.vForm = [0, 0];
        this.colors = ["black", "white"];
        this.wIdx = 0;
    }

    _createClass(Map, [{
        key: "draw",
        value: function draw(ctx, offset, scale, stop) {
            var finish = this.ends.length > 0 ? this.ends[1] : null;
            var idx = 0;

            for (var y = 0; y < this.tiles.length; y++) {
                if (y * this.tSize - offset[1] > window.innerHeight / scale && this.colors[0] == this.colors[1]) {
                    break;
                };

                for (var x = 0; x < this.tiles[y].length; x++) {
                    if (x * this.tSize - offset[0] > window.innerWidth / scale && this.colors[0] == this.colors[1]) {
                        break;
                    };

                    if (this.tiles[y][x]) {
                        ctx.fillStyle = this.colors[idx];
                        var tX = x * this.tSize - offset[0],
                            tY = y * this.tSize - offset[1];

                        ctx.fillRect(tX, tY, this.tSize, this.tSize);
                    } else if (finish && x == finish[0] && y == finish[1]) {
                        this.drawWin(ctx, offset);
                    }

                    idx = idx < 1 ? 1 : 0;

                    if (stop && y == stop[1] && x == stop[0]) {
                        break;
                    }
                }

                if (stop && y == stop[1]) {
                    break;
                }

                idx = idx < 1 ? 1 : 0;
            }
        }
    }, {
        key: "dimen",
        value: function dimen() {
            return [this.tiles[0].length * this.tSize, this.tiles.length * this.tSize];
        }
    }, {
        key: "visualForm",
        value: function visualForm(ctx, offset, grow, scale) {
            var col = this.vForm[1],
                row = this.vForm[0];

            while (col < this.tiles.length && !this.tiles[col][row]) {
                if (row < this.tiles[col].length) {
                    row++;
                } else {
                    row = 0;
                    col++;
                }
            }

            this.draw(ctx, offset, scale, [row, col]);

            if (grow && col < this.tiles.length) {
                if (row + 1 < this.tiles[col].length) {
                    this.vForm = [row + 1, col];
                } else {
                    this.vForm = [0, col + 1];
                }
            }
        }
    }, {
        key: "visualComplete",
        value: function visualComplete() {
            var end = [];

            for (var c = 0; c < this.tiles.length; c++) {
                for (var r = 0; r < this.tiles[c].length; r++) {
                    if (this.tiles[c][r]) {
                        end[0] = r;
                        if (!end[1] || end[1] < c) {
                            end[1] = c;
                        }
                    };
                }
            }

            return this.vForm[1] >= end[1] && this.vForm[0] >= end[0];
        }
    }, {
        key: "checkCollision",
        value: function checkCollision(coord, dimensions) {
            var width = dimensions.width,
                height = dimensions.height,
                pX = coord[0] - width / 2,
                pY = coord[1] - height / 2,
                finish = this.ends[1];

            for (var y = 0; y < this.tiles.length; y++) {
                for (var x = 0; x < this.tiles[y].length; x++) {
                    if (this.tiles[y][x] || x == finish[0] && y == finish[1]) {
                        var tX = x * this.tSize,
                            tY = y * this.tSize,
                            lLeft = pX > tX,
                            lRight = pX < tX + this.tSize,
                            rLeft = pX + width > tX,
                            rRight = pX + width < tX + this.tSize;

                        if (lLeft && lRight || rLeft && rRight || !lLeft && !rRight) {
                            var bTop = pY + height > tY,
                                bBottom = pY + height < tY + this.tSize,
                                tTop = pY > tY,
                                tBottom = pY < tY + this.tSize;

                            if (bTop && bBottom || tTop && tBottom || !tTop && !bBottom) {
                                return {
                                    'status': true,
                                    'finish': x == finish[0] && y == finish[1]
                                };
                            }
                        }
                    }
                }
            }

            return { 'status': false, 'finish': false };
        }
    }, {
        key: "buildMaze",
        value: function buildMaze(size, colors, maze, skipEnds) {
            var fullSize = size * 2 + 1;

            if (colors) {
                this.colors = colors;
            };
            this.vForm = [0, 0];

            if (!skipEnds) {
                this.addEnds(maze, fullSize);
            } else {
                this.sTiles = { 'tiles': [], 'adjust': [0, 0], 'pos': null };
            }

            this.assembleTMap(fullSize);

            for (var c = 0; c < size; c++) {
                for (var r = 0; r < size; r++) {

                    var mTile = maze.map[c][r],
                        coord = [r * 2 + 1 + this.sTiles.adjust[0], c * 2 + 1 + this.sTiles.adjust[1]];

                    if (mTile && mTile.visited) {

                        this.tiles[coord[1]][coord[0]] = false;

                        for (var i = 0; i < mTile.carve.length; i++) {

                            var cCoord = [coord[0] + mTile.carve[i][0], coord[1] + mTile.carve[i][1]];

                            this.tiles[cCoord[1]][cCoord[0]] = false;
                        }
                    }
                }
            }
        }
    }, {
        key: "assembleTMap",
        value: function assembleTMap(size, noEnds) {
            var sTiles = this.sTiles.tiles,
                pos = this.sTiles.pos;

            this.tiles = [];

            for (var c = 0; c < size + sTiles.length; c++) {
                this.tiles[c] = [];
                var rLen = sTiles.length > 0 ? sTiles[0].length : 0;
                for (var r = 0; r < size + rLen; r++) {
                    if (!pos) {
                        this.tiles[c][r] = true;
                    } else {
                        var inColStart = c >= pos[1] && c < pos[1] + sTiles.length,
                            inRowStart = r >= pos[0] && r < pos[0] + sTiles[0].length;

                        if (inColStart && inRowStart) {
                            this.tiles[c].push(sTiles[c - pos[1]][r - pos[0]]);
                        } else if (pos[0] === 0 || pos[0] == size) {
                            this.tiles[c].push((inColStart || !inRowStart) && c < size);
                        } else if (pos[1] === 0 || pos[1] == size) {
                            this.tiles[c].push((!inColStart || inRowStart) && r < size);
                        }
                    }
                }
            }

            for (var i = 0; i < this.ends.length; i++) {
                var _c = this.ends[i][1] + this.sTiles.adjust[1],
                    _r = this.ends[i][0] + this.sTiles.adjust[0];

                this.tiles[_c][_r] = false;
                if (i > 0) {
                    this.ends[i] = [_r, _c];
                }
            }
        }
    }, {
        key: "addEnds",
        value: function addEnds(maze, fSize) {
            this.ends = [];
            var ends = ['start', 'end'];
            var dir, sCoord;

            for (var x = 0; x < ends.length; x++) {
                if (maze[ends[x]]) {
                    var end = maze[ends[x]],
                        eCoord = [end[0] * 2 + 1, end[1] * 2 + 1];
                    if (end[0] === 0) {
                        if (ends[x] == 'start') {
                            dir = 'left';
                            this[ends[x]] = [eCoord[0] * this.tSize + this.tSize, eCoord[1] * this.tSize];
                        }

                        this.ends.push([eCoord[0] - 1, eCoord[1]]);
                    } else if (end[0] == maze.size - 1) {
                        if (ends[x] == 'start') {
                            dir = 'right';
                            this[ends[x]] = [eCoord[0] * this.tSize + this.tSize * 3, eCoord[1] * this.tSize];
                        }

                        this.ends.push([eCoord[0] + 1, eCoord[1]]);
                    } else if (end[1] === 0) {
                        if (ends[x] == 'start') {
                            dir = 'top';
                            this[ends[x]] = [eCoord[0] * this.tSize, eCoord[1] * this.tSize + this.tSize];
                        }

                        this.ends.push([eCoord[0], eCoord[1] - 1]);
                    } else if (end[1] == maze.size - 1) {
                        if (ends[x] == 'start') {
                            dir = 'bottom';
                            this[ends[x]] = [eCoord[0] * this.tSize, eCoord[1] * this.tSize + this.tSize * 3];
                        }

                        this.ends.push([eCoord[0], eCoord[1] + 1]);
                    }

                    if (ends[x] == 'start') {
                        sCoord = [eCoord[0], eCoord[1]];
                    }
                }
            }

            this.setStartTiles(dir, sCoord, fSize);
        }
    }, {
        key: "drawWin",
        value: function drawWin(ctx, offset) {
            var color = ['#add9e6', '#0490d6'][this.wIdx],
                x = this.ends[1][0] * this.tSize + this.tSize / 2 - offset[0],
                y = this.ends[1][1] * this.tSize + this.tSize / 2 - offset[1],
                radius = this.tSize * .7;

            ctx.beginPath();
            ctx.arc(x, y, 50, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            this.wIdx = this.wIdx > 0 ? 0 : 1;
        }
    }, {
        key: "setStartTiles",
        value: function setStartTiles(dir, coord, size) {
            this.sTiles.tiles = [];
            this.sTiles.pos = [];
            this.sTiles.adjust = [0, 0];

            for (var c = 0; c < 5; c++) {
                var row = [];
                for (var r = 0; r < 5; r++) {
                    row.push(c < 1 || c > 3 || r < 1 || r > 3);
                }
                this.sTiles.tiles.push(row);
            }

            switch (dir) {
                case 'top':
                    this.sTiles.pos = [coord[0] - 2, 0];
                    this.sTiles.adjust = [0, this.sTiles.tiles.length];

                    for (var _r2 = 1; _r2 < 4; _r2++) {
                        this.sTiles.tiles[4][_r2] = false;
                    };

                    break;

                case 'bottom':
                    this.sTiles.pos = [coord[0] - 2, size];

                    for (var _r3 = 1; _r3 < 4; _r3++) {
                        this.sTiles.tiles[0][_r3] = false;
                    };

                    break;

                case 'right':
                    this.sTiles.pos = [size, coord[1] - 2];

                    for (var _c2 = 1; _c2 < 4; _c2++) {
                        this.sTiles.tiles[_c2][0] = false;
                    };

                    break;

                case 'left':
                    this.sTiles.pos = [0, coord[1] - 2];
                    this.sTiles.adjust = [this.sTiles.tiles[0].length, 0];

                    for (var _c3 = 1; _c3 < 4; _c3++) {
                        this.sTiles.tiles[_c3][4] = false;
                    };

                    break;
            }
        }
    }, {
        key: "pickTColors",
        value: function pickTColors() {
            var randomIDX = Math.floor(Math.random() * this.colorSet.length);

            if (this.colorHistory.length == this.colorSet.length) {
                this.colorHistory = [this.colorHistory[this.colorHistory.length - 1]];
            }

            for (var i = 0; i < this.colorHistory.length; i++) {
                if (this.colorHistory[i] == randomIDX) {
                    return this.pickTColors();
                }
            }

            this.colorHistory.push(randomIDX);
            return this.colorSet(this.colorHistory[randomIDX]);
        }
    }]);

    return Map;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
    function Maze(size) {
        _classCallCheck(this, Maze);

        this.map = [];
        this.size = size > 5 ? size : 5;
        this.start;
        this.end;
        this.directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    }

    _createClass(Maze, [{
        key: 'assemble',
        value: function assemble() {
            for (var c = 0; c < this.size; c++) {
                var row = [];

                for (var r = 0; r < this.size; r++) {
                    row.push({
                        'carve': [],
                        'visited': false
                    });
                }

                this.map.push(row);
            }

            this.carve(0, 0);
            this.pickEnds();
        }
    }, {
        key: 'carve',
        value: function carve(x, y) {
            this.map[y][x].visited = true;
            shuffle(this.directions);

            for (var i = 0; i < this.directions.length; i++) {
                var dir = this.directions[i],
                    newX = x + dir[0],
                    newY = y + dir[1],
                    inXBounds = newX < this.size && newX >= 0,
                    inYBounds = newY < this.size && newY >= 0;

                if (inXBounds && inYBounds && !this.map[newY][newX].visited) {
                    this.map[y][x].carve.push(dir);
                    this.carve(newX, newY);
                }
            }
        }
    }, {
        key: 'pickEnds',
        value: function pickEnds() {
            if (!this.start || !this.end) {

                var sides = [[0, null], [this.size - 1, null], [null, 0], [null, this.size - 1]],
                    mSize = this.size;

                var side = sides[Math.floor(Math.random() * sides.length)];

                for (var i = 0; i < side.length; i++) {
                    if (side[i] !== 0 && !side[i]) {
                        side[i] = Math.floor(Math.random() * (mSize - 2)) + 2;
                    }
                }

                var endTile = this.map[side[1]][side[0]];

                if (endTile && endTile.visited && !this.start) {
                    this.start = side;
                } else if (endTile && endTile.visited) {
                    this.end = side;
                }

                this.pickEnds();
            }
        }
    }]);

    return Maze;
}();

;

function shuffle(a) {
    for (var i = a.length - 1; i >= 0; i--) {
        var index = Math.floor(Math.random() * (i + 1)),
            temp = a[index];

        a[index] = a[i];
        a[i] = temp;
    }
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OverMenu = function () {
	function OverMenu(config, rCallback) {
		_classCallCheck(this, OverMenu);

		this.overlay = document.getElementById(config.overlay);
		this.title = document.getElementById(config.overTitle);
		this.menu = document.getElementById(config.overMenu);
		this.restartButton = document.getElementById(config.restart);
		this.homeButton = document.getElementById(config.home);
		this.restart = rCallback;
		this.oVal = .01;
		this.setMenu();
	}

	_createClass(OverMenu, [{
		key: 'setMenu',
		value: function setMenu(url) {
			var s = this;

			this.homeButton.onclick = function () {
				window.location.href = '/';
			};

			this.restartButton.onclick = function () {
				s.overlay.style.opacity = 0;
				s.menu.style.opacity = 0;
				s.title.style.display = 'none';
				s.oVal = .01;

				s.restart();
			};

			this.overlay.style.opacity = 0;
			this.menu.style.opacity = 0;
			this.overlay.style.display = 'initial';
			this.menu.style.display = 'none';
			this.title.style.display = 'none';
		}
	}, {
		key: 'showScreen',
		value: function showScreen() {
			var self = this;

			this.title.style.display = 'initial';
			this.menu.style.display = 'initial';

			window.requestAnimFrame(function () {
				self.animate();
			});
		}
	}, {
		key: 'animate',
		value: function animate() {
			var o = this.oVal;
			this.menu.style.opacity = o * 2 < 1 ? 0 * 2 : 1;
			this.overlay.style.opacity = o;
			this.oVal += .03;

			if (o < .5) {
				var self = this;
				window.requestAnimFrame(function () {
					self.animate();
				});
			}
		}
	}]);

	return OverMenu;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(initCoord, colors) {
        _classCallCheck(this, Player);

        this.coord = initCoord;
        this.speed = 8;
        this.maxDistance = 500;
        this.pointer = [null, null];
        this.dimen = {
            'width': 60,
            'height': 60
        };
        this.colors = colors;
        this.history = [];
        this.listen = false;
    }

    _createClass(Player, [{
        key: 'draw',
        value: function draw(ctx, offset, scale) {
            var x = this.coord[0] - this.dimen.width / 2 - offset[0],
                y = this.coord[1] - this.dimen.width / 2 - offset[1];

            ctx.save();
            ctx.fillStyle = this.colors.player;
            ctx.fillRect(x, y, this.dimen.width, this.dimen.height);
            ctx.restore();

            this.updateCoord(scale, offset, ctx);
        }
    }, {
        key: 'reSet',
        value: function reSet(keepHistory) {
            if (!keepHistory) {
                this.history = [];
            }

            this.listen = !this.listen;
            this.pointer = [null, null];
        }
    }, {
        key: 'listenForMovement',
        value: function listenForMovement() {
            if (!this.listen) {
                this.listen = true;
                return;
            }

            var self = this;

            document.addEventListener('mousemove', function (e) {
                if (self.listen) {
                    self.pointer = [e.pageX, e.pageY];
                };
            });

            document.addEventListener('mouseout', function (e) {
                self.pointer = [null, null];
            });
        }
    }, {
        key: 'handleHistory',
        value: function handleHistory(ctx, offset, scale) {
            var bounds = [window.innerWidth * -0.5, window.innerHeight * -0.5, window.innerWidth * 1.5, window.innerHeight * 1.5],
                c = this.coord;

            var novel = true;

            ctx.save();
            ctx.fillStyle = this.colors.history;

            for (var i = this.history.length - 1; i >= 0; i--) {
                var h = this.history[i],
                    x = h[0] - offset[0],
                    y = h[1] - offset[1],
                    inXBounds = x * scale > bounds[0] && x * scale < bounds[2],
                    inYBounds = y * scale > bounds[1] && y * scale < bounds[3];

                if (inXBounds && inYBounds) {
                    ctx.beginPath();
                    ctx.arc(x, y, 10, 0, 2 * Math.PI);
                    ctx.fill();
                }

                if (novel) {
                    var dist = Math.sqrt(Math.pow(c[0] - h[0], 2) + Math.pow(c[1] - h[1], 2));

                    novel = dist > 4;
                }
            }

            ctx.restore();

            if (novel) {
                this.history.push([this.coord[0], this.coord[1]]);
            }
        }
    }, {
        key: 'updateCoord',
        value: function updateCoord(scale, offset, ctx) {
            if (!this.pointer[0] || !this.pointer[1]) {
                return;
            };

            var maxDist = this.maxDistance,
                pointer = [this.pointer[0] / scale + offset[0], this.pointer[1] / scale + offset[1]],
                pCoord = [this.coord[0], this.coord[1]],
                xDist = pointer[0] - pCoord[0],
                yDist = pointer[1] - pCoord[1],
                dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)),
                speed = dist < maxDist ? this.speed * (dist / maxDist) : this.speed,
                angle = dist > 0 ? Math.asin(yDist / dist) : 0;

            var xVelocity = speed * Math.cos(angle),
                yVelocity = speed * Math.sin(angle);

            if (pointer[0] < this.coord[0]) {
                xVelocity *= -1;
            };

            this.coord[0] += xVelocity;
            this.coord[1] += yVelocity;
        }
    }]);

    return Player;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeTrial = function (_Game) {
	_inherits(TimeTrial, _Game);

	function TimeTrial(config) {
		_classCallCheck(this, TimeTrial);

		var _this = _possibleConstructorReturn(this, (TimeTrial.__proto__ || Object.getPrototypeOf(TimeTrial)).call(this, config));

		_this.clock = new Clock(config.clockID, config.addID);

		return _this;
	}

	_createClass(TimeTrial, [{
		key: "run",
		value: function run(maze) {
			if (!maze) {
				return;
			} else if (this.difficulty > 5) {
				this.clock.addTime(7 * 2);
			}

			this.clock.showTime();
			_get(TimeTrial.prototype.__proto__ || Object.getPrototypeOf(TimeTrial.prototype), "run", this).call(this, maze);
		}
	}, {
		key: "introLoop",
		value: function introLoop() {
			if (this.clock.isAdd) {
				this.clock.animAdd();
			}

			_get(TimeTrial.prototype.__proto__ || Object.getPrototypeOf(TimeTrial.prototype), "introLoop", this).call(this);
		}
	}, {
		key: "gameLoop",
		value: function gameLoop() {
			this.clock.tickTime();

			if (this.clock.outOfTime()) {
				this.player.listen = false;
				this.gameOver.showScreen();
				return;
			}

			_get(TimeTrial.prototype.__proto__ || Object.getPrototypeOf(TimeTrial.prototype), "gameLoop", this).call(this);
		}
	}, {
		key: "gameReset",
		value: function gameReset() {
			this.clock.reSet();
			_get(TimeTrial.prototype.__proto__ || Object.getPrototypeOf(TimeTrial.prototype), "gameReset", this).call(this);
		}
	}]);

	return TimeTrial;
}(Game);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TwoPlayer = function (_Game) {
	_inherits(TwoPlayer, _Game);

	function TwoPlayer(config, roomID) {
		_classCallCheck(this, TwoPlayer);

		var _this = _possibleConstructorReturn(this, (TwoPlayer.__proto__ || Object.getPrototypeOf(TwoPlayer)).call(this, config));

		_this.enemy = new Player([0, 0], {
			'player': 'gray',
			'history': 'gray'
		});

		_this.enemyFinish = false;
		_this.roomID = roomID;
		return _this;
	}

	_createClass(TwoPlayer, [{
		key: 'start',
		value: function start() {
			var initID = this.roomID.split('#')[0],
			    self = this;

			this.communicateMovement();

			if (initID == this.socket.id) {
				var data = {
					'size': this.difficulty,
					'room': this.roomID
				};

				this.socket.emit('requestMazeForRoom', data);
			}

			window.requestAnimFrame(function () {
				var w = self.canvas.width,
				    h = self.canvas.height;

				console.log(self);
				self.context.clearRect(0, 0, w, h);
			});
		}
	}, {
		key: 'segueLoop',
		value: function segueLoop() {
			if (this.enemy.coord[0] != this.map.start[0] || this.enemy.coord[0] != this.map.start[1]) {
				this.enemy.coord = [this.map.start[0], this.map.start[1]];
			};

			_get(TwoPlayer.prototype.__proto__ || Object.getPrototypeOf(TwoPlayer.prototype), 'segueLoop', this).call(this);
		}
	}, {
		key: 'gameLoop',
		value: function gameLoop() {
			if (this.enemy.finish) {
				this.player.listen = false;
				this.gameOver.showScreen();
				return;
			}

			var sendData = {
				'room': this.roomID,
				'coord': this.player.coord
			};

			this.socket.emit('updatePlayerCoord', sendData);
			_get(TwoPlayer.prototype.__proto__ || Object.getPrototypeOf(TwoPlayer.prototype), 'gameLoop', this).call(this);
		}
	}, {
		key: 'drawScreen',
		value: function drawScreen(offset) {
			var ctx = this.context,
			    scale = this.scale;

			this.map.draw(ctx, offset, scale);
			this.enemy.handleHistory(ctx, offset, scale);
			this.player.handleHistory(ctx, offset, scale);
			this.enemy.draw(ctx, offset, scale);
			this.player.draw(ctx, offset, scale);
		}
	}, {
		key: 'win',
		value: function win() {
			var id = this.roomID;
			this.socket.emit("playerWin", id);
			this.player.listen = false;
		}
	}, {
		key: 'communicateMovement',
		value: function communicateMovement() {
			var self = this;

			this.socket.on('enemyUpdate', function (coord) {
				self.enemy.coord = coord;
			});

			this.socket.on('enemyFinish', function () {
				self.enemyFinish = false;
			});
		}
	}]);

	return TwoPlayer;
}(Game);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewPort = function () {
    function ViewPort(maxDist) {
        _classCallCheck(this, ViewPort);

        this.coord = [0, 0];
        this.maxDist = maxDist;
        this.zChange = .9;
        this.zMax;
    }

    _createClass(ViewPort, [{
        key: "offset",
        value: function offset(pCoord, scale, cMax) {
            var center = this.getCenter(scale),
                maxDist = cMax ? cMax : this.maxDist,
                xDist = pCoord[0] - center[0],
                yDist = pCoord[1] - center[1],
                distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

            if (distance > maxDist) {
                var angle = Math.asin(yDist / distance);
                var xOffset = Math.cos(angle) * maxDist,
                    yOffset = Math.sin(angle) * maxDist;

                if (pCoord[0] < center[0]) {
                    xOffset *= -1;
                }

                var mX = center[0] + xOffset,
                    mY = center[1] + yOffset;

                this.coord[0] += pCoord[0] - mX;
                this.coord[1] += pCoord[1] - mY;
            }

            if (!cMax && this.zMax) {
                this.zMax = null;
            }
            return this.coord;
        }
    }, {
        key: "zoom",
        value: function zoom(zCoord, scale, percent) {
            var vCoord = this.getCenter(scale),
                xDist = zCoord[0] - vCoord[0],
                yDist = zCoord[1] - vCoord[1],
                dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

            if (!this.zMax) {
                this.zMax = dist - this.maxDist;
            };

            var p = 1 - percent > 0 ? 1 - percent : 0,
                d = this.zMax * p;

            var cMax = d > this.maxDist ? d : this.maxDist;
            return this.offset(zCoord, scale, cMax);
        }
    }, {
        key: "getCenter",
        value: function getCenter(scale) {
            return [this.coord[0] + window.innerWidth / 2 / scale, this.coord[1] + window.innerHeight / 2 / scale];
        }
    }]);

    return ViewPort;
}();
//# sourceMappingURL=app.js.map
