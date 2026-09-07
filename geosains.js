document.addEventListener("DOMContentLoaded", () => {

    const formatTitle = (str) => {
        return str.split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
    };

    // Ambil data JSON khusus geosains.json
    fetch('geosains.json')
        .then(response => response.json())
        .then(data => {

            // 1. HERO & ABOUT ME
            document.getElementById('geo-title').innerHTML = `
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-glow">
                    ${data.header.title.replace('[cite: 4]', '')}
                </span>
            `;
            document.getElementById('geo-about').textContent = data.about_me.replace('[cite: 4]', '');

            // 2. PROJECT EXPERIENCE (EARLY WARNING SYSTEMS)
            const projectsGrid = document.getElementById('projects-grid');
            const projects = data.project_experience.projects;

            projects.forEach(proj => {
                let card = document.createElement('div');
                card.className = "glass-panel p-8 rounded-2xl fade-in-up flex flex-col justify-between";

                let detailsList = proj.details.map(d => `<li>${d.replace('[cite: 4]', '')}</li>`).join('');

                let docLink = proj.portofolio_documentation ? 
                    `<a href="${proj.portofolio_documentation.replace('[cite: 4]', '')}" target="_blank" class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 rounded-xl text-xs font-bold transition">
                        📄 Lihat Dokumentasi Portofolio ↗
                    </a>` : '';

                card.innerHTML = `
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-3">
                            <span class="text-xs font-bold px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full">
                                ${proj.role ? proj.role.replace('[cite: 4]', '') : 'IBF Model'}
                            </span>
                            <span class="text-xl">📡</span>
                        </div>
                        <h4 class="text-xl font-bold text-white mb-4 leading-snug">
                            ${proj.nama.replace('[cite: 4]', '')}
                        </h4>
                        <ul class="neon-list">
                            ${detailsList}
                        </ul>
                    </div>
                    ${docLink}
                `;
                projectsGrid.appendChild(card);
            });

            // 3. TECHNICAL SKILLS GRID
            const skillsGrid = document.getElementById('skills-grid');
            const skills = data.technical_skills;

            const categoryIcons = {
                "geospatial_remote_sensing": "🌍",
                "programming_data_science": "💻",
                "numerical_modeling": "🌊"
            };

            for (const [key, items] of Object.entries(skills)) {
                let card = document.createElement('div');
                card.className = "glass-panel p-6 rounded-2xl fade-in-up";

                let icon = categoryIcons[key] || "⚙️";
                let listHtml = items.map(item => `<li>${item.replace('[cite: 4]', '')}</li>`).join('');

                card.innerHTML = `
                    <div class="text-3xl mb-3">${icon}</div>
                    <h4 class="text-lg font-bold text-cyan-300 mb-4 border-b border-cyan-900/50 pb-2">
                        ${formatTitle(key)}
                    </h4>
                    <ul class="neon-list">
                        ${listHtml}
                    </ul>
                `;
                skillsGrid.appendChild(card);
            }

            // 4. ACHIEVEMENTS & CONTRIBUTIONS
            const achCard = document.getElementById('achievements-card');
            const achData = data.achievements_scientific_contribution;

            let achList = achData.selected_achievements.map(a => `<li>${a.replace('[cite: 4]', '')}</li>`).join('');

            achCard.innerHTML = `
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-3xl">🎤</span>
                    <div>
                        <h4 class="text-xl font-bold text-white">${achData.general.replace('[cite: 4]', '')}</h4>
                        <p class="text-xs text-slate-400">Kontribusi riset nasional & internasional dalam mitigasi risiko bencana.</p>
                    </div>
                </div>
                <div class="border-t border-cyan-900/50 pt-4">
                    <h5 class="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Penghargaan Riset Terpilih:</h5>
                    <ul class="neon-list grid md:grid-cols-2 gap-x-6">
                        ${achList}
                    </ul>
                </div>
            `;

            setupScrollAnimation();
        })
        .catch(err => console.error("Error loading geosains.json:", err));
});

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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}
