"use strict";

class HomeMenu {

	constructor(config, startCallbacks){
		this.title = document.getElementById(config.titleID);
		this.menu =  document.getElementById(config.menuID);
		this.timeTrial =  document.getElementById(config.timeID);
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
	
	init(canvasID){
		const self = this;

		this.animInfo = {
			'titleHeight': 0,
			'menuHeight': 0,
			'rate': 3,
			'uiDone': false,
			'connecting': false,
			'conFrame': 0,
		}

		this.socket.on('backgroundMaze', function(maze){
			self.background = new Background(canvasID, maze);
			self.setMenu();
		});
	}

	setMenu(){
		this.menu.style.display = 'initial';
		this.title.style.display = 'initial';
		this.connect.style.display = 'none'
		this.title.style.height = 0;

		const s = this,
			  menuOffset = this.menu.offsetHeight,
			  menuHeight = (menuOffset/window.innerHeight) * 100;

		this.timeTrial.onclick = function(){
			s.closeUI();
			s.timeStart();
		}

		this.back.onclick = function(){
			s.connect.style.display = 'none'
			s.twoPlayer.disabled = false;
			s.timeTrial.disabled = false;
			s.twoPlayer.style.display = 'initial';
			s.timeTrial.style.display = 'initial';
			s.animInfo
		}

		this.twoPlayer.onclick = function(){
			s.socket.emit('connectTwoP');
			s.twoPlayer.disabled = true;
			s.timeTrial.disabled = true;
			s.twoPlayer.style.display = 'none';
			s.timeTrial.style.display = 'none';
			s.connect.style.display = 'initial'
			s.animInfo.connecting = true;
		}

		this.socket.on('connectedTwoP', function(roomID){
			s.closeUI();
			s.twoStart(roomID);
		});

		this.menu.style.top = "-" + menuHeight.toString() + "%"
		this.animInfo.menuHeight = menuHeight * -1;		
	}

	closeUI(){
		this.menu.style.display = 'none';
		this.title.style.display = 'none';
	}

	animate(){
		if (!this.background){ return };
		if (!this.animInfo.uiDone){
			this.revealUI();
		}

		if (this.connect){
			this.conElipse();
		}
		this.background.scaleMaze();
	}

	conElipse(){
		const cHTML = this.connect.innerHTML;
		if (this.animInfo.conFrame % 20 == 0){
			if (cHTML.length == "connecting".length + 3){
				this.connect.innerHTML = "connecting";
			}else{
				this.connect.innerHTML += ".";
			}
		}

		this.animInfo.conFrame++;
	}

	revealUI(){
		const tHeight = this.animInfo.titleHeight,
		      mHeight = this.animInfo.menuHeight,
			  rDegree = (tHeight * .1) * 360,
			  menuOffset = this.menu.offsetHeight,
		      menuHeight = (menuOffset/window.innerHeight) * 100;

		if (rDegree < 361){
			this.growTitle(rDegree);
		}else if (mHeight < 50 - menuHeight/2){
			this.dropMenu(menuHeight);
		}else{
			this.animInfo.uiDone = true;
		}
	}

	growTitle(rDegree){
		const self = this,
		      tHeight = this.animInfo.titleHeight,
			  newHeight = tHeight.toString() + '%',
			  newDegree = 'rotate(' + rDegree.toString() + 'deg)',
			  top = 50 - (40 * tHeight * .1),
			  newTop = top.toString() + '%';

		this.title.style.height = newHeight;
	    this.title.style.transform = newDegree;
	    this.title.style.top = newTop;

    	this.animInfo.titleHeight += 0.4;
	}

	dropMenu(menuHeight){
		const self = this,
		      mHeight = this.animInfo.menuHeight;

		this.menu.style.top = mHeight.toString() + '%';
		this.animInfo.menuHeight += this.animInfo.rate;
		this.animInfo.rate *= .98;
	}
}