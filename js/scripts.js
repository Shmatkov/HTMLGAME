var step = 0;
var speed1 = 4;
var speed2 = speed1 * 0.7;
var radius = 30;
var canvasWidth, canvasHeight;
var gg_hp = 100;
var score = 0;
var weapon = 'Дедова быстрозарядка';
var level = '1: Адское пастбище';
var count = 7;
var enemies = [];
var bullets = [];
var enspd = 1.5;
var mousedownq = false;

document.body.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);

function game() {
    var canvas = document.getElementById('game');
    var c = canvas.getContext('2d');
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    var gg_posX = canvasWidth / 2 - 30;
    var gg_posY = canvasHeight / 2 - 40;
    enCreate();

    var FPS = 25;
    setInterval(function () {
        update();
        draw();
    }, 1000 / FPS);

    function update() {
        step++;
        enMove();
        dmg();
        movegg();
        fire();
        borders();
        movebullets();
        SearchCollisions();
        Overflows();
        if (enemies.length == 0) { enCreate(); }
        if (gg_hp < 0) gg_hp = 0;
    }

    function draw() {
        c.clearRect(0, 0, canvasWidth, canvasHeight);
        c.font = "20pt Arial";
        c.fillStyle = 'Black';
        drawEnemy();
        movesCirle();
        shootsCircle();
        drawbullets();
        gg();
        GUI();
    }

    function gg() {
        var gg_pic = new Image();
        gg_pic.src = 'assets/gg_right.png';

        gg_pic.onload = function () {
            c.drawImage(gg_pic, gg_posX, gg_posY);
        }
    }

    function GUI() {
        // Score
        c.font = "20pt Arial";
        c.fillStyle = 'Black';
        c.fillText('Ваш счёт: ' + score, 35, 35);
        c.fillText(bullets.length, 35, 60);
        c.fillText(enemies.length, 35, 85);
        // HP
        c.fillText('HP: ', 280, 35);
        c.fillRect(335, 10, 110, 30);
        c.fillStyle = 'White';
        c.fillRect(340, 15, gg_hp, 20);
        // Weapon
        c.fillStyle = 'Black';
        c.font = "15pt Arial";
        c.fillText('Оружие: ' + weapon, 480, 30);
        c.fillText('Уровень ' + level, 490, 570);
    }

    function Enemy(en_posXp, en_posYp, isSpawnp, enHPp) {
        this.en_posX = en_posXp;
        this.en_posY = en_posYp;
        this.isSpawn = isSpawnp;
        this.enHP = enHPp;
    }

    function enCreate() {
        for (var i = 0; i < count; i++) {
            var r1 = Math.random() * 100 + 1;
            var r2 = Math.random() * 100 + 1;
            var t_posX;
            var t_posY;
            if (r1 > 50 && r2 > 50) {
                t_posX = getRandomInt(-100, 0);
                t_posY = getRandomInt(-100, 700);
            }
            if (r1 < 50 && r2 > 50) {
                t_posX = getRandomInt(800, 900);
                t_posY = getRandomInt(-100, 700);
            }
            if (r1 < 50 && r2 < 50) {
                t_posX = getRandomInt(-100, 900);
                t_posY = getRandomInt(-100, 0);
            }
            if (r1 > 50 && r2 < 50) {
                t_posX = getRandomInt(-100, 900);
                t_posY = getRandomInt(600, 700);
            }
            enemies.push(new Enemy(t_posX, t_posY, 1, 100));
        }
    }

    function drawEnemy() {
        var enemy_pic = new Image();
        enemy_pic.src = 'assets/enemy.png';
        enemy_pic.onload = function () {
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].isSpawn == 1) {
                    c.drawImage(enemy_pic, enemies[i].en_posX, enemies[i].en_posY);
                }
            }
        }
    }

    function enMove() {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].en_posX < gg_posX) {
                enemies[i].en_posX += enspd;
            }
            if (enemies[i].en_posX > gg_posX) {
                enemies[i].en_posX -= enspd;
            }
            if (enemies[i].en_posY < gg_posY) {
                enemies[i].en_posY += enspd;
            }
            if (enemies[i].en_posY > gg_posY) {
                enemies[i].en_posY -= enspd;
            }
        }
    }

    function dmg() {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].en_posX == gg_posX && enemies[i].en_posY == gg_posY && enemies[i].isSpawn == 1) {
                gg_hp--;
            }
        }
    }

    function borders()
    {
        if (gg_posX < 1 && gg_posX < 741 ) { gg_posX=1; }
        if (gg_posX > 740 && gg_posX > 1 ) { gg_posX=740; }
        if (gg_posY < 1 && gg_posY < 515 ) { gg_posY=1; }
        if (gg_posY > 515 && gg_posY > 1 ) { gg_posY=514; }
    }

    var cx = 150;
    var cy = 450;
    function movesCirle() {
        c.fillStyle = 'Grey';
        c.beginPath();
        c.arc(cx, cy, 80, 0, 360, true);
        c.closePath();
        c.fill();
        c.fillStyle = 'Black';
        c.beginPath();
        c.moveTo(cx, cy-80);
        c.lineTo(cx, cy+80);
        c.closePath();
        c.stroke();
        c.beginPath();
        c.moveTo(cx-80, cy);
        c.lineTo(cx+80, cy);
        c.closePath();
        c.stroke();
    }

    function movegg() {
        if (mousedownq) {
            if (clientX > cx-80 && clientX < cx+80 && clientY > cy-80 && clientY < cy+80) {
                // alert(event.clientX + ' ' + event.clientY);
                var X = clientX - cx;
                var Y = clientY - cy;
                Y = Y - 2 * Y;
                var angle;
                var rad;
                var hyp;
                var cos;
                if (X < 0 && Y > 0) {
                    X = X - 2 * X;
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        gg_posX -= speed1;
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        gg_posX -= 4;
                        gg_posY -= speed2;
                    }
                    if (angle > 67.5 && angle < 90) {
                        gg_posY -= speed1;
                    }
                } else if (X < 0 && Y < 0) {
                    X = X - 2 * X;
                    Y = Y - 2 * Y;
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        gg_posX -= speed1;
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        gg_posX -= speed2;
                        gg_posY += speed2;
                    }
                    if (angle > 67.5 && angle < 90) {
                        gg_posY += speed1;
                    }
                } else if (X > 0 && Y < 0) {
                    Y = Y - 2 * Y;
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        gg_posX += speed1;
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        gg_posX += speed2;
                        gg_posY += speed2;
                    }
                    if (angle > 67.5 && angle < 90) {
                        gg_posY += speed1;
                    }
                } else if (X > 0 && Y > 0) {
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        gg_posX += speed1;
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        gg_posX += speed2;
                        gg_posY -= speed2;
                    }
                    if (angle > 67.5 && angle < 90) {
                        gg_posY -= speed1;
                    }
                } else if (X === 0 && Y > 0) {
                    gg_posY -= 10;
                } else if (X === 0 && Y < 0) {
                    gg_posY += 10;
                } else if (Y === 0 && X > 0) {
                    gg_posX += 10;
                } else if (Y === 0 && X < 0) {
                    gg_posX -= 10;
                }
                c.fillText(X + ' ::: ' + Y + '  ::: ' + angle, 35, 550);
            }
        }
    }

    var fx = 650;
    var fy = 450;
    function shootsCircle() {
        c.fillStyle = 'Grey';
        c.beginPath();
        c.arc(fx, fy, 80, 0, 360, true);
        c.closePath();
        c.fill();
        c.fillStyle = 'Black';
        c.beginPath();
        c.moveTo(fx, fy-80);
        c.lineTo(fx, fy+80);
        c.closePath();
        c.stroke();
        c.beginPath();
        c.moveTo(fx-80, fy);
        c.lineTo(fx+80, fy);
        c.closePath();
        c.stroke();
    }

    function Bullet(dir, bullX, bullY, bulltype) {
        this.direct = dir;
        this.bullX = bullX;
        this.bullY = bullY;
        this.bulltype = bulltype;
    }

    var bullet_pic = new Image();
    bullet_pic.src = 'assets/bullet.png';

    function drawbullets()
    {
        var bullet_pic = new Image();
        bullet_pic.src = 'assets/bullet.png';
        bullet_pic.onload = function () {
            for (var i = 0; i < bullets.length; i++) {
                c.drawImage(bullet_pic, bullets[i].bullX, bullets[i].bullY);
            }
        }
    }

    function fire() {
        if (mousedownq) {
            var deltaX = gg_posX + 30;
            var deltaY = gg_posY + 40;
            if (clientX > fx-80 && clientX < fx+80 && clientY > fy-80 && clientY < fy+80) {
                var X = clientX - fx;
                var Y = clientY - fy;
                Y = Y - 2 * Y;
                var angle;
                var rad;
                var hyp;
                var cos;
                if (X < 0 && Y > 0) {
                    X = X - 2 * X;
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        bullets.push(new Bullet(1, deltaX, deltaY, 1));
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        bullets.push(new Bullet(2, deltaX, deltaY, 1));
                    }
                    if (angle > 67.5 && angle < 90) {
                        bullets.push(new Bullet(3, deltaX, deltaY, 1));
                    }
                } else if (X < 0 && Y < 0) {
                    X = X - 2 * X;
                    Y = Y - 2 * Y;
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        bullets.push(new Bullet(1, deltaX, deltaY, 1));
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        bullets.push(new Bullet(8, deltaX, deltaY, 1));
                    }
                    if (angle > 67.5 && angle < 90) {
                        bullets.push(new Bullet(7, deltaX, deltaY, 1));
                    }
                } else if (X > 0 && Y < 0) {
                    Y = Y - 2 * Y;
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        bullets.push(new Bullet(5, deltaX, deltaY, 1));
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        bullets.push(new Bullet(6, deltaX, deltaY, 1));
                    }
                    if (angle > 67.5 && angle < 90) {
                        bullets.push(new Bullet(7, deltaX, deltaY, 1));
                    }
                } else if (X > 0 && Y > 0) {
                    hyp = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
                    cos = X / hyp;
                    rad = Math.acos(cos);
                    angle = rad * 180 / Math.PI;
                    if (angle > 0 && angle < 22.5) {
                        bullets.push(new Bullet(5, deltaX, deltaY, 1));
                    }
                    if (angle > 22.5 && angle < 67.5) {
                        bullets.push(new Bullet(4, deltaX, deltaY, 1));
                    }
                    if (angle > 67.5 && angle < 90) {
                        bullets.push(new Bullet(3, deltaX, deltaY, 1));
                    }
                } else if (X === 0 && Y > 0) {
                    bullets.push(new Bullet(3, deltaX, deltaY, 1));
                } else if (X === 0 && Y < 0) {
                    bullets.push(new Bullet(7, deltaX, deltaY, 1));
                } else if (Y === 0 && X > 0) {
                    bullets.push(new Bullet(5, deltaX, deltaY, 1));
                } else if (Y === 0 && X < 0) {
                    bullets.push(new Bullet(1, deltaX, deltaY, 1));
                }
                c.fillText(X + ' ::: ' + Y + '  ::: ' + angle, 35, 550);
            }
        }
    }

    function movebullets()
    {
        for (var i = 0; i < bullets.length; i++) {
            if (bullets[i].direct==1)
            {
                bullets[i].bullX-=15;
            }
            else if (bullets[i].direct==2)
            {
                bullets[i].bullX-=10;
                bullets[i].bullY-=10;
            }
            else if (bullets[i].direct==3)
            {
                bullets[i].bullY-=15;
            }
            else if (bullets[i].direct==8)
            {
                bullets[i].bullX-=10;
                bullets[i].bullY+=10;
            }
            else if (bullets[i].direct==7)
            {
                bullets[i].bullY+=15;
            }
            else if (bullets[i].direct==6)
            {
                bullets[i].bullX+=10;
                bullets[i].bullY+=10;
            }
            else if (bullets[i].direct==5)
            {
                bullets[i].bullX+=15;
            }
            else if (bullets[i].direct==4)
            {
                bullets[i].bullX+=10;
                bullets[i].bullY-=10;
            }
        }
    }

    function SearchCollisions()
    {
        for (var i = 0; i < enemies.length; i++)
        {
            for (var j = 0; j < bullets.length; j++)
            {
                if (bullets[j].bullX > enemies[i].en_posX && bullets[j].bullX < enemies[i].en_posX + 78 
                && bullets[j].bullY > enemies[i].en_posY && bullets[j].bullY < enemies[i].en_posY + 80) {
                    enemies[i].isSpawn = 0;
                    bullets[j].type = 0;
                }
            }    
        }
    }

    function Overflows()
    {
        // Пули
        var j = 0;
        var e = 0;
            for (var i = 0; i < bullets.length; i++)
            {
                if (bullets[i].bullX < 0 || bullets[i].bullY < 0 || bullets[i].bullY > 600 || bullets[i].bullX > 800)
                {
                    j++;
                }
            }
        if (j == bullets.length) {
            bullets.length = 0;
        }
        // Враги
        for (var q = 0; q < enemies.length; q++)
        {
            if (enemies[q].isSpawn == 0) {
                e++;
            }
        }
        if (e == enemies.length) {
            enemies.length = 0;
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}