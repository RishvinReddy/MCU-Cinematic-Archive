import { fetchJSON } from './data-loader.js';
import { knowledgeGraph } from './graph-data.js';

async function initMultiverse() {
    await knowledgeGraph.initialize();
    
    const universes = await fetchJSON('universes.json');
    const branches = await fetchJSON('branches.json');
    const incursions = await fetchJSON('incursions.json');
    
    const container = document.getElementById('multiverse-container');

    if (!universes || universes.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <h3 style="color: var(--clr-text-muted);">MULTIVERSAL DATA RESTRICTED</h3>
                <p>Insufficient divergent timelines recorded in the current archive (Phase One/Two limit).</p>
            </div>
        `;
        return;
    }

    let html = '';

    universes.forEach(universe => {
        // Find branches stemming from this universe
        const relatedBranches = knowledgeGraph.getRelationships(universe.id)
            .filter(r => r.type === 'branches-from' && r.target === universe.id)
            .map(r => knowledgeGraph.getEntity(r.source))
            .filter(Boolean);

        // Find variants originating from this universe
        const relatedVariants = knowledgeGraph.getRelationships(universe.id)
            .filter(r => r.type === 'exists-in' && r.target === universe.id)
            .map(r => knowledgeGraph.getEntity(r.source))
            .filter(Boolean);

        html += `
        <div class="universe-card">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h2 style="margin: 0; color: #fff;">${universe.name}</h2>
                <span class="badge" style="background: ${universe.id === 'universe-earth-616' ? 'var(--clr-accent)' : 'rgba(255,255,255,0.1)'}">
                    ${universe.designation}
                </span>
            </div>
            <p style="color: var(--clr-text-muted); margin-top: 1rem;">
                ${universe.description || 'No description available.'}
            </p>
            
            ${relatedVariants.length > 0 ? `
                <div style="margin-top: 1.5rem;">
                    <strong style="color: #fff; font-size: 0.9rem;">KNOWN VARIANTS</strong>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                        ${relatedVariants.map(v => `<a href="connections.html?focus=${v.id}" class="entity-badge" style="text-decoration: none;">${v.name}</a>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${relatedBranches.length > 0 ? `
                <h4 style="margin-top: 2rem; color: #fff;">Timeline Branches</h4>
                <div class="branch-list">
                    ${relatedBranches.map(branch => {
                        // Find variants originating from this branch
                        const branchVariants = knowledgeGraph.getRelationships(branch.id)
                            .filter(r => r.type === 'originates-from' && r.target === branch.id)
                            .map(r => knowledgeGraph.getEntity(r.source))
                            .filter(Boolean);
                            
                        return `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="color: var(--clr-accent);">${branch.name}</strong>
                                <span style="font-size: 0.75rem; padding: 0.2rem 0.5rem; background: rgba(255,255,255,0.1); border-radius: 12px;">${branch.status}</span>
                            </div>
                            <div style="font-size: 0.9rem; color: var(--clr-text-muted); margin-top: 0.5rem;">Divergence: ${branch.divergencePoint}</div>
                            
                            ${branchVariants.length > 0 ? `
                                <div style="margin-top: 1rem; font-size: 0.85rem;">
                                    <span style="color: var(--clr-text-muted);">Variants:</span> 
                                    ${branchVariants.map(v => `<a href="connections.html?focus=${v.id}" style="color: #fff; margin-left: 0.5rem;">${v.name}</a>`).join(', ')}
                                </div>
                            ` : ''}
                        </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}
        </div>
        `;
    });

    if (incursions && incursions.length > 0) {
        html += `
            <div style="margin-top: 4rem; text-align: center;">
                <h3 style="color: #ff4444; letter-spacing: 2px;">DETECTED INCURSIONS</h3>
                <div style="display: grid; gap: 1rem; margin-top: 1.5rem;">
                    ${incursions.map(inc => `
                        <div style="border: 1px solid rgba(255,68,68,0.3); padding: 1.5rem; border-radius: 8px; background: rgba(255,68,68,0.05);">
                            <h4 style="color: #ff4444; margin: 0 0 0.5rem 0;">${inc.name}</h4>
                            <div style="color: var(--clr-text-muted); font-size: 0.9rem;">Status: ${inc.status}</div>
                            <p style="font-size: 0.9rem; margin-top: 0.5rem;">${inc.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;

    if (typeof gsap !== 'undefined') {
        gsap.from('.universe-card', { opacity: 0, y: 30, stagger: 0.2, duration: 1, ease: 'power3.out' });
    }
}

document.addEventListener('DOMContentLoaded', initMultiverse);
