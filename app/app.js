window.onload = function(){
    // const game = new Game('canvas');
    const hConfig = {
    	'canvasID': 'canvas', 'titleID': 'title',
    	'menuID': 'menu', 'startID': 'start'
    }, homePage = new HomePage(hConfig);

    homePage.init();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();