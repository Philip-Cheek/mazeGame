'use strict';

const config = {
  'canvasID': 'canvas',
  'titleID': 'title',
  'menuID': 'menu',
  'timeID': 'time',
  'twoID': 'two',
  'clockID': 'clock',
  'winID': 'win',
  'loseID': 'lose',
  'overMenu': 'overMenu',
  'overlay': 'overlay',
  'home': 'home',
  'restart': 'restart',
  'addID': 'add',
  'connectID': 'connecting',
  'backID': 'back',
  'scoreLeft': 'left',
  'scoreRight': 'right',
  'scoreBoard': 'score',
  'socket': io.connect()
};

window.onload = function(){
  new App(config).run();
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();