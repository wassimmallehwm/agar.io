
// =============================
// ===========DRAWING===========
// =============================

function draw(){

    //reset the translation back to default
    context.setTransform(1,0,0,1,0,0);

    //clear the screen out of the old stuff
    context.clearRect(0, 0, canvas.width, canvas.height);

    //clamp the camera to the player
    const camX = -player.locX + canvas.width/2
    const camY = -player.locY + canvas.height/2
    //allows to move the canvas
    context.translate(camX, camY);

    

    //draw all the players
    players.forEach((p) => {
        context.beginPath();
        context.fillStyle = p.color;
        //creating the circle
        context.arc(p.locX, p.locY, p.radius, 0, Math.PI*2);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = p.color;
        context.stroke();
    })

    
    //draw all the orbs
    orbs.forEach((orb) => {
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI*2);
        context.fill();
    })
    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (event) => {
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        //mouse is in the lower right
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        //mouse is in the lower left
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        //mouse is in the upper left
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        //mouse is in the upper right
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
    }

    player.xVector = xVector;
    player.yVector = yVector;

       
})