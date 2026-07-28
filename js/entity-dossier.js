import { fetchJSON, loadCoreData } from './data-loader.js';
import { knowledgeGraph } from './graph-data.js';

const DOSSIER_CONFIG = {
    'event': {
        label: "EVENT",
        fields: [
            { key: 'date', label: 'Date / Era' },
            { key: 'location', label: 'Location' },
            { key: 'participants', label: 'Key Participants', isList: true },
            { key: 'consequences', label: 'Consequences', isList: true }
        ]
    },
    'location': {
        label: "LOCATION",
        fields: [
            { key: 'realm', label: 'Realm' },
            { key: 'planet', label: 'Planet' },
            { key: 'region', label: 'Region' }
        ]
    },
    'artifact': {
        label: "ARTIFACT",
        fields: [
            { key: 'origin', label: 'Origin' },
            { key: 'abilities', label: 'Abilities', isList: true },
            { key: 'owners', label: 'Known Owners', isList: true }
        ]
    },
    'organization': {
        label: "ORGANIZATION",
        fields: [
            { key: 'founded', label: 'Founded' },
            { key: 'headquarters', label: 'Headquarters' },
            { key: 'status', label: 'Status' }
        ]
    },
    'technology': {
        label: "TECHNOLOGY",
        fields: [
            { key: 'creator', label: 'Creator' },
            { key: 'purpose', label: 'Purpose' }
        ]
    }
};

async function initEntityPage() {
    const params = new URLSearchParams(window.location.search);
    const entityId = params.get('id');
    
    if (!entityId) {
        document.querySelector('.dossier-grid').innerHTML = '<h2 class="muted">No entity specified.</h2>';
        return;
    }

    // Determine type from ID prefix
    const typeMap = {
        'event-': 'event',
        'loc-': 'location',
        'artifact-': 'artifact',
        'org-': 'organization',
        'tech-': 'technology'
    };
    
    let entityType = null;
    for (const prefix in typeMap) {
        if (entityId.startsWith(prefix)) {
            entityType = typeMap[prefix];
            break;
        }
    }

    if (!entityType) {
        document.querySelector('.dossier-grid').innerHTML = '<h2 class="muted">Unknown entity type.</h2>';
        return;
    }

    const config = DOSSIER_CONFIG[entityType];
    
    // Load knowledge graph
    await knowledgeGraph.initialize();
    
    const entity = knowledgeGraph.getEntity(entityId);

    if (!entity) {
        document.querySelector('.dossier-grid').innerHTML = `<h2 class="muted">Entity not found in archive.</h2>`;
        return;
    }

    // Render Header & Overview
    document.title = `${entity.name} | MCU Archive`;
    document.getElementById('entity-name').textContent = entity.name;
    document.getElementById('entity-badge-label').textContent = config.label;
    document.getElementById('entity-description').innerHTML = `<p>${entity.description || entity.synopsis || 'Classification unknown. Data restricted.'}</p>`;

    // Render Type-Specific Fields
    const metaContainer = document.getElementById('entity-meta-fields');
    if (metaContainer) {
        let metaHtml = '';
        config.fields.forEach(field => {
            const val = entity[field.key];
            if (val) {
                if (field.isList && Array.isArray(val)) {
                    metaHtml += `<div class="meta-item">
                        <span class="meta-label">${field.label}</span>
                        <ul class="simple-list" style="margin-top:0.5rem;">
                            ${val.map(v => `<li>${v}</li>`).join('')}
                        </ul>
                    </div>`;
                } else {
                    metaHtml += `<div class="meta-item">
                        <span class="meta-label">${field.label}</span>
                        <span class="meta-value">${val}</span>
                    </div>`;
                }
            }
        });
        metaContainer.innerHTML = metaHtml;
    }

    // Contextual Connections
    const connectionsContainer = document.getElementById('entity-connections');
    if (connectionsContainer) {
        const relationships = knowledgeGraph.getRelationships(entityId);
        let connHtml = relationships.map(rel => {
            const isSource = rel.source === entityId;
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
            connHtml += `<a href="connections.html?focus=${entityId}" class="btn-primary" style="display:block; text-align:center; margin-top:1rem;">Explore Connections</a>`;
        } else {
            connHtml = `<div class="muted">No connections recorded.</div>`;
        }
        connectionsContainer.innerHTML = connHtml;
    }

    // Provenance
    if (entity.sources && entity.sources.length > 0) {
        let sourcesHtml = `<section class="dossier-section" style="margin-top: 3rem; border-top: 1px solid var(--clr-border); padding-top: 2rem;">
            <h3 style="color: var(--clr-text-muted); font-size: 0.9rem;">OFFICIAL SOURCES</h3>
            <ul style="list-style: none; padding: 0; margin-top: 1rem;">
                ${entity.sources.map(src => `<li style="margin-bottom: 0.5rem;"><a href="${src.url}" target="_blank" style="color: var(--clr-accent); text-decoration: none;">${src.title}</a> <span style="color: var(--clr-text-muted); font-size: 0.8rem;">(${src.publisher} • ${src.type})</span></li>`).join('')}
            </ul>
        </section>`;
        document.querySelector('.dossier-main').insertAdjacentHTML('beforeend', sourcesHtml);
    }

    // GSAP Animation
    if (typeof gsap !== 'undefined') {
        gsap.from('.dossier-header > *', { opacity: 0, x: -20, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
        gsap.from('.dossier-section', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
}

document.addEventListener('DOMContentLoaded', initEntityPage);
