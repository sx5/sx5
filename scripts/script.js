const title = 'EXOTIC',
    loading = ['|','/','-','\\'];

var loadingChar = loading[0],
    currentTitle = title,
    a = 0,
    b = 1,
    c = 0,
    d = 1;

var titleInterval = setInterval(() => {
    loadingChar = loading[c % 4];
    if (d == 1) {
        currentTitle = title.substring(a%title.length, title.length);
        if (a%title.length == title.length-1) d *= -1;
        document.title = `${loadingChar} ${currentTitle.length < 5 ? currentTitle + '\u2000'.repeat(2*(5-currentTitle.length)) : currentTitle} ${loadingChar}`;
    } else {
        currentTitle = title.substring(0, a%title.length);
        if (a%title.length == title.length-1) d *= -1;
        document.title = `${loadingChar} ${currentTitle.length < 5 ? '\u2000'.repeat(2*(5-currentTitle.length)) + currentTitle : currentTitle} ${loadingChar}`;
    }
    a += b;
    c++;
}, 500);

var canvas = document.getElementById('starfield'),
    context = canvas.getContext('2d'),
    starAmount = 150,
    stars = [];

canvas.width = window.innerWidth*0.99;
canvas.height = window.innerHeight*0.99;

class Star {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.minSpeed = 0.5;
        this.maxSpeed = 1.5;
        this.dirVelocity = [Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1];
        this.velocity = [Math.max(Math.random()*this.maxSpeed,this.minSpeed)*this.dirVelocity[0], Math.max(Math.random()*this.maxSpeed,this.minSpeed)*this.dirVelocity[1]];
    }

    setVelocity(x, y, speed) {
        this.dirVelocity =[x > 0 ? 1 : -1, y > 0 ? 1 : -1];
        this.velocity = [speed, speed];
    }

    move() {
        this.velocity = [
            Math.abs(Math.min(Math.max(this.velocity[0]*0.9, this.minSpeed), this.maxSpeed))*this.dirVelocity[0],
            Math.abs(Math.min(Math.max(this.velocity[1]*0.9, this.minSpeed), this.maxSpeed))*this.dirVelocity[1]
        ];

        this.x += this.velocity[0];
        this.y += this.velocity[1];

        if (this.x <= 0)
            this.x = canvas.width;
        if (this.y <= 0)
            this.y = canvas.height;
        if (this.x > canvas.width)
            this.x = 0;
        if (this.y > canvas.height)
            this.y = 0;
    }

        

    show(size, color) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(this.x, this.y, size, 0, Math.PI*2);
        context.fill();
    }
}

var mouseX = -500;
var mouseY = -500;
var deltaX = 0;
var deltaY = 0;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
    
function onMouseUpdate(e) {
    deltaX = e.pageX-mouseX;
    deltaY = e.pageY-mouseY;
    mouseX = e.pageX;
    mouseY = e.pageY;
}

for (let i = 0; i < starAmount; i++) {
    let x = Math.random()*canvas.width;
    let y = Math.random()*canvas.height;
    let star = new Star(x ,y);
    stars.push(star);
}

var lastTime = Date.now();

function draw() {
    canvas.width = window.innerWidth*0.99;
    canvas.height = window.innerHeight*0.99;
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);
    for (star of stars) {
        let distX = (mouseX-star.x);
        let distY = (mouseY-star.y);

        let dist = 100;

        if (Math.abs(distX) < dist && Math.abs(distY) < dist) {           
            star.setVelocity(distX, distY, Math.abs(deltaX+deltaY));

            context.beginPath();
            context.strokeStyle = '#fffffff0';
            context.moveTo(mouseX, mouseY);
            context.lineTo(mouseX-distX, mouseY-distY);
            context.stroke();
            
            star.show(3, 'white');
            star.show(2, 'black');
        } else {
            star.show(2, 'white');
        }
        
        star.move();
    }
}

function update() {
    if (Date.now()-lastTime > 30)  {
        draw();
        lastTime = Date.now();
    }
    window.requestAnimationFrame(update);
}
update();
console.log("Skidding exotic? pathetic lul")
