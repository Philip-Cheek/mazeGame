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
        'socket': io.connect()
      };

window.onload = function(){
  const app = new App(config);
  app.run();
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();