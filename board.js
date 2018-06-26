class Board {
    constructor() {
        this.grid = this.newGameGrid();
//        this.ctx = ctx;
//        this.counter = 0;          // Dictates flow of loop
//        this.isProcessing = false; // Dirty Flag, will not recieve new input if processing a slide
//        this.dir = undefined;
//        this.dirEnum = {LEFT:65, RIGHT:68, UP:87, DOWN:83}; 
        this.step = 1;
    }
    
    movementRemaining() {
        for(var i = 0; i < this.grid.length; i++) {
            var cell = this.grid[i];
            if(cell.x !== cell.rX || cell.y != cell.rY) {
                return true;
            }
        }
        return false;
    }
    
    
    // Merging
    mergeLeft() {
        this.grid.sort(this.sortGridRight);
        for(var i = this.grid.length - 1; i > 0; i--) {
            var curr = this.grid[i];
            var next = this.grid[i-1];
            if(curr.x + 1 === next.x && curr.y === next.y) {
                if(curr.value === next.value && !curr.hasMerged) {
                    next.value *= 2;
                    next.hasMerged = true;
                    this.grid.splice(i,1);
                }
            }
        }
    }
    mergeRight() {
        this.grid.sort(this.sortGridLeft);
        for(var i = this.grid.length - 1; i > 0; i--) {
            var curr = this.grid[i];
            var next = this.grid[i-1];
            if(curr.x - 1 === next.x && curr.y === next.y) {
                if(curr.value === next.value && !curr.hasMerged) {
                    next.value *= 2;
                    next.hasMerged = true;
                    this.grid.splice(i,1);
                }
            }
        }
    }
    mergeUp() {
        this.grid.sort(this.sortGridDown);
        for(var i = this.grid.length - 1; i > 0; i--) {
            var curr = this.grid[i];
            var next = this.grid[i-1];
            if(curr.x === next.x && curr.y + 1 === next.y) {
                if(curr.value === next.value && !curr.hasMerged) {
                    next.value *= 2;
                    next.hasMerged = true;
                    this.grid.splice(i,1);
                }
            }
        }
    }
    mergeDown() {
        this.grid.sort(this.sortGridUp);
        for(var i = this.grid.length - 1; i > 0; i--) {
            var curr = this.grid[i];
            var next = this.grid[i-1];
            if(curr.x === next.x && curr.y - 1 === next.y) {
                if(curr.value === next.value && !curr.hasMerged) {
                    next.value *= 2;
                    next.hasMerged = true;
                    this.grid.splice(i,1);
                }
            }
        }
    }
    
    // Sliding
    slideLeft() {
        this.grid.sort(this.sortGridLeft);
        for(var i = this.grid.length-1; i >= 0; i--) {
            var curr = this.grid[i];
            if(curr.x === 0) continue;
            if(this.checkCoordinate(curr.x-1, curr.y)) {
                curr.x -= this.step;
            } 
        }
    } 
    slideRight() {
        this.grid.sort(this.sortGridRight);
        for(var i = this.grid.length-1; i >= 0; i--) {
            var curr = this.grid[i];
            if(curr.x === 3) continue;
            if(this.checkCoordinate(curr.x+1, curr.y)) {
                curr.x += this.step;
            } 
        }
    }
    slideUp() {
        this.grid.sort(this.sortGridUp);
        for(var i = this.grid.length-1; i >= 0; i--) {
            var curr = this.grid[i];
            if(curr.y === 0) continue;
            if(this.checkCoordinate(curr.x, curr.y-1)) {
                curr.y -= this.step;
            } 
        }
    }
    slideDown() {
        this.grid.sort(this.sortGridDown);
        for(var i = this.grid.length-1; i >= 0; i--) {
            var curr = this.grid[i];
            if(curr.y === 3) continue;
            if(this.checkCoordinate(curr.x, curr.y+1)) {
                curr.y += this.step;
            } 
        }
    }
    
    newGameGrid() {
        this.grid = new Array(0);
        this.spawnCell();
        this.spawnCell();
//        console.log(this.grid);
    }
    
    checkCoordinate(x,y) {
        for(var i = 0; i < this.grid.length - 1; i++) {
            var cell = this.grid[i];
            if(cell.x === x && cell.y === y){ return false; } 
        } return true;
    }
    
    spawnCell() {
        if(this.grid.length === 16) {
            console.log("Max limit reached");
            return;
        }
        var x = Math.floor((Math.random() * 4));;
        var y = Math.floor((Math.random() * 4));;
        var onOnccupiedSpace = false;
//        if (this.grid.length === 16) return false;
        // Will "search" for an open space until one is found.
        do {
            onOnccupiedSpace = false;
            x = Math.floor((Math.random() * 4));
            y = Math.floor((Math.random() * 4));
            for(var i = 0; i < this.grid.length; i++) {
                if((this.grid[i].x === x) && (this.grid[i].y === y)) {
                    onOnccupiedSpace = true;
                }
            }
        } while(onOnccupiedSpace);
//        console.log("x: " + x + "y: "+ y);
        this.grid.push(new Cell(x,y));
    }
    
    // Sorting
    sortGridLeft(cellA, cellB) {
        // Higher 'y' means the cell is closer to the bottom right corner.
        if(cellA.y > cellB.y) {return 1;}
        // Lower 'y' means the cell is closer to the top left corner.
        if(cellA.y < cellB.y) {return -1;}
        // if in the same row, check the columns.
        if(cellA.y == cellB.y) {
            // Right most is closer to the bottom right corner.
            if(cellA.x > cellB.x) return 1;
            else return -1;
        }
        // This should never happen!
        if(cellA.x === cellB.x && cellA.y === cellB.y){
            console.log("When sorting, two cells were in the same place!");
            return 0;
        } 
    } 
    sortGridRight(cellA, cellB) {
        // Higher 'y' means the cell is closer to the bottom right corner.
        if(cellA.y > cellB.y) {return 1;}
        // Lower 'y' means the cell is closer to the top left corner.
        if(cellA.y < cellB.y) {return -1;}
        // if in the same row, check the columns.
        if(cellA.y == cellB.y) {
            // Right most is closer to the bottom right corner.
            if(cellA.x > cellB.x) return -1;
            else return 1;
        }
        // This should never happen!
        if(cellA.x === cellB.x && cellA.y === cellB.y){
            console.log("When sorting, two cells were in the same place!");
            return 0;
        } 
    } 
    sortGridDown(cellA, cellB) {
        // Higher 'y' means the cell is closer to the bottom right corner.
        if(cellA.x > cellB.x) {return 1;}
        // Lower 'y' means the cell is closer to the top left corner.
        if(cellA.x < cellB.x) {return -1;}
        // if in the same row, check the columns.
        if(cellA.x == cellB.x) {
            // Right most is closer to the bottom right corner.
            if(cellA.y > cellB.y) return -1;
            else return 1;
        }
        // This should never happen!
        if(cellA.x === cellB.x && cellA.y === cellB.y){
            console.log("When sorting, two cells were in the same place!");
            return 0;
        } 
    } 
    sortGridUp(cellA, cellB) {
        // Higher 'y' means the cell is closer to the bottom right corner.
        if(cellA.x > cellB.x) {return -1;}
        // Lower 'y' means the cell is closer to the top left corner.
        if(cellA.x < cellB.x) {return 1;}
        // if in the same row, check the columns.
        if(cellA.x == cellB.x) {
            // Right most is closer to the bottom right corner.
            if(cellA.y > cellB.y) return 1;
            else return -1;
        }
        // This should never happen!
        if(cellA.x === cellB.x && cellA.y === cellB.y){
            console.log("When sorting, two cells were in the same place!");
            return 0;
        } 
    }
}