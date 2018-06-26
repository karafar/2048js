class Game {
    constructor(ctx) {
        this.board = new Board();           // Main game board
        this.pseudoBoard = new Board();     // For comparisons, e.g., detecting game over
        this.pEnum = {INPUT:0, SLIDE:1, R_SLIDE:2, MERGE:3, R_MERGE:4, SPAWN_CELL:5, RESET:6, GAME_OVER:7,};
        this.process = this.pEnum.INPUT;    // Intial setting - set for game to recieve user input
        this.dirEnum = {HALT: 0, LEFT:65, RIGHT:68, UP:87, DOWN:83}; 
        this.dir = this.dirEnum.HALT;       // No direction is applied, i.e. sliding is halted
        this.ctx = ctx;                     // drawing context for canvas
        this.insertCounter = 1;
        this.inserting = false;
    }
    
    drawGrid() {
        var stop = this.board.grid.length;
        if(this.process === this.pEnum.SPAWN_CELL && this.inserting) stop = this.board.grid.length - 1;
        for(var i = 0; i < stop; i++) {
            var cell = this.board.grid[i];
            cell.drawCell(this.ctx);
        }
    }
    
    drawBackdrop() {
        // main background
        this.ctx.fillStyle = "rgba(52, 73, 94, 1.0)";
        this.ctx.fillRect(0,0, height, width);
        // Draws lines/borders
        for(var i = 0; i < 5; i++) {
            this.ctx.fillStyle = "rgba(44, 62, 80, 1.0)";
            this.ctx.fillRect(i*97.5,0, 10, 400);
            this.ctx.fillRect(0,i*97.5, 400, 10);
        }
    }
    
    // Draws game over screen
    gameOver() {
        this.ctx.fillStyle = "rgb(44, 62, 80)";
        this.ctx.fillRect(0,0,height,width);
        this.ctx.fillStyle = "white";
        this.ctx.font ="50px Georgia";
        this.ctx.fillText("Game Over", 200, 150);
        this.ctx.font ="30px Georgia";
        this.ctx.fillText("Press 'N' to start a new game!", 200, 200);
    }
    
    // Renders tiles, including animation.
    render() {
         for(var i = 0; i < this.board.grid.length; i++) {
            var cell = this.board.grid[i];
            var step = .25;
            if(cell.x > cell.rX) cell.rX += step;
            if(cell.x < cell.rX) cell.rX -= step;
            if(cell.y < cell.rY) cell.rY -= step;
            if(cell.y > cell.rY) cell.rY += step;
            
        }
        this.drawGrid();
    }

    
    // Provides animation for the insertion of a tile.
    insertTile() {
        var cell = this.board.grid[this.board.grid.length-1];
        this.ctx.fillStyle = cell.color;
        cell.draw(this.ctx, this.insertCounter);
        this.insertCounter++;
    }
    
    
    /*
        This thing grew a bit bigger than expected, but it captured my thought process. 
        Many things will be refactored one day!
        
        Anyway, once the game recieves input, a series of actions occur.
        First, we slide the board. The direction was set to a field by main.js.
        Second, we allow the game to render the changes to the screen.
        Third, we merge the tiles (which requires some sliding).
        Fourth, we render the changes of the merge.
        Fifth, if applicable new cell is inserted, and rendered to the screen over 6 frames.
        Finally, we check for game over/victory. If neither apply, then we revert to the input stage.
    */
    update() {
        switch(this.process) {
            case this.pEnum.INPUT:
                if(this.dir !== this.dirEnum.HALT) {
                    this.copyBoard();
                    this.process = this.pEnum.SLIDE;
                }
                break;
            case this.pEnum.SLIDE:
                    this.slide();
                    this.slide();
                    this.slide();
                    this.process = this.pEnum.R_SLIDE;
                break;
            case this.pEnum.R_SLIDE:
                if(!this.board.movementRemaining()) 
                    this.process = this.pEnum.MERGE;
                break;
            case this.pEnum.MERGE:
                this.merge();
                this.slide();
                this.slide();
                this.slide();
                this.process = this.pEnum.R_MERGE;
                break;
            case this.pEnum.R_MERGE:
                if(!this.board.movementRemaining()) { 
                    this.process = this.pEnum.SPAWN_CELL;
                }
                break;
            case this.pEnum.SPAWN_CELL:
                if(!this.inserting) {
                     if(!this.boardsEqual()) {
                        this.board.spawnCell();
                        this.inserting = true;
                     } else {
                         this.process = this.pEnum.RESET;
                     }
                }
                if(this.inserting) {
                    this.insertTile();
                    if(this.insertCounter === 6)
                        this.inserting = false;
                }            
                if(this.insertCounter === 6 && !this.inserting){
                    this.process = this.pEnum.RESET;
                    this.insertCounter = 1;
                    this.inserting = false;
                }
                break;
            case this.pEnum.RESET:
//                if(this.checkWin())
                if(this.board.grid.length === 16) {
                    if(this.checkGameOver()) {
                        this.process = this.pEnum.GAME_OVER;
                        return;
                    }
                }
                this.reset();
                break;
        }
    }
    
    // Sets up a new game
    newGame(){
        this.board.newGameGrid();
        this.pseudoBoard = new Board();
        this.process = this.pEnum.INPUT;
        this.dir = this.dirEnum.HALT;
        this.insertCounter = 1;
        this.inserting = false;
    }
    
    // Resets game settings for the next round
    reset() {
        this.dir = this.dirEnum.HALT;
        this.process = this.pEnum.INPUT;
        for(var i = 0; i < this.board.grid.length - 1; i++) {
                var cell = this.board.grid[i];
                cell.hasMerged = false;
            }
    }
    
    // Returns true when game is over.
    // If we can merge in all four direcitons with no change, then its game over.
    checkGameOver() {
        this.copyBoard();
        this.pseudoBoard.mergeLeft();
        this.pseudoBoard.mergeRight();
        this.pseudoBoard.mergeUp();
        this.pseudoBoard.mergeDown();
        if(this.boardsEqual()) {
            return true;
        } else { 
            return false;
        }
    }
    
    // If a tile has 2048, then the user has won.
    checkWin() {
        for(var i = 0; i < this.board.grid.length; i++) {
            var cell = this.board.grid[i];
            if(cell.value === 2048) return true;
        }
        return false;
    }
    
    // Returns true if boards are equal to each other.
    boardsEqual() {
        if(this.pseudoBoard.grid.length !== this.board.grid.length) return false;
        this.pseudoBoard.grid.sort(this.pseudoBoard.sortGridLeft);
        this.board.grid.sort(this.board.sortGridLeft);
        for(var i = 0; i < this.board.grid.length; i++) {
            var cellA = this.board.grid[i];
            var cellB = this.pseudoBoard.grid[i];
            if(cellA.x !== cellB.x || cellA.y !== cellB.y || cellA.value !== cellB.value) {
                return false;
            }
        }
        return true;
    }
    
    // Copys the game board over to the psuedoboard.
    copyBoard() {
        this.pseudoBoard.grid = [];
        for(var i = 0; i < this.board.grid.length; i++) {
            var cellA = this.board.grid[i];
            var cellB = new Cell(cellA.x, cellA.y);
            cellB.value = cellA.value;
            this.pseudoBoard.grid.push(cellB);
        }
    }
    
    slide() {
        if(this.dir === this.dirEnum.LEFT) {
            this.board.slideLeft();
        }
        if(this.dir === this.dirEnum.RIGHT) {
            this.board.slideRight();
        }
        if(this.dir === this.dirEnum.UP) {
            this.board.slideUp();
        }
        if(this.dir === this.dirEnum.DOWN) {
            this.board.slideDown();
        }
    }
    
    merge() {
        if(this.dir === this.dirEnum.LEFT) {
            this.board.mergeLeft();
        }
        if(this.dir === this.dirEnum.RIGHT) {
            this.board.mergeRight();
        }
        if(this.dir === this.dirEnum.UP) {
            this.board.mergeUp();
        }
        if(this.dir === this.dirEnum.DOWN) {
            this.board.mergeDown();
        }
    }
}