"use strict";

class OverMenu {

	constructor(config, rCallback){
		this.overlay = document.getElementById(config.overlay);
		this.title = document.getElementById(config.overTitle);
		this.menu = document.getElementById(config.overMenu);
		this.restartButton = document.getElementById(config.restart);
		this.homeButton = document.getElementById(config.home);
		this.restart = rCallback;
		this.oVal = .01;
		this.setMenu();

	}

	setMenu(url){
		const s = this;

		this.homeButton.onclick = function(){
			window.location.href = '/';
		}

		this.restartButton.onclick = function(){
			s.overlay.style.opacity = 0;
			s.menu.style.opacity = 0;
			s.title.style.display = 'none';
			s.oVal = .01;

			s.restart();
		}

		this.overlay.style.opacity = 0;
		this.menu.style.opacity = 0;
		this.overlay.style.display = 'initial';
		this.menu.style.display = 'none';
		this.title.style.display = 'none';
	}

	showScreen(){
		const self = this;

		this.title.style.display = 'initial';
		this.menu.style.display = 'initial'

		window.requestAnimFrame(function(){
			self.animate();
		});
	}

	animate(){
		const o = this.oVal;
		this.menu.style.opacity = o * 2 < 1 ? 0 * 2 : 1;
		this.overlay.style.opacity = o;
		this.oVal += .03;
		
		if (o < .5){
			const self = this;
			window.requestAnimFrame(function(){
				self.animate();
			});
		}
	}

}