import { fetchJSON, loadCoreData } from './data-loader.js';
import { knowledgeGraph } from './graph-data.js';

let timelineData = [];
let currentMode = 'release'; // 'release' or 'chronological'
let activeFilters = new Set(['movie', 'series', 'event']);

async function initTimeline() {
    await knowledgeGraph.initialize();
    timelineData = await fetchJSON('timeline.json');

    if (!timelineData) return;

    // Set initial mode from URL if present
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'chronological') {
        currentMode = 'chronological';
    }

    // Bind filters
    document.querySelectorAll('.timeline-filter').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.add(e.target.value);
            } else {
                activeFilters.delete(e.target.value);
            }
            renderTimeline();
        });
        // Sync DOM initial state
        if (checkbox.checked) activeFilters.add(checkbox.value);
        else activeFilters.delete(checkbox.value);
    });

    updateActiveButton();
    renderTimeline();

    // Event Listeners for toggles
    document.getElementById('btn-release')?.addEventListener('click', () => setMode('release'));
    document.getElementById('btn-chronological')?.addEventListener('click', () => setMode('chronological'));
}

function setMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    
    // Update URL state
    const url = new URL(window.location);
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url);

    updateActiveButton();
    renderTimeline();
}

function updateActiveButton() {
    const btnRel = document.getElementById('btn-release');
    const btnChrono = document.getElementById('btn-chronological');
    
    if (currentMode === 'release') {
        btnRel.style.background = 'var(--clr-text-main)';
        btnRel.style.color = 'var(--clr-bg-base)';
        btnChrono.style.background = 'transparent';
        btnChrono.style.color = 'var(--clr-text-main)';
    } else {
        btnChrono.style.background = 'var(--clr-text-main)';
        btnChrono.style.color = 'var(--clr-bg-base)';
        btnRel.style.background = 'transparent';
        btnRel.style.color = 'var(--clr-text-main)';
    }
}

function getDecadeGroup(year) {
    return `${Math.floor(year / 10) * 10}s`;
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    // Filter data based on active checkboxes and merge with entities
    let filteredData = timelineData.map(entry => {
        const entity = knowledgeGraph.getEntity(entry.entityId);
        return { ...entry, entity };
    }).filter(item => {
        if (!item.entity) return false;
        return activeFilters.has(item.entity._type);
    });

    // Sort data
    filteredData.sort((a, b) => {
        if (currentMode === 'release') {
            const yearA = parseInt(a.entity.releaseYear) || 9999;
            const yearB = parseInt(b.entity.releaseYear) || 9999;
            return yearA - yearB;
        } else {
            return a.chronologicalYear - b.chronologicalYear;
        }
    });

    // Group by Phase or Decade
    let html = '<div class="timeline-wrapper">';
    let currentGroup = null;

    filteredData.forEach((item, index) => {
        const groupLabel = currentMode === 'release' 
            ? `PHASE ${item.entity.phase || '?'}` 
            : getDecadeGroup(item.chronologicalYear);
        
        if (groupLabel !== currentGroup) {
            html += `<h3 class="timeline-group-header">${groupLabel}</h3>`;
            currentGroup = groupLabel;
        }

        const displayYear = currentMode === 'release' ? (item.entity.releaseYear || item.chronologicalYear) : item.chronologicalYear;
        const description = item.entity.synopsis || item.entity.description || '';
        
        let sagaClass = '';
        if (item.entity.saga === 'Infinity Saga') sagaClass = 'saga-infinity';
        else if (item.entity.saga === 'Multiverse Saga') sagaClass = 'saga-multiverse';

        html += `
            <div class="timeline-entry gsap-timeline-item ${sagaClass}">
                <div class="timeline-marker" style="box-shadow: 0 0 10px var(--saga-glow, var(--clr-border)); border-color: var(--saga-color, var(--clr-border));"></div>
                <div class="timeline-content hover-glow">
                    <span class="timeline-meta">${item.entity._type.toUpperCase()} • ${displayYear}</span>
                    <h4><a href="${knowledgeGraph.getEntityUrl(item.entity)}">${item.entity.name}</a></h4>
                    <p>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;

    // Animate new timeline render
    if (typeof gsap !== 'undefined') {
        gsap.from('.timeline-group-header', { opacity: 0, x: -20, duration: 0.5, stagger: 0.1 });
        gsap.from('.timeline-entry', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.2 });
    }
}

document.addEventListener('DOMContentLoaded', initTimeline);
