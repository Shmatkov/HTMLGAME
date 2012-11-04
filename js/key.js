var Key = (function() {
  var pressed = {};
  
  function isDown(keyCode) {
    return pressed[keyCode] === true;
  }
  
  function down(keyCode) {
    pressed[keyCode] = true;
  }
  
  function up(keyCode) {
    delete pressed[keyCode];
  }
  
  return {
    SPACE: 32,
    
    LEFT:  37,
    UP:    38,
    RIGHT: 39,
    DOWN:  40,
    
    isDown: isDown,
    down:   down,
    up:     up
  };
})();

function test() {
          return 1+1;

}