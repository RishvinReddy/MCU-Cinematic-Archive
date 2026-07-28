import { fetchJSON, loadCoreData } from './data-loader.js';
import { knowledgeGraph } from './graph-data.js';

async function initMoviesPage() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    const coreData = await loadCoreData();
    if (!coreData.movies) return;

    if (movieId) {
        // Render Single Movie Dossier
        document.getElementById('movies-list-container').style.display = 'none';
        document.getElementById('dossier-container').style.display = 'block';
        renderMovieDossier(movieId, coreData);
    } else {
        // Render Movies List
        document.getElementById('dossier-container').style.display = 'none';
        document.getElementById('movies-list-container').style.display = 'block';
        renderMoviesList(coreData.movies);
    }
}

function renderMoviesList(movies) {
    const grid = document.getElementById('movies-grid');
    if (!grid) return;
    
    grid.innerHTML = movies.map(movie => {
        let sagaClass = '';
        if (movie.saga === 'Infinity Saga') sagaClass = 'saga-infinity';
        else if (movie.saga === 'Multiverse Saga') sagaClass = 'saga-multiverse';

        return `
        <a href="movies.html?id=${movie.id}" class="movie-card ${sagaClass}">
            <div class="movie-card-inner hover-glow">
                <div class="movie-card-placeholder">Poster Placeholder</div>
                <div class="movie-card-info">
                    <h3>${movie.title}</h3>
                    <span>${movie.releaseYear}</span>
                </div>
            </div>
        </a>
    `}).join('');
}

function renderMovieDossier(movieId, coreData) {
    const movie = coreData.movies.find(m => m.id === movieId);
    if (!movie) {
        document.getElementById('dossier-container').innerHTML = `<h2>Movie not found.</h2>`;
        return;
    }

    // Apply saga styling to container
    const dossierContainer = document.getElementById('dossier-container');
    dossierContainer.className = 'container dossier-grid'; // reset
    if (movie.saga === 'Infinity Saga') dossierContainer.classList.add('saga-infinity');
    else if (movie.saga === 'Multiverse Saga') dossierContainer.classList.add('saga-multiverse');

    // Populate Header
    document.getElementById('movie-phase').textContent = `PHASE ${movie.phase} • ${movie.saga.replace('-', ' ').toUpperCase()}`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-specs').innerHTML = `
        <span>Released: ${movie.releaseDate}</span>
        <span>Director: ${movie.director}</span>
        <span>Runtime: ${movie.runtime}</span>
    `;

    // Populate Overview
    document.getElementById('movie-synopsis').textContent = movie.synopsis;

    // Populate Characters
    const charactersList = document.getElementById('movie-characters');
    if (movie.characters && coreData.characters) {
        const chars = movie.characters.map(charId => coreData.characters.find(c => c.id === charId)).filter(Boolean);
        charactersList.innerHTML = chars.map(c => `
            <a href="characters.html?id=${c.id}" class="entity-badge">
                <strong>${c.name}</strong> 
                <span class="muted">${c.alias ? `(${c.alias})` : ''}</span>
            </a>
        `).join('');
    }

    // Populate events, locations, artifacts logic remains...
    const eventsList = document.getElementById('movie-events');
    if (movie.events && coreData.events) {
        const events = movie.events.map(evId => coreData.events.find(e => e.id === evId)).filter(Boolean);
        eventsList.innerHTML = events.map(e => `
            <div class="entity-badge">
                <strong>${e.name}</strong>
                <div style="font-size: 0.8rem; color: var(--clr-text-muted); margin-top: 4px;">${e.consequences ? e.consequences[0] : ''}</div>
            </div>
        `).join('');
    }

    const locationsList = document.getElementById('movie-locations');
    if (movie.locations) {
        locationsList.innerHTML = movie.locations.map(loc => `<li>${loc.replace('loc-', '').replace('-', ' ').toUpperCase()}</li>`).join('');
    }

    const artifactsList = document.getElementById('movie-artifacts');
    if (movie.artifacts) {
        artifactsList.innerHTML = movie.artifacts.map(art => `<li>${art.replace('artifact-', '').replace('-', ' ').toUpperCase()}</li>`).join('');
    }

    // Contextual Intelligence (Connections)
    const connectionsContainer = document.getElementById('movie-connections');
    if (connectionsContainer && typeof knowledgeGraph !== 'undefined') {
        const relationships = knowledgeGraph.getRelationships(movieId);
        let connHtml = relationships.map(rel => {
            const isSource = rel.source === movieId;
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
            connHtml += `<a href="connections.html?focus=${movieId}" class="btn-primary" style="display:block; text-align:center; margin-top:1rem;">Explore Connections</a>`;
        } else {
            connHtml = `<div class="muted">No direct connections found.</div>`;
        }
        connectionsContainer.innerHTML = connHtml;
    }

    // Provenance
    if (movie.sources && movie.sources.length > 0) {
        let sourcesHtml = `<section class="dossier-section" style="margin-top: 3rem; border-top: 1px solid var(--clr-border); padding-top: 2rem;">
            <h3 style="color: var(--clr-text-muted); font-size: 0.9rem;">OFFICIAL SOURCES</h3>
            <ul style="list-style: none; padding: 0; margin-top: 1rem;">
                ${movie.sources.map(src => `<li style="margin-bottom: 0.5rem;"><a href="${src.url}" target="_blank" style="color: var(--clr-accent); text-decoration: none;">${src.title}</a> <span style="color: var(--clr-text-muted); font-size: 0.8rem;">(${src.publisher} • ${src.type})</span></li>`).join('')}
            </ul>
        </section>`;
        document.querySelector('.dossier-main').insertAdjacentHTML('beforeend', sourcesHtml);
    }

    // Animate Dossier
    if (typeof gsap !== 'undefined') {
        gsap.from('.dossier-header > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
        gsap.from('.dossier-section', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
}

document.addEventListener('DOMContentLoaded', initMoviesPage);
