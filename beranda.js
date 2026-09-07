// --- 1. MEMUAT DATA DARI GENERAL.JSON ---
document.addEventListener("DOMContentLoaded", () => {
    fetch('general.json')
      .then(response => response.json())
      .then(data => {
        // Render Header & Tagline
        document.getElementById('hero-taglines').innerHTML = `<span>${data.profile.tagline_primary}</span>`;
        document.getElementById('hero-desc').textContent = data.profile.description;
  
        // Render Validation Links dengan Efek Neon Hover
        const linksContainer = document.getElementById('validation-links');
        Object.values(data.validation_links).forEach(link => {
          const btn = document.createElement('a');
          btn.href = link.url;
          btn.target = "_blank";
          btn.className = "btn-neon flex items-center gap-2 px-6 py-3 glass-panel rounded-xl font-bold text-sm text-slate-300 hover:text-white";
          btn.innerHTML = `<span class="text-xl">${link.icon}</span> ${link.title}`;
          linksContainer.appendChild(btn);
        });
  
        // Render Quick Stats (Angka Statistik)
        const statsGrid = document.getElementById('stats-grid');
        data.quick_stats.forEach(stat => {
          const div = document.createElement('div');
          div.className = "glass-panel rounded-xl p-6 text-center transition-transform hover:scale-105";
          div.innerHTML = `
            <div class="text-4xl mb-3 drop-shadow-md">${stat.icon}</div>
            <div class="text-4xl font-extrabold text-glow mb-1">${stat.value}</div>
            <div class="text-xs text-slate-400 uppercase tracking-widest font-semibold">${stat.label}</div>
          `;
          statsGrid.appendChild(div);
        });
  
        // Render Live Platforms
        const platformsGrid = document.getElementById('platforms-grid');
        data.live_platforms.forEach(plat => {
          const card = document.createElement('div');
          card.className = "glass-panel rounded-xl p-6 flex flex-col justify-between";
          card.innerHTML = `
            <div>
              <div class="text-5xl mb-4">${plat.icon}</div>
              <div class="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span> ${plat.category}
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-glow">${plat.name}</h4>
              <p class="text-sm text-slate-400 mb-6 leading-relaxed">${plat.description}</p>
            </div>
            <a href="${plat.url}" target="_blank" class="w-full py-2.5 bg-teal-900/40 hover:bg-teal-700/60 text-teal-300 text-xs font-bold rounded-lg text-center transition-all border border-teal-500/30 hover:border-teal-400 hover:shadow-[0_0_15px_rgba(45,212,191,0.4)]">
              Akses Sistem ↗
            </a>
          `;
          platformsGrid.appendChild(card);
        });
      })
      .catch(error => console.error('Gagal memuat general.json:', error));
});
  
// --- 2. FUTURISTIC TECH NETWORK CANVAS (BACKGROUND BERGERAK) ---
const canvas = document.createElement('canvas');
canvas.id = 'tech-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let particlesArray;
const neonColor = 'rgba(45, 212, 191,'; // Warna Teal/Tosca

// Menyesuaikan ukuran canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Deteksi Mouse untuk Interaksi Partikel
let mouse = {
    x: null,
    y: null,
    radius: 150
}
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Membuat Class Partikel (Titik Data)
class Particle {
    constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
    }
    // Gambar partikel
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = neonColor + ' 0.8)';
        ctx.fill();
    }
    // Update posisi
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        // Interaksi kursor (Menghindar)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Inisialisasi Kumpulan Partikel
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }
}

// Menghubungkan partikel dengan garis (Jaringan Neural/Data)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = neonColor + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop Animasi
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Jalankan Animasi
init();
animate();
