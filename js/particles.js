const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let mouseX = -1000;
let mouseY = -1000;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = 2;
    }

    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
            const force = (100 - dist) / 100;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 8;
            this.y -= Math.sin(angle) * force * 8;

            this.baseX = this.x;
            this.baseY = this.y;
        } else {
            const returnDist = Math.sqrt(
                Math.pow(this.baseX - this.x, 2) +
                Math.pow(this.baseY - this.y, 2)
            );

            if (returnDist > 5) {
                this.x += (this.baseX - this.x) * 0.03;
                this.y += (this.baseY - this.y) * 0.03;
            } else {
                this.x = this.baseX;
                this.y = this.baseY;
            }
        }

        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX <= 0 || this.baseX >= width) {
            this.vx *= -1;
            this.baseX = Math.max(0, Math.min(width, this.baseX));
        }
        if (this.baseY <= 0 || this.baseY >= height) {
            this.vy *= -1;
            this.baseY = Math.max(0, Math.min(height, this.baseY));
        }

        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
    }

    draw() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
            const size = this.radius + (200 - dist) / 100;
            ctx.fillStyle = '#ff7300';
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

const particles = [];
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.5;
                ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, width, height);

    drawConnections();

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();