document.addEventListener("DOMContentLoaded", () => {
    initMathFormulaCanvas();

    fetch('education.json')
        .then(res => res.json())
        .then(data => {
            // Header
            document.getElementById('edu-title').textContent = data.header.title.replace(/\/g, '');
            document.getElementById('edu-summary').innerHTML = `
                <div class="flex justify-center items-center gap-3 mb-2">
                    <span class="animate-pulse text-emerald-400">📡</span>
                    <span class="text-emerald-400 font-mono text-sm tracking-widest uppercase">${data.header.lokasi.replace(/\/g, '')}</span>
                </div>
                <p class="text-sm md:text-base leading-relaxed">${data.ringkasan_profil.replace(/\/g, '')}</p>
            `;

            // Setup Data Render
            renderHoverCards('skills-grid', data.keahlian_utama_pendidikan, {
                "perancangan_kurikulum_asesmen": "📝",
                "metodologi_pengajaran_pedagogi": "🧠",
                "pengembangan_media_teknologi_pembelajaran": "💻",
                "komunikasi_akademik_facilitation": "🎙️"
            }, "h-64");

            renderHoverCards('experience-grid', data.pengalaman_kerja_portofolio_pedagogi, {
                "tutor_pelatih_olimpiade_kebumian": "🌋",
                "tutor_olimpiade_astronomi_geografi": "🌌",
                "tutor_bidang_lainnya": "🧪",
                "pengembangan_kurikulum_modul_ajar": "📖"
            }, "h-72");

            renderHoverCards('achievements-grid', data.prestasi, {
                "tingkat_perguruan_tinggi_profesional": "🏆",
                "tingkat_sma": "🏅"
            }, "h-72");

            setupScrollAnimation();
            setup3DTiltEffect();
        })
        .catch(err => console.error("Data error:", err));
});

// BUILD HOVER SILHOUETTE CARDS
function renderHoverCards(containerId, dataset, iconMap, heightClass) {
    const container = document.getElementById(containerId);
    
    for (const [key, items] of Object.entries(dataset)) {
        const title = key.replace(/_/g, ' ').toUpperCase();
        const icon = iconMap[key] || "✨";
        const listHtml = items.map(i => `<li class="flex gap-2 items-start"><span class="text-emerald-400">▹</span><span>${i.replace(/\/g, '')}</span></li>`).join('');

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 ${heightClass} flex flex-col items-center justify-center text-center cursor-pointer rounded-2xl fade-in-up`;
        
        card.innerHTML = `
            <!-- PREVIEW (Fades out on hover) -->
            <div class="transition-all duration-500 group-hover:opacity-0 group-hover:scale-90 flex flex-col items-center w-full">
                <div class="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transform group-hover:-translate-y-4 transition-transform duration-500">${icon}</div>
                <h3 class="text-lg font-bold text-emerald-400 font-mono tracking-wide">${title}</h3>
                <div class="mt-4 px-3 py-1 border border-emerald-500/30 rounded-full text-[10px] text-emerald-500 font-mono animate-pulse">HOVER UNTUK DEKRIPSI DATA</div>
            </div>

            <!-- SILHOUETTE FULL TEXT OVERLAY (Fades in on hover) -->
            <div class="absolute inset-0 bg-black/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col text-left overflow-y-auto z-10 border border-emerald-400 rounded-2xl">
                <div class="sticky top-0 bg-black/90 pb-2 mb-3 border-b border-emerald-500/30">
                    <h4 class="text-emerald-300 font-bold font-mono text-sm flex items-center gap-2">
                        <span class="animate-spin-slow">⚙️</span> SYSTEM DECRYPT: ${title}
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

// 3D TILT EFFECT MOUSE TRACKING
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

// MATH CANVAS INTERAKTIF
function initMathFormulaCanvas() {
    const canvas = document.getElementById('math-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    const mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', e => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const formulas = [
        "E=mc²", "∇×E=-∂B/∂t", "f(x)=σ(W^T x+b)", "PV=nRT", "∫e^-x²dx=√π", 
        "L=-∑ylog(ŷ)", "Ri=(g/θ)(∂θ/∂z)/(∂u/∂z)²", "z=(x-μ)/σ", "∇·V=0", 
        "e^iπ+1=0", "WBGT=0.7Tw+0.2Tg+0.1Td", "Q=m·c·ΔT", "Bloom's Taxonomy", "UbD Framework"
    ];

    const particles = Array.from({ length: 40 }, () => ({
        text: formulas[Math.floor(Math.random() * formulas.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 10,
        baseX: 0, baseY: 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.5,
        opacity: Math.random() * 0.4 + 0.1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.y < -50) p.y = height + 50;
            if (p.x < -50) p.x = width + 50;
            if (p.x > width + 50) p.x = -50;

            // Efek tolak kursor (Repel)
            if (mouse.x != null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    p.x -= (dx / distance) * force * 3;
                    p.y -= (dy / distance) * force * 3;
                }
            }

            ctx.font = `${p.size}px 'Fira Code', monospace`;
            ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#10b981';
            ctx.fillText(p.text, p.x, p.y);
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
