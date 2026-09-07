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
                    <span class="animate-pulse text-cyan-300 text-lg">📡</span>
                    <span class="text-cyan-300 font-mono text-sm tracking-widest uppercase font-bold">${cleanText(data.header.lokasi)}</span>
                </div>
                <p class="text-base md:text-lg leading-relaxed text-white drop-shadow-md">${cleanText(data.about_me)}</p>
            `;

            // 1. Render Projects (With Zoom Hover & High Visibility Overlay)
            renderProjectCards('projects-grid', data.project_experience.projects);

            // 2. Render Skills (With Zoom Hover & High Visibility Overlay)
            renderHoverCards('skills-grid', data.technical_skills, {
                "geospatial_remote_sensing": "🌍",
                "programming_data_science": "💻",
                "numerical_modeling": "🌊"
            }, "h-[22rem]");

            // 3. Render Achievements
            renderAchievementsCard('achievements-container', data.achievements_scientific_contribution);

            setupScrollAnimation();
            setup3DTiltEffect(); // Fitur Zoom aktif di sini
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
        
        // Teks dibuat jauh lebih terang (text-white/text-cyan-100)
        const listHtml = proj.details.map(d => `<li class="flex gap-2 items-start"><span class="text-cyan-300 font-bold">▹</span><span class="text-sm font-semibold text-slate-100">${cleanText(d)}</span></li>`).join('');
        
        let docLink = proj.portofolio_documentation ? 
            `<a href="${cleanText(proj.portofolio_documentation)}" target="_blank" class="mt-4 inline-flex items-center justify-center w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 rounded-lg text-[11px] font-bold tracking-widest transition-colors z-50 relative pointer-events-auto shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                [ ACCESS SYSTEM DOCS ↗ ]
            </a>` : '';

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 h-[22rem] flex flex-col items-center justify-center text-center rounded-2xl fade-in-up cursor-pointer`;
        
        card.innerHTML = `
            <!-- PREVIEW (Fades out gently on hover) -->
            <div class="transition-opacity duration-300 group-hover:opacity-0 flex flex-col items-center w-full">
                <div class="text-7xl mb-4 drop-shadow-[0_0_25px_rgba(45,212,191,0.8)]">${icon}</div>
                <h3 class="text-xl font-extrabold text-cyan-300 font-mono tracking-wide leading-snug drop-shadow-md">${title.split('-')[0]}</h3>
                <div class="mt-5 px-4 py-1.5 border border-cyan-400/50 rounded-full text-[11px] text-cyan-300 font-mono font-bold animate-pulse bg-cyan-950/60 shadow-lg">HOVER TO DECRYPT</div>
            </div>

            <!-- FULL TEXT OVERLAY (Fades in on hover with Pitch Black background for high readability) -->
            <div class="absolute inset-0 bg-black/98 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col text-left overflow-y-auto z-10 border border-cyan-300 rounded-2xl shadow-2xl">
                <div class="sticky top-0 bg-black/98 pb-2 mb-4 border-b border-cyan-400/50">
                    <div class="text-[10px] text-cyan-400 font-mono font-bold mb-1">> ROLE: ${role}</div>
                    <h4 class="text-cyan-200 font-extrabold font-mono text-sm leading-tight">${title}</h4>
                </div>
                <ul class="text-sm space-y-4 text-slate-100 font-mono flex-grow">
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
        const listHtml = items.map(i => `<li class="flex gap-2 items-start"><span class="text-cyan-300 font-bold">▹</span><span class="text-sm font-semibold text-slate-100">${cleanText(i)}</span></li>`).join('');

        const card = document.createElement('div');
        card.className = `glass-card light-sweep tilt-element group p-6 ${heightClass} flex flex-col items-center justify-center text-center rounded-2xl fade-in-up cursor-pointer`;
        
        card.innerHTML = `
            <div class="transition-opacity duration-300 group-hover:opacity-0 flex flex-col items-center w-full">
                <div class="text-7xl mb-4 drop-shadow-[0_0_25px_rgba(45,212,191,0.8)]">${icon}</div>
                <h3 class="text-xl font-extrabold text-cyan-300 font-mono tracking-wide drop-shadow-md">${title}</h3>
                <div class="mt-5 px-4 py-1.5 border border-cyan-400/50 rounded-full text-[11px] text-cyan-300 font-mono font-bold animate-pulse bg-cyan-950/60 shadow-lg">HOVER TO SCAN DATA</div>
            </div>

            <div class="absolute inset-0 bg-black/98 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col text-left overflow-y-auto z-10 border border-cyan-300 rounded-2xl shadow-2xl">
                <div class="sticky top-0 bg-black/98 pb-2 mb-4 border-b border-cyan-400/50">
                    <h4 class="text-cyan-200 font-extrabold font-mono text-sm flex items-center gap-2">
                        <span class="animate-spin-slow">⚙️</span> DATA: ${title}
                    </h4>
                </div>
                <ul class="text-sm space-y-4 text-slate-100 font-mono">
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

    let achList = achData.selected_achievements.map(a => `<li class="flex gap-2 items-start"><span class="text-cyan-400 font-extrabold text-lg leading-none">»</span><span class="text-sm font-semibold">${cleanText(a)}</span></li>`).join('');

    container.innerHTML = `
        <div class="glass-card light-sweep tilt-element p-8 md:p-12 rounded-3xl fade-in-up border-cyan-400/50 cursor-default">
            <div class="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-cyan-500/40">
                <div class="text-7xl drop-shadow-[0_0_25px_rgba(45,212,191,0.9)] animate-pulse">🏆</div>
                <div class="text-center md:text-left">
                    <h4 class="text-2xl md:text-3xl font-extrabold text-cyan-100 font-mono text-glow">${cleanText(achData.general)}</h4>
                </div>
            </div>
            <ul class="grid md:grid-cols-2 gap-6 text-slate-100 font-mono">
                ${achList}
            </ul>
        </div>
    `;
}

// 3D TILT EFFECT & ZOOM HOVER
function setup3DTiltEffect() {
    document.querySelectorAll('.tilt-element').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Kalkulasi kemiringan
            const tiltX = ((y - centerY) / centerY) * -12; 
            const tiltY = ((x - centerX) / centerX) * 12;
            
            // Transform ditambah skala 1.08 untuk Zoom luar biasa saat hover
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.08, 1.08, 1.08)`;
        });
        
        el.addEventListener('mouseleave', () => {
            // Reset ke ukuran normal saat kursor pergi
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

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

    // BANK KODE PYTHON DATA SCIENCE, AI, REMOTE SENSING & GEOSAINS
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

    const codes = Array.from({ length: 120 }, () => ({
        text: scripts[Math.floor(Math.random() * scripts.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 2.2 + 0.9,
        fontSize: Math.floor(Math.random() * 4) + 7,
        opacity: Math.random() * 0.35 + 0.35
    }));

    const nodes = Array.from({ length: 70 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        size: Math.random() * 2.5 + 1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // 1. DOKUMEN PYTHON MATRIX SCROLLING (WARNA HIJAU NEON)
        codes.forEach(c => {
            c.y -= c.speed;
            if (c.y < -30) {
                c.y = height + 30;
                c.x = Math.random() * width;
                c.text = scripts[Math.floor(Math.random() * scripts.length)];
            }

            ctx.font = `bold ${c.fontSize}px 'Fira Code', monospace`;
            
            // --- WARNA HIJAU NEON MATRIX ---
            ctx.fillStyle = `rgba(52, 211, 153, ${c.opacity})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#10b981'; // Glow Hijau Neon
            
            ctx.fillText(c.text, c.x, c.y);
            ctx.shadowBlur = 0;
        });

        // 2. JARINGAN DATA NODES
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
                    n.x -= (dx / dist) * 3;
                    n.y -= (dy / dist) * 3;
                }
            }

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#10b981';
            ctx.fill();
            ctx.shadowBlur = 0;

            for (let j = i + 1; j < nodes.length; j++) {
                let dx = n.x - nodes[j].x;
                let dy = n.y - nodes[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(16, 185, 129, ${0.45 - dist / 300})`;
                    ctx.lineWidth = 0.9;
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
