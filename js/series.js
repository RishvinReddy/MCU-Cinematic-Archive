import { loadCoreData } from './data-loader.js';
import { knowledgeGraph } from './graph-data.js';

async function initSeriesPage() {
    const params = new URLSearchParams(window.location.search);
    const seriesId = params.get('id');
    
    if (!seriesId) {
        document.querySelector('.dossier-grid').innerHTML = '<h2 class="muted">No series specified.</h2>';
        return;
    }

    const coreData = await loadCoreData();
    await knowledgeGraph.initialize();
    
    const series = coreData.series?.find(s => s.id === seriesId);

    if (!series) {
        document.querySelector('.dossier-grid').innerHTML = `<h2 class="muted">Series data for '${seriesId}' not found in archive.</h2>`;
        return;
    }

    // Render basic metadata
    document.title = `${series.title} | MCU Archive`;
    document.getElementById('series-title').textContent = series.title;
    document.getElementById('series-year').textContent = `${series.releaseYear} • ${series.phase}`;
    document.getElementById('series-synopsis').innerHTML = `<p>${series.synopsis || 'Classification unknown. Data restricted.'}</p>`;

    // Contextual Intelligence (Connections)
    const connectionsContainer = document.getElementById('series-connections');
    if (connectionsContainer && typeof knowledgeGraph !== 'undefined') {
        const relationships = knowledgeGraph.getRelationships(seriesId);
        let connHtml = relationships.map(rel => {
            const isSource = rel.source === seriesId;
            const connectedId = isSource ? rel.target : rel.source;
            const connectedEntity = knowledgeGraph.getEntity(connectedId);
            if (!connectedEntity) return '';
            
            return `
                <div class="entity-badge">
                    <strong><a href="${knowledgeGraph.getEntityUrl(connectedEntity)}">${connectedEntity.name}</a></strong>
                    <div style="font-size: 0.8rem; color: var(--clr-text-muted); margin-top: 4px;">└── ${rel.type.replace('-', ' ')}</div>
                </div>
            `;
        }).join('');
        
        if (connHtml) {
            connHtml += `<a href="connections.html?focus=${seriesId}" class="btn-primary" style="display:block; text-align:center; margin-top:1rem;">Explore Connections</a>`;
        } else {
            connHtml = `<div class="muted">No direct connections found.</div>`;
        }
        connectionsContainer.innerHTML = connHtml;
    }

    // Seasons support
    const seasonsContainer = document.getElementById('series-seasons');
    if (series.seasons && series.seasons.length > 0) {
        let seasonsHtml = series.seasons.map(s => `
            <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem;">
                <h4>${s.title} (${s.releaseYear})</h4>
                <div style="color: var(--clr-text-muted); font-size: 0.9rem; margin-top: 0.5rem;">${s.episodes} Episodes</div>
                ${s.synopsis ? `<p style="font-size: 0.9rem; margin-top: 0.5rem;">${s.synopsis}</p>` : ''}
            </div>
        `).join('');
        seasonsContainer.innerHTML = seasonsHtml;
    } else {
        seasonsContainer.innerHTML = '<div class="muted">Season data unavailable.</div>';
    }

    // Animate Dossier
    if (typeof gsap !== 'undefined') {
        gsap.from('.dossier-header > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
        gsap.from('.dossier-section', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
}

document.addEventListener('DOMContentLoaded', initSeriesPage);
