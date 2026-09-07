document.addEventListener("DOMContentLoaded", () => {
    initDataScienceCanvas();

    fetch('geosains.json')
        .then(res => res.json())
        .then(data => {
            const cleanText = (str) => typeof str === 'string' ? str.split('[cite')[0] : str;

            // Header & About
            document.getElementById('geo-title').textContent = cleanText(data.header.title);
            document.getElementById('geo-about').innerHTML = `
                <div class="flex justify-center items-center gap-3 mb-2">
                    <span class="animate-pulse text-cyan-400">📡</span>
                    <span class="text-cyan-400 font-mono text-sm tracking-widest uppercase">${cleanText(data.header.lokasi)}</span>
                </div>
                <p class="text-sm md:text-base leading-relaxed">${cleanText(data.about_me)}</p>
            `;

            // 1. Render Projects (With Doc Links)
            renderProjectCards('projects-grid', data.project_experience.projects);

            // 2. Render Skills
            renderHoverCards('skills-grid', data.technical_skills, {
                "geospatial_remote_sensing": "🌍",
                "programming_data_science": "💻",
                "numerical_modeling": "🌊"
            }, "h-72");

            // 3. Render Achievements
            renderAchievementsCard('achievements-container', data.achievements_scientific_contribution);

            setupScrollAnimation();
            setup3DTiltEffect();
        })
        .catch(err => console.error("Data error:", err));
});

// BUILD HOVER SILHOUETTE FOR PROJECTS
function renderProjectCards(containerId, projects) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cleanText = (str) => typeof str === 'string' ? str.split('[cite')[0] : str;

    const projIcons = ["🌩️", "🌊", "☀️", "🌪️", "🏖️", "🌀"];

    projects.forEach((proj, idx) => {
        const title = cleanText(proj.nama);
        const icon = projIcons[idx % projIcons.length];
        const role = proj.role ? cleanText(proj.role) : 'IBF System Model';
        const listHtml = proj.details.map(d => `<li class="flex gap-2 items-start"><span class="text-cyan-400">▹</span><span>${cleanText(d)}</span></li>`).join('');
        
        let docLink = proj.portofolio_documentation ? 
            `<a href="${cleanText(proj.portofolio_documentation)}" target="_blank" class="mt-4 inline-flex items-center justify-center w-full py-2 bg-cyan-900/50 hover:bg-cyan-600/80 text-cyan-200 border border-cyan-500/50 rounded-lg text-[10px] font-bold tracking-widest transition-colors z-50 relative pointer-events-auto">
                [ ACCESS SYSTEM DOCS ↗ ]
            </a>` : '';

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 h-80 flex flex-col items-center justify-center text-center rounded-2xl fade-in-up`;
        
        card.innerHTML = `
            <!-- PREVIEW (Fades out on hover) -->
            <div class="transition-all duration-500 group-hover:opacity-0 group-hover:scale-90 flex flex-col items-center w-full">
                <div class="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(45,212,191,0.6)] transform group-hover:-translate-y-4 transition-transform duration-500">${icon}</div>
                <h3 class="text-lg font-bold text-cyan-400 font-mono tracking-wide leading-snug">${title.split('-')[0]}</h3>
                <div class="mt-4 px-3 py-1 border border-cyan-500/30 rounded-full text-[10px] text-cyan-500 font-mono animate-pulse bg-cyan-950/40">HOVER TO DECRYPT</div>
            </div>

            <!-- SILHOUETTE FULL TEXT OVERLAY (Fades in on hover) -->
            <div class="absolute inset-0 bg-slate-950/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col text-left overflow-y-auto z-10 border border-cyan-400 rounded-2xl">
                <div class="sticky top-0 bg-slate-950/95 pb-2 mb-3 border-b border-cyan-500/30">
                    <div class="text-[9px] text-cyan-500 font-mono mb-1">> ROLE: ${role}</div>
                    <h4 class="text-cyan-300 font-bold font-mono text-sm leading-tight">${title}</h4>
                </div>
                <ul class="text-xs space-y-3 text-slate-300 font-mono flex-grow">
                    ${listHtml}
                </ul>
                ${docLink}
            </div>
        `;
        container.appendChild(card);
    });
}

// BUILD HOVER SILHOUETTE FOR SKILLS
function renderHoverCards(containerId, dataset, iconMap, heightClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cleanText = (str) => typeof str === 'string' ? str.split('[cite')[0] : str;

    for (const [key, items] of Object.entries(dataset)) {
        const title = key.replace(/_/g, ' ').toUpperCase();
        const icon = iconMap[key] || "✨";
        const listHtml = items.map(i => `<li class="flex gap-2 items-start"><span class="text-cyan-400">▹</span><span>${cleanText(i)}</span></li>`).join('');

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 ${heightClass} flex flex-col items-center justify-center text-center rounded-2xl fade-in-up`;
        
        card.innerHTML = `
            <div class="transition-all duration-500 group-hover:opacity-0 group-hover:scale-90 flex flex-col items-center w-full">
                <div class="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(45,212,191,0.6)]">${icon}</div>
                <h3 class="text-lg font-bold text-cyan-400 font-mono tracking-wide">${title}</h3>
                <div class="mt-4 px-3 py-1 border border-cyan-500/30 rounded-full text-[10px] text-cyan-500 font-mono animate-pulse bg-cyan-950/40">HOVER TO SCAN DATA</div>
            </div>

            <div class="absolute inset-0 bg-slate-950/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col text-left overflow-y-auto z-10 border border-cyan-400 rounded-2xl">
                <div class="sticky top-0 bg-slate-950/95 pb-2 mb-3 border-b border-cyan-500/30">
                    <h4 class="text-cyan-300 font-bold font-mono text-sm flex items-center gap-2">
                        <span class="animate-spin-slow">⚙️</span> DATA: ${title}
                    </h4>
                </div>
                <ul class="text-xs space-y-3 text-slate-300 font-mono">
                    ${listHtml}
                </ul>
            </div>
        `;
        container.appendChild(card);
    }
}

// ACHIEVEMENTS RENDER
function renderAchievementsCard(containerId, achData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cleanText = (str) => typeof str === 'string' ? str.split('[cite')[0] : str;

    let achList = achData.selected_achievements.map(a => `<li class="flex gap-2 items-start"><span class="text-cyan-400 font-bold">»</span><span>${cleanText(a)}</span></li>`).join('');

    container.innerHTML = `
        <div class="glass-card light-sweep tilt-element p-8 rounded-3xl fade-in-up border-cyan-500/40">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-500/30">
                <div class="text-5xl drop-shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-pulse">🏆</div>
                <div>
                    <h4 class="text-xl font-bold text-white font-mono">${cleanText(achData.general)}</h4>
                </div>
            </div>
            <ul class="grid md:grid-cols-2 gap-4 text-sm text-slate-300 font-mono">
                ${achList}
            </ul>
        </div>
    `;
}

// 3D TILT EFFECT
function setup3DTiltEffect() {
    document.querySelectorAll('.tilt-element').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * -10; 
            const tiltY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// DATA SCIENCE CANVAS (SCROLLING SCRIPTS & CONNECTED NODES)
function initDataScienceCanvas() {
    const canvas = document.getElementById('data-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const mouse = { x: null, y: null, radius: 180 };
    window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Dataset for scrolling code
    const scripts = [
        "import xarray as xr", "import numpy as np", "ds = xr.open_dataset('climate.nc')",
        "model = RandomForestRegressor()", "cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
        "from sklearn.metrics import mean_squared_error", "def calculate_wbgt(T, rh):",
        "SELECT * FROM geospatial_db", "import geopandas as gpd", "np.fft.fft2(spatial_data)"
    ];

    // Data structures
    const codes = Array.from({ length: 25 }, () => ({
        text: scripts[Math.floor(Math.random() * scripts.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
    }));

    const nodes = Array.from({ length: 60 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Scrolling Code (Bottom to Top)
        ctx.font = "12px 'Fira Code', monospace";
        codes.forEach(c => {
            c.y -= c.speed; // Move up
            if (c.y < -20) {
                c.y = height + 20;
                c.x = Math.random() * width;
                c.text = scripts[Math.floor(Math.random() * scripts.length)];
            }
            ctx.fillStyle = `rgba(56, 189, 248, ${c.opacity})`;
            ctx.fillText(c.text, c.x, c.y);
        });

        // 2. Draw Data Nodes Network
        nodes.forEach((n, i) => {
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            // Repel from mouse
            if (mouse.x != null) {
                let dx = mouse.x - n.x;
                let dy = mouse.y - n.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouse.radius) {
                    n.x -= (dx/dist) * 2;
                    n.y -= (dy/dist) * 2;
                }
            }

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(45, 212, 191, 0.6)";
            ctx.fill();

            // Connect nodes
            for (let j = i + 1; j < nodes.length; j++) {
                let dx = n.x - nodes[j].x;
                let dy = n.y - nodes[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(45, 212, 191, ${0.3 - dist/300})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function setupScrollAnimation() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}
