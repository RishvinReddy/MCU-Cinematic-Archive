import { fetchJSON, loadCoreData } from './data-loader.js';

async function initStorylinesPage() {
    const coreData = await loadCoreData();
    const storylines = await fetchJSON('storylines.json');
    
    if (!storylines) return;

    const params = new URLSearchParams(window.location.search);
    const slId = params.get('id');

    if (slId) {
        document.getElementById('storylines-list-view').style.display = 'none';
        document.getElementById('storyline-detail-view').style.display = 'block';
        renderStorylineDetail(slId, storylines, coreData);
    } else {
        document.getElementById('storyline-detail-view').style.display = 'none';
        document.getElementById('storylines-list-view').style.display = 'block';
        renderStorylinesList(storylines);
    }
}

function renderStorylinesList(storylines) {
    const grid = document.getElementById('storylines-grid');
    if (!grid) return;
    
    grid.innerHTML = storylines.map(sl => `
        <div class="storyline-card" onclick="window.location.href='storylines.html?id=${sl.id}'">
            <h3 class="storyline-title">${sl.title}</h3>
            <p class="storyline-desc">${sl.description}</p>
        </div>
    `).join('');
    
    if (typeof gsap !== 'undefined') {
        gsap.from('.storyline-card', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
    }
}

function renderStorylineDetail(slId, storylines, coreData) {
    const sl = storylines.find(s => s.id === slId);
    if (!sl) {
        document.getElementById('storyline-detail-view').innerHTML = `<h2>Storyline not found.</h2>`;
        return;
    }

    document.getElementById('sl-title').textContent = sl.title;
    document.getElementById('sl-desc').textContent = sl.description;

    const pathContainer = document.getElementById('sl-path');
    
    // Combine movies, series, events for lookup
    const entities = [...(coreData.movies||[]), ...(coreData.series||[]), ...(coreData.events||[])];
    
    let pathHtml = '';
    
    sl.steps.forEach((step, index) => {
        const entity = entities.find(e => e.id === step.entityId);
        const entityName = entity ? (entity.title || entity.name) : "Unknown Entity";
        const url = entity ? (entity.id.startsWith('movie-') ? 'movies.html' : (entity.id.startsWith('series-') ? 'series.html' : 'events.html')) : '#';
        
        pathHtml += `
            <div class="path-step">
                <div class="path-number">${index + 1}</div>
                <div class="path-content">
                    <h3 class="path-entity"><a href="${url}?id=${step.entityId}">${entityName}</a></h3>
                    <p class="muted">${step.description}</p>
                </div>
            </div>
        `;
    });
    
    pathContainer.innerHTML = pathHtml;
    
    if (typeof gsap !== 'undefined') {
        gsap.from('#sl-title, #sl-desc', { opacity: 0, x: -20, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
        gsap.from('.path-step', { opacity: 0, x: 20, stagger: 0.2, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
}

document.addEventListener('DOMContentLoaded', initStorylinesPage);
