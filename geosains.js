document.addEventListener("DOMContentLoaded", () => {
    // 1. Jalankan animasi canvas di background
    initDataScienceCanvas();

    // 2. Fetch data geosains.json
    fetch('geosains.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            return res.json();
        })
        .then(data => {
            // Helper pembersih teks aman
            const cleanText = (str) => {
                if (typeof str !== 'string') return str || '';
                return str.split('[cite')[0].replace(/\\/g, '').trim();
            };

            // Header & About Me
            if (data.header) {
                const geoTitle = document.getElementById('geo-title');
                if (geoTitle) geoTitle.textContent = cleanText(data.header.title);

                const geoAbout = document.getElementById('geo-about');
                if (geoAbout) {
                    geoAbout.innerHTML = `
                        <div class="flex justify-center items-center gap-3 mb-2">
                            <span class="animate-pulse text-cyan-300 text-lg">📡</span>
                            <span class="text-cyan-300 font-mono text-sm tracking-widest uppercase font-bold">${cleanText(data.header.lokasi)}</span>
                        </div>
                        <p class="text-base md:text-lg leading-relaxed text-slate-100 font-medium drop-shadow-md">${cleanText(data.about_me)}</p>
                    `;
                }
            }

            // Render Projects
            if (data.project_experience && Array.isArray(data.project_experience.projects)) {
                renderProjectCards('projects-grid', data.project_experience.projects, cleanText);
            }

            // Render Technical Skills
            if (data.technical_skills) {
                renderHoverCards('skills-grid', data.technical_skills, {
                    "geospatial_remote_sensing": "🌍",
                    "programming_data_science": "💻",
                    "numerical_modeling": "🌊"
                }, cleanText);
            }

            // Render Achievements
            if (data.achievements_scientific_contribution) {
                renderAchievementsCard('achievements-container', data.achievements_scientific_contribution, cleanText);
            }

            // Inisialisasi efek 3D tilt
            setup3DTiltEffect();
        })
        .catch(err => {
            console.error("Gagal memuat geosains.json:", err);
        });
});

// BUILD PROJECT CARDS
function renderProjectCards(containerId, projects, cleanText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const projIcons = ["🌩️", "🌊", "☀️", "🌪️", "🏖️", "🌀"];
    container.innerHTML = ""; // Bersihkan kontainer

    projects.forEach((proj, idx) => {
        const title = cleanText(proj.nama);
        const icon = projIcons[idx % projIcons.length];
        const role = proj.role ? cleanText(proj.role) : 'IBF System Model';
        
        const detailsArray = Array.isArray(proj.details) ? proj.details : [];
        const listHtml = detailsArray.map(d => `
            <li class="flex gap-2 items-start">
                <span class="text-cyan-400 font-bold">▹</span>
                <span class="text-xs md:text-sm text-slate-200">${cleanText(d)}</span>
            </li>
        `).join('');
        
        let docLink = proj.portofolio_documentation ? 
            `<a href="${cleanText(proj.portofolio_documentation)}" target="_blank" class="mt-4 inline-flex items-center justify-center w-full py-2.5 bg-cyan-950/80 hover:bg-cyan-800/90 text-cyan-300 border border-cyan-500/50 rounded-lg text-[11px] font-bold font-mono tracking-wider transition-colors z-30 relative pointer-events-auto">
                [ ACCESS SYSTEM DOCS ↗ ]
            </a>` : '';

        const card = document.createElement('div');
        // Menghapus kelas fade-in-up agar elemen tidak hilang karena opacity 0
        card.className = `glass-card light-sweep tilt-element group p-6 rounded-2xl flex flex-col justify-between cursor-pointer border border-cyan-500/30`;
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-4xl drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]">${icon}</span>
                    <span class="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-cyan-950/80 border border-cyan-800 rounded-full">${role}</span>
                </div>
                <h3 class="text-lg font-extrabold text-cyan-300 font-mono mb-4 leading-snug">${title}</h3>
                <ul class="space-y-2.5 font-mono mb-4">
                    ${listHtml}
                </ul>
            </div>
            ${docLink}
        `;
        container.appendChild(card);
    });
}

// BUILD SKILLS CARDS
function renderHoverCards(containerId, dataset, iconMap, cleanText) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    for (const [key, items] of Object.entries(dataset)) {
        const title = key.replace(/_/g, ' ').toUpperCase();
        const icon = iconMap[key] || "✨";
        
        const itemsArray = Array.isArray(items) ? items : [];
        const listHtml = itemsArray.map(i => `
            <li class="flex gap-2 items-start">
                <span class="text-cyan-400 font-bold">▹</span>
                <span class="text-xs md:text-sm text-slate-200">${cleanText(i)}</span>
            </li>
        `).join('');

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 rounded-2xl flex flex-col justify-between cursor-pointer border border-cyan-500/30`;
        
        card.innerHTML = `
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-4xl drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]">${icon}</span>
                    <h3 class="text-base font-extrabold text-cyan-300 font-mono tracking-wide">${title}</h3>
                </div>
                <ul class="space-y-2.5 font-mono">
                    ${listHtml}
                </ul>
            </div>
        `;
        container.appendChild(card);
    }
}

// ACHIEVEMENTS RENDER
function renderAchievementsCard(containerId, achData, cleanText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const achievementsArray = Array.isArray(achData.selected_achievements) ? achData.selected_achievements : [];
    let achList = achievementsArray.map(a => `
        <li class="flex gap-2 items-start">
            <span class="text-cyan-400 font-extrabold text-base">»</span>
            <span class="text-xs md:text-sm font-mono text-slate-200">${cleanText(a)}</span>
        </li>
    `).join('');

    container.innerHTML = `
        <div class="glass-card light-sweep tilt-element p-8 md:p-10 rounded-3xl border border-cyan-400/50 cursor-default">
            <div class="flex flex-col md:flex-row items-center gap-5 mb-6 pb-6 border-b border-cyan-500/40">
                <div class="text-6xl drop-shadow-[0_0_20px_rgba(45,212,191,0.8)]">🏆</div>
                <div class="text-center md:text-left">
                    <h4 class="text-xl md:text-2xl font-extrabold text-cyan-100 font-mono text-glow">${cleanText(achData.general)}</h4>
                </div>
            </div>
            <ul class="grid md:grid-cols-2 gap-4 text-slate-200">
                ${achList}
            </ul>
        </div>
    `;
}

// EFEK 3D TILT SAAT HOVER
function setup3DTiltEffect() {
    document.querySelectorAll('.tilt-element').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((y - centerY) / centerY) * -8; 
            const tiltY = ((x - centerX) / centerX) * 8;
            
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// CANVAS ANIMASI KODE PYTHON HIJAU NEON (40 ITEMS, FONT KECIL)
function initDataScienceCanvas() {
    const canvas = document.getElementById('data-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const mouse = { x: null, y: null, radius: 220 };
    window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const scripts = [
        "import xarray as xr", "import geopandas as gpd", "import rasterio as rio",
        "ds = xr.open_dataset('inaflews_rain.nc')", "gdf = gpd.read_file('sulsel_boundary.geojson')",
        "ee.Initialize()", "image = ee.ImageCollection('COPERNICUS/S2_SR')",
        "ndvi = (nir - red) / (nir + red)", "ds_resampled = ds.resample(time='1D').mean()",
        "gdf.to_crs(epsg=4326, inplace=True)", "grid_z = griddata(points, values, (grid_x, grid_y))",
        "import tensorflow as tf", "from sklearn.ensemble import RandomForestRegressor",
        "import cv2", "gray_img = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)",
        "model = Sequential([Conv2D(32, (3,3)), MaxPooling2D()])",
        "X_train, X_test, y_train, y_test = train_test_split(X, y)",
        "model.fit(X_train, y_train, epochs=50, batch_size=32)",
        "y_pred = model.predict(X_test)", "rmse = np.sqrt(mean_squared_error(y_test, y_pred))",
        "edges = cv2.Canny(image, threshold1=100, threshold2=200)",
        "def calc_wbgt(temp, humidity, wind_speed):", "def heat_index(T, RH):",
        "fft_spectrum = np.fft.fft2(satellite_band)", "wavelet, freqs = pywt.cwt(signal, scales)",
        "wrf_ds = wrf.getvar(ncfile, 'dbz', timeidx=-1)", "hec_ras_flow = pd.read_csv('hydro.csv')",
        "kalman_filter.update(measurement=obs_radar)", "rho_air = 1.225 # kg/m3",
        "import numpy as np", "import pandas as pd", "import matplotlib.pyplot as plt",
        "df = pd.DataFrame(data=sensor_logs)", "df.dropna().groupby('station_id').mean()",
        "SELECT latitude, longitude, hazard_level FROM ibf_warning_db",
        "fig = px.density_mapbox(df, lat='lat', lon='lon', z='risk')",
        "while True: stream_meteorological_telemetry()"
    ];

    const codes = Array.from({ length: 40 }, () => ({
        text: scripts[Math.floor(Math.random() * scripts.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.8 + 0.6,
        fontSize: Math.floor(Math.random() * 3) + 9,
        opacity: Math.random() * 0.35 + 0.4
    }));

    const nodes = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        size: Math.random() * 2 + 1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        codes.forEach(c => {
            c.y -= c.speed;
            if (c.y < -30) {
                c.y = height + 30;
                c.x = Math.random() * width;
                c.text = scripts[Math.floor(Math.random() * scripts.length)];
            }

            ctx.font = `bold ${c.fontSize}px 'Fira Code', monospace`;
            ctx.fillStyle = `rgba(52, 211, 153, ${c.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#10b981';
            
            ctx.fillText(c.text, c.x, c.y);
            ctx.shadowBlur = 0;
        });

        nodes.forEach((n, i) => {
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            if (mouse.x != null) {
                let dx = mouse.x - n.x;
                let dy = mouse.y - n.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    n.x -= (dx / dist) * 2.5;
                    n.y -= (dy / dist) * 2.5;
                }
            }

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(16, 185, 129, 0.8)";
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#10b981';
            ctx.fill();
            ctx.shadowBlur = 0;

            for (let j = i + 1; j < nodes.length; j++) {
                let dx = n.x - nodes[j].x;
                let dy = n.y - nodes[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(16, 185, 129, ${0.35 - dist / 300})`;
                    ctx.lineWidth = 0.8;
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
