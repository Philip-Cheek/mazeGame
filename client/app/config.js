'use strict';

const config = {
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