const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreel=document.querySelector('#score');
const start=document.querySelector('#start');
const scorebox=document.querySelector('#scorebox');
const final=document.querySelector('#final');



class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 10, "white");

let projectiles = [];
let enemies = [];

function init(){
     player = new Player(x, y, 10, "white");
     projectiles = [];
     enemies = [];
     score=0
     scoreel.innerHTML=score
     final.innerHTML=score
}

function spawnenemies() {
  setInterval(() => {
    const radius = Math.random() * (50 - 5) + 5;
    let x;
    let y;

    let color=`hsl(${360*Math.random()},50%,50%)`

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    enemies.push(
      new Enemy(x, y, radius, color, {
        x: 0.1 * Math.cos(angle),
        y: 0.1 * Math.sin(angle),
      })
    );
    //console.log(enemies)
  }, 1000);
}

let animateid;
let score=0

function animate() {

  animateid = requestAnimationFrame(animate);
  c.fillStyle='rgba(0,0,0,0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  projectiles.forEach((projectile,id) => {

    projectile.draw();
    projectile.update();

    //  if(projectile.x + projectile.radius <0
    //     || 
    //     projectile.x - projectile.radius > canvas.width
    //     || 
    //     projectile.y + projectile.radius <0
    //     || 
    //     projectile.x - projectile.radius >canvas.height
    //  ){
    //     setTimeout(() => {
    //         projectiles.splice(id,1)
    //         console.log("hello")
    //     }, 0);       
    //  }


  });

  enemies.forEach((enemy, index1) => {
    enemy.update();

    const hyp = Math.hypot(
      canvas.width / 2 - enemy.x,
      canvas.height / 2 - enemy.y
    );
    if (hyp - enemy.radius - player.radius < 1) {
      scorebox.style.display='flex';
      final.innerHTML=score
      cancelAnimationFrame(animateid);
    }

    projectiles.forEach((projectile, index2) => {
      const hyp = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (hyp - enemy.radius - projectile.radius < 1) {
        score +=100
        console.log(score)
        scoreel.innerHTML=score;

        if(enemy.radius -10 > 5){
            gsap.to(enemy,{ ////$$$$$$$$$$$$$$$
                radius: enemy.radius -10
            })
            enemy.radius -= 10
            setTimeout(() => {
                projectiles.splice(index2, 1);
              }, 0);
        }
        else{
            setTimeout(() => {
                enemies.splice(index1, 1);
                projectiles.splice(index2, 1);
              }, 0);
        }
        
      }
    });
  });
}

addEventListener("click", (e) => {
  
    const angle = Math.atan2(
      e.clientY - canvas.height / 2,
      e.clientX - canvas.width / 2
    );
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", {
        x: 7 * Math.cos(angle),
        y: 7 * Math.sin(angle),
      })
    );
  
});

start.addEventListener('click',()=>{
    init()
    animate();
    spawnenemies();
    scorebox.style.display='none';
})


