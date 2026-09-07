document.addEventListener("DOMContentLoaded", () => {
    
    // Fungsi pembantu untuk memformat key JSON jadi judul yang cantik
    const formatTitle = (str) => {
        return str.split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
    };

    // Ambil data JSON
    fetch('education.json')
        .then(response => response.json())
        .then(data => {
            
            // 1. HEADER & SUMMARY
            // Memberikan efek gradient text pada Title
            document.getElementById('edu-title').innerHTML = `
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 text-glow">
                    ${data.header.title.replace('[cite: 3]', '')}
                </span>
            `;
            document.getElementById('edu-summary').textContent = data.ringkasan_profil.replace('[cite: 3]', '');

            // 2. KEAHLIAN UTAMA (SKILLS)
            const skillsGrid = document.getElementById('skills-grid');
            const skillsData = data.keahlian_utama_pendidikan;
            
            const skillIcons = {
                "perancangan_kurikulum_asesmen": "📝",
                "metodologi_pengajaran_pedagogi": "🧠",
                "pengembangan_media_teknologi_pembelajaran": "💻",
                "komunikasi_akademik_facilitation": "🎙️"
            };

            for (const [key, items] of Object.entries(skillsData)) {
                let card = document.createElement('div');
                card.className = "glass-panel p-8 rounded-2xl fade-in-up";
                
                let icon = skillIcons[key] || "✨";
                
                let listHtml = items.map(item => `<li>${item.replace('[cite: 3]', '')}</li>`).join('');
                
                card.innerHTML = `
                    <div class="text-4xl mb-4">${icon}</div>
                    <h4 class="text-xl font-bold text-white mb-4 border-b border-emerald-900/50 pb-2">
                        ${formatTitle(key)}
                    </h4>
                    <ul class="neon-list">
                        ${listHtml}
                    </ul>
                `;
                skillsGrid.appendChild(card);
            }

            // 3. PENGALAMAN KERJA / PORTOFOLIO
            const expContainer = document.getElementById('experience-container');
            const expData = data.pengalaman_kerja_portofolio_pedagogi;

            for (const [key, items] of Object.entries(expData)) {
                let card = document.createElement('div');
                // Layout horizontal untuk experience agar berbeda dengan skills grid
                card.className = "glass-panel p-6 md:p-8 rounded-2xl fade-in-up border-l-4 border-l-emerald-500";
                
                let listHtml = items.map(item => `<li>${item.replace('[cite: 3]', '')}</li>`).join('');
                
                card.innerHTML = `
                    <h4 class="text-lg md:text-xl font-bold text-emerald-300 mb-4 uppercase tracking-wider">
                        ${formatTitle(key)}
                    </h4>
                    <ul class="neon-list">
                        ${listHtml}
                    </ul>
                `;
                expContainer.appendChild(card);
            }

            // 4. PRESTASI (ACHIEVEMENTS)
            const achContainer = document.getElementById('achievements-container');
            const achData = data.prestasi;

            for (const [key, items] of Object.entries(achData)) {
                let card = document.createElement('div');
                card.className = "glass-panel p-8 rounded-2xl fade-in-up";
                
                let title = key === "tingkat_perguruan_tinggi_profesional" ? "🏆 Prestasi Profesional & Kampus" : "🏅 Prestasi Tingkat SMA";
                
                let listHtml = items.map(item => `<li>${item.replace('[cite: 3]', '')}</li>`).join('');
                
                card.innerHTML = `
                    <h4 class="text-xl font-bold text-white mb-4 border-b border-emerald-900/50 pb-2">
                        ${title}
                    </h4>
                    <ul class="neon-list">
                        ${listHtml}
                    </ul>
                `;
                achContainer.appendChild(card);
            }

            // Memicu Intersection Observer setelah elemen di-render ke DOM
            setupScrollAnimation();
        })
        .catch(err => console.error("Error loading education.json:", err));
});

// FUNGSI ANIMASI SCROLL (Memicu class fade-in-up saat elemen masuk viewport)
function setupScrollAnimation() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animasi hanya berjalan 1x
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}
