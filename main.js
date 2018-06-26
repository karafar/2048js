// Setup of canvas and drawing context
var canvas = document.getElementById("canvas");
var height = canvas.height;
var width = canvas.width;
var ctx = canvas.getContext("2d");

// Initialize game
var game = new Game(ctx);
game.board.newGameGrid();

// Input management
window.addEventListener("keydown",directInput);
function directInput(e) {
    var keyCode = e.keyCode;
    if(game.process === game.pEnum.INPUT) {
        // w/up arrow
        if(keyCode == 87 || keyCode == 38){
            game.dir = game.dirEnum.UP;
        }
        // a/left arrow
        if(keyCode == 65 || keyCode == 37) {
            game.dir = game.dirEnum.LEFT;
        }
        // d/right arrow
        if(keyCode == 68 || keyCode == 39) {
            game.dir = game.dirEnum.RIGHT;
        }
        // s/down arrow
        if(keyCode == 83 || keyCode == 40){
            game.dir = game.dirEnum.DOWN;
        }
        
    }
    // n - for new game
    if(keyCode === 78 && (game.process === game.pEnum.INPUT || game.process === game.pEnum.GAME_OVER)) {
            game.newGame();
        }
};


// Framerate control for gameloop
var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;

function startGameLoop(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    gameLoop();
}

// We draw a frame after a given # of milliseconds.
// We draw the changes, and we update the games logic.
function gameLoop() {
    // request another frame
    requestAnimationFrame(gameLoop);
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        if(game.process === game.pEnum.GAME_OVER) {
            game.gameOver();
        } else { 
            game.drawBackdrop();
            game.update();
            game.render();
        }    
    }
}
startGameLoop(55);