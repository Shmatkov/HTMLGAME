var menusound;
var clientX;
var clientY;

window.onload = function () {

    document.getElementById("newgame").onclick = function () {
        document.getElementById("div").style.visibility = "visible";
        document.getElementById("menu").style.visibility = "hidden";
        game();
    };

    menusound = new Audio('sounds/menu_bg_music.ogg');
    menusound.volume = 0.8;
    menusound.play();

    document.addEventListener('mousedown', function (event) {
        mousedownq = true;
    });

    document.addEventListener('mouseup', function (event) {
        mousedownq = false;
    });

    document.addEventListener('touchstart', function (event) {
        mousedownq = true;
    });

    document.addEventListener('touchend', function (event) {
        mousedownq = false;
    });

    document.addEventListener('mousemove', function (event) {
        clientX = event.clientX;
        clientY = event.clientY;
    });

    document.addEventListener('touchmove', function (event) {
        clientX = event.clientX;
        clientY = event.clientY;
    });


};

window.addEventListener('keydown', doKeyDown, true);
function doKeyDown(evt) {
    switch (evt.keyCode) {
        case 38:
            if (gg_posY > radius) {
                gg_posY -= speed;
            }
            break;
        case 40:
            if (gg_posY < canvasHeight - radius) {
                gg_posY += speed;
            }
            break;
        case 37:
            if (gg_posX > radius) {
                gg_posX -= speed;
            }
            break;
        case 39:
            if (gg_posX < canvasWidth - radius) {
                gg_posX += speed;
            }
            break;
    }
}