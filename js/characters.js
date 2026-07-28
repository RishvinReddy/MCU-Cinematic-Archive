import { fetchJSON, loadCoreData } from './data-loader.js';
import { knowledgeGraph } from './graph-data.js';

async function initCharactersPage() {
    const params = new URLSearchParams(window.location.search);
    const charId = params.get('id');

    const coreData = await loadCoreData();
    if (!coreData.characters) return;

    if (charId) {
        document.getElementById('characters-list-container').style.display = 'none';
        document.getElementById('dossier-container').style.display = 'block';
        renderCharacterDossier(charId, coreData);
    } else {
        document.getElementById('dossier-container').style.display = 'none';
        document.getElementById('characters-list-container').style.display = 'block';
        renderCharactersList(coreData.characters);
    }
}

function renderCharactersList(characters) {
    const grid = document.getElementById('characters-grid');
    if (!grid) return;
    
    grid.innerHTML = characters.map(char => `
        <a href="characters.html?id=${char.id}" class="movie-card">
            <div class="movie-card-inner hover-glow" style="height: 300px;">
                <div class="movie-card-placeholder">Portrait Placeholder</div>
                <div class="movie-card-info">
                    <h3>${char.name}</h3>
                    <span>${char.alias || 'Character'}</span>
                </div>
            </div>
        </a>
    `).join('');
}

function renderCharacterDossier(charId, coreData) {
    let char = coreData.characters?.find(c => c.id === charId);
    let isVariant = false;
    
    if (!char && coreData.variants) {
        char = coreData.variants.find(v => v.id === charId);
        isVariant = true;
    }
    
    if (!char) {
        document.getElementById('dossier-container').innerHTML = `<h2>Character/Variant not found.</h2>`;
        return;
    }

    document.getElementById('char-universe').textContent = isVariant ? 'MULTIVERSAL VARIANT' : (char.universe || 'Earth-616').toUpperCase();
    document.getElementById('char-name').textContent = char.name;
    document.getElementById('char-specs').innerHTML = `
        ${isVariant ? `<span>Base Character: <a href="characters.html?id=${char.baseCharacter}" style="color: var(--clr-accent)">View Original</a></span>` : ''}
        ${char.alias ? `<span>Alias: ${char.alias}</span>` : ''}
        <span>Status: ${char.status || 'Unknown'}</span>
    `;

    document.getElementById('char-biography').textContent = char.biography || 'Biography unavailable.';

    // Appearances (reverse-lookup from movies.json where this character is in characters array)
    const appearancesList = document.getElementById('char-appearances');
    if (coreData.movies) {
        const moviesIn = coreData.movies.filter(m => m.characters && m.characters.includes(char.id));
        appearancesList.innerHTML = moviesIn.map(m => `
            <a href="movies.html?id=${m.id}" class="entity-badge">
                <strong>${m.title}</strong>
                <span class="muted">${m.releaseYear}</span>
            </a>
        `).join('');
    }

    // Affiliations
    const affList = document.getElementById('char-affiliations');
    if (char.affiliations) {
        affList.innerHTML = char.affiliations.map(aff => `<li>${aff.replace('org-', '').replace('-', ' ').toUpperCase()}</li>`).join('');
    }

    // Contextual Intelligence (Connections)
    const connectionsContainer = document.getElementById('char-connections');
    if (connectionsContainer && typeof knowledgeGraph !== 'undefined') {
        const relationships = knowledgeGraph.getRelationships(charId);
        let connHtml = relationships.map(rel => {
            const isSource = rel.source === charId;
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
            connHtml += `<a href="connections.html?focus=${charId}" class="btn-primary" style="display:block; text-align:center; margin-top:1rem;">Explore Connections</a>`;
        } else {
            connHtml = `<div class="muted">No direct connections found.</div>`;
        }
        connectionsContainer.innerHTML = connHtml;
    }

    // Provenance
    if (char.sources && char.sources.length > 0) {
        let sourcesHtml = `<section class="dossier-section" style="margin-top: 3rem; border-top: 1px solid var(--clr-border); padding-top: 2rem;">
            <h3 style="color: var(--clr-text-muted); font-size: 0.9rem;">OFFICIAL SOURCES</h3>
            <ul style="list-style: none; padding: 0; margin-top: 1rem;">
                ${char.sources.map(src => `<li style="margin-bottom: 0.5rem;"><a href="${src.url}" target="_blank" style="color: var(--clr-accent); text-decoration: none;">${src.title}</a> <span style="color: var(--clr-text-muted); font-size: 0.8rem;">(${src.publisher} • ${src.type})</span></li>`).join('')}
            </ul>
        </section>`;
        document.querySelector('.dossier-main').insertAdjacentHTML('beforeend', sourcesHtml);
    }

    if (typeof gsap !== 'undefined') {
        gsap.from('.dossier-header > *', { opacity: 0, x: -20, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
        gsap.from('.dossier-section', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
}

document.addEventListener('DOMContentLoaded', initCharactersPage);
