
class Cell {
    constructor(x, y) {
        this.x = x;     // current x value
        this.y = y;     // current y value
        this.rX = x;  // render x - where x is rendered to the screen
        this.rY = y;  // render y
        this.value = 2;
        this.color = this.setColor();
        this.hasMerged = false;
    }
    
    // Given the numerical value of the cell, apply a color to it.
    setColor() {
        switch(this.value) {
        case 2:
            return "rgba(26, 188, 156, 1.0)";
            break;
        case 4:
            return "rgba(241, 196, 15, 1.0)";
            break;
        case 8:
            return "rgba(52, 152, 219,1.0)";
            break;
        case 16:
            return "rgba(231, 76, 60,1.0)";
            break;
        case 32:
            return "rgba(155, 89, 182,1.0)";
            break;
        case 64:
            return "rgba(189, 195, 199,1.0)";
            break;
        case 128:
            return "rgba(39, 174, 96,1.0)";
            break;
        case 256:
            return "rgba(211, 84, 0,1.0)";
            break;
        case 512:
            return "rgba(83, 82, 237,1.0)";
            break;
        case 1024:
            return "rgba(196, 229, 56,1.0)";
            break;
        case 2048:
            return "rgba(192, 57, 43,1.0)";
            break;
        default:
            return "Black";
        }
    }
    
    drawCell(ctx){
        if(this.value == 0) return;
        // The canvas is 400x400. The borders are 10px thick, so now we have 350x350 of usuable space.
        // We have 350/4 = 87.5. Which gives us an approximate distance between the boxes on the canvas.
        var xApprox = Math.floor(this.rX*87.5);
        var yApprox = Math.floor(this.rY*87.5);
        // The gap centers the square within the borders.
        // The gap grows linearly as get farther away from the origin.
        // e.g., The 2nd box in the top row has a 20px offset. 10 for the outer border, and 10 for the previous square.
        var gapX = (this.rX + 1) * 10;
        var gapY = (this.rY + 1) * 10;
        // We add the approximation and the gap together to get the true placement of the cell.
        var x = xApprox + gapX;
        var y = yApprox + gapY;
        ctx.fillStyle = this.setColor();
        ctx.fillRect(x, y, 87.5, 87.5);

        // To center something within a square, we take the squares position, and add half it's height
        // and width to the centered item. 
        var textX = x + 87.5/2;
        // Text is actually drawn from the bottom, and oddly enough the height
        // isn't actually 38px. After some testing, its true height is about 72% of what we defined, aprox. 27.
        // We need to add half that to textY to center the the text.
        var textY = y + 13 + 87.5/2;

        ctx.fillStyle = "white";
        ctx.font="38px Verdana";
        ctx.textAlign="center"; 
        ctx.fillText(this.value, textX, textY);
    }
    
    /*
        This is incredible similar to drawCell(). This function draws a larger and larger squares over 6 frames.
        This creates the animation of a spawning cell.
        @scale This is a parameter than indicates what frame we are currently on which then determines the size of the square.
    */
    draw(ctx, scale){
        if(this.value == 0) return;
        var xApprox = Math.floor(this.rX*87.5);
        var yApprox = Math.floor(this.rY*87.5);
        var gapX = (this.rX + 1) * 10;
        var gapY = (this.rY + 1) * 10;
        var x = xApprox + gapX;
        var y = yApprox + gapY;
        ctx.fillStyle = this.setColor();
        ctx.fillRect(x, y, 14.5*scale, 14.5*scale);

    }
}