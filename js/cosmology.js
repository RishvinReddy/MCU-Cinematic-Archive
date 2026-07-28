import { loadCoreData } from './data-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await loadCoreData();
        // Since loadCoreData might not load cosmology by default if we didn't update it, let's just fetch it here
        const response = await fetch('./data/cosmology.json');
        const cosmology = await response.json();
        
        const grid = document.getElementById('cosmology-grid');
        const detailView = document.getElementById('cosmology-detail');
        const mainHeader = document.querySelector('.page-header');
        
        const titleEl = document.getElementById('detail-title');
        const descEl = document.getElementById('detail-desc');
        const contentEl = document.getElementById('detail-content');
        const backBtn = document.getElementById('back-to-cosmology');

        function renderGrid() {
            grid.innerHTML = '';
            grid.style.display = 'grid';
            detailView.style.display = 'none';
            mainHeader.style.display = 'block';

            cosmology.forEach(item => {
                const card = document.createElement('div');
                card.className = 'storyline-card';
                card.innerHTML = `
                    <div class="meta-badge" style="margin-bottom: 0.5rem;">${item.type}</div>
                    <div class="meta-badge" style="margin-bottom: 0.5rem; background: rgba(0, 150, 255, 0.1); color: #8ab4f8; border-color: rgba(138, 180, 248, 0.2);">${item.continuity}</div>
                    <h3 class="storyline-title">${item.name}</h3>
                    <p class="storyline-desc">${item.description}</p>
                `;
                card.addEventListener('click', () => showDetail(item));
                grid.appendChild(card);
            });
            
            gsap.fromTo('.storyline-card', 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }

        function showDetail(item) {
            grid.style.display = 'none';
            mainHeader.style.display = 'none';
            detailView.style.display = 'block';

            titleEl.textContent = item.name;
            descEl.textContent = item.description;
            
            contentEl.innerHTML = `
                <div class="meta-badge">${item.type}</div>
                <div class="meta-badge">${item.continuity} Continuity</div>
                <div class="meta-badge">${item.provenance}</div>
                <h4 style="margin-top: 2rem; margin-bottom: 1rem; font-size: 1.2rem; color: var(--clr-accent);">Entities in this realm:</h4>
                <p class="muted">Cross-referencing entities mapped to ${item.id} will appear here.</p>
            `;
            
            window.scrollTo(0, 0);
            gsap.fromTo(detailView, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        }

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderGrid();
        });

        renderGrid();

    } catch (error) {
        console.error("Error loading cosmology data:", error);
    }
});
