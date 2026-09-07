document.addEventListener("DOMContentLoaded", () => {
    initMathFormulaCanvas();

    fetch('education.json')
        .then(res => res.json())
        .then(data => {
            const cleanText = (str) => typeof str === 'string' ? str.split('[cite')[0].replace(/\\/g, '').trim() : str;

            // Header
            document.getElementById('edu-title').textContent = cleanText(data.header.title);
            document.getElementById('edu-summary').innerHTML = `
                <div class="flex justify-center items-center gap-3 mb-2">
                    <span class="animate-pulse text-emerald-400">📡</span>
                    <span class="text-emerald-400 font-mono text-sm tracking-widest uppercase font-bold">${cleanText(data.header.lokasi)}</span>
                </div>
                <p class="text-base md:text-lg leading-relaxed">${cleanText(data.ringkasan_profil)}</p>
            `;

            // Setup Data Render dengan Pop-Up Modul Besar
            renderPopUpCards('skills-grid', data.keahlian_utama_pendidikan, {
                "perancangan_kurikulum_asesmen": "📝",
                "metodologi_pengajaran_pedagogi": "🧠",
                "pengembangan_media_teknologi_pembelajaran": "💻",
                "komunikasi_akademik_facilitation": "🎙️"
            }, "h-56", cleanText);

            renderPopUpCards('experience-grid', data.pengalaman_kerja_portofolio_pedagogi, {
                "tutor_pelatih_olimpiade_kebumian": "🌋",
                "tutor_olimpiade_astronomi_geografi": "🌌",
                "tutor_bidang_lainnya": "🧪",
                "pengembangan_kurikulum_modul_ajar": "📖"
            }, "h-60", cleanText);

            renderPopUpCards('achievements-grid', data.prestasi, {
                "tingkat_perguruan_tinggi_profesional": "🏆",
                "tingkat_sma": "🏅"
            }, "h-60", cleanText);

            setup3DTiltEffect();
        })
        .catch(err => console.error("Data error:", err));
});

// MEMBUAT CARD DENGAN MODUL POP-UP BESAR SAAT HOVER
function renderPopUpCards(containerId, dataset, iconMap, heightClass, cleanText) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    for (const [key, items] of Object.entries(dataset)) {
        const title = key.replace(/_/g, ' ').toUpperCase();
        const icon = iconMap[key] || "✨";
        const itemsArray = Array.isArray(items) ? items : [];
        
        const listHtml = itemsArray.map(i => `
            <li class="flex gap-3 items-start text-sm md:text-base text-slate-100 font-mono leading-relaxed">
                <span class="text-emerald-400 font-bold text-lg">▹</span>
                <span>${cleanText(i)}</span>
            </li>
        `).join('');

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 ${heightClass} flex flex-col items-center justify-center text-center cursor-pointer rounded-2xl`;
        
        card.innerHTML = `
            <!-- PREVIEW CARD (Tampilan Normal) -->
            <div class="flex flex-col items-center w-full">
                <div class="text-5xl mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">${icon}</div>
                <h3 class="text-base md:text-lg font-bold text-emerald-400 font-mono tracking-wide">${title}</h3>
                <div class="mt-4 px-3 py-1 border border-emerald-500/40 rounded-full text-[10px] text-emerald-300 font-mono animate-pulse bg-emerald-950/40">
                    🔍 HOVER UNTUK MEMBUKA MODUL
                </div>
            </div>

            <!-- POP-UP MODUL BESAR (MUNCUL DI TENGAH LAYAR SAAT HOVER) -->
            <div class="popup-modal-content text-left">
                <div class="flex justify-between items-center pb-4 mb-4 border-b border-emerald-500/40">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${icon}</span>
                        <h4 class="text-xl font-extrabold text-emerald-300 font-mono">${title}</h4>
                    </div>
                    <span class="text-xs text-emerald-400 font-mono px-2 py-1 bg-emerald-950 rounded border border-emerald-500/30">MODULE DECRYPTED</span>
                </div>
                <ul class="space-y-4 my-2">
                    ${listHtml}
                </ul>
                <div class="mt-6 pt-3 border-t border-emerald-500/20 text-right">
                    <span class="text-[11px] text-slate-400 font-mono">Geser kursor keluar untuk menutup modul ✕</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
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
            const tiltX = ((y - centerY) / centerY) * -6; 
            const tiltY = ((x - centerX) / centerX) * 6;
            
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// MATH CANVAS INTERAKTIF (DENGAN RUMUS MELIMPAH & TRIGONOMETRI)
function initMathFormulaCanvas() {
    const canvas = document.getElementById('math-canvas');
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

    const formulas = [
        "sin²x + cos²x = 1", "tan x = sin x / cos x", "1 + tan²x = sec²x", 
        "sin(A±B) = sinA cosB ± cosA sinB", "cos(A±B) = cosA cosB ∓ sinA sinB",
        "sin(2x) = 2 sin x cos x", "cos(2x) = cos²x - sin²x", "a/sin A = b/sin B = c/sin C",
        "c² = a² + b² - 2ab cos C", "d/dx(sin x) = cos x", "d/dx(cos x) = -sin x",
        "∫ sin x dx = -cos x", "∫ cos x dx = sin x", "tan(2x) = 2tan x / (1 - tan²x)",
        "E=mc²", "PV=nRT", "∫e^-x²dx=√π", "z=(x-μ)/σ", "∇·V=0", 
        "WBGT=0.7Tw+0.2Tg+0.1Td", "Q=m·c·ΔT", "∇×E=-∂B/∂t", "F=G(m₁m₂)/r²", 
        "L=-∑ylog(ŷ)", "Ri=(g/θ)(∂θ/∂z)/(∂u/∂z)²", "P(A|B)=P(B|A)P(A)/P(B)",
        "Bloom's Taxonomy", "UbD Framework", "HOTS Assessment", "OSN Kebumian", "CBT System"
    ];

    const particles = Array.from({ length: 65 }, () => ({
        text: formulas[Math.floor(Math.random() * formulas.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 14,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.4,
        opacity: Math.random() * 0.45 + 0.25
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.y < -50) p.y = height + 50;
            if (p.x < -50) p.x = width + 50;
            if (p.x > width + 50) p.x = -50;

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

            ctx.font = `bold ${p.size}px 'Fira Code', monospace`;
            ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#10b981';
            ctx.fillText(p.text, p.x, p.y);
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(animate);
    }
    animate();
}
