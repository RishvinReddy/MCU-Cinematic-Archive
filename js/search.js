import { knowledgeGraph } from './graph-data.js';
import { SearchEngine } from './search-engine.js';

class CommandCenter {
    constructor() {
        this.dialog = document.getElementById('command-center');
        this.trigger = document.getElementById('search-trigger');
        this.closeBtn = document.getElementById('close-search');
        this.input = document.getElementById('global-search-input');
        this.resultsContainer = document.getElementById('search-results');
        
        this.engine = new SearchEngine();
        this.selectedIndex = -1;
        this.currentResults = [];
        
        this.init();
    }
    
    init() {
        this.trigger?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        
        this.dialog?.addEventListener('click', (e) => {
            if (e.target === this.dialog) this.close();
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.open();
            }
            if (this.dialog?.open) {
                this.handleKeyboard(e);
            }
        });
        
        this.input?.addEventListener('input', (e) => {
            this.selectedIndex = -1;
            this.handleSearch(e.target.value);
        });
    }
    
    async open() {
        if (!this.dialog) return;
        
        this.dialog.showModal();
        this.input.focus();
        
        if (!this.engine.isReady) {
            this.resultsContainer.innerHTML = '<div style="color: var(--clr-text-muted); padding: 1rem;">Loading universe data...</div>';
            await this.engine.initialize();
            this.handleSearch(this.input.value);
        } else {
            this.handleSearch(this.input.value);
        }
    }
    
    close() {
        if (!this.dialog) return;
        this.dialog.close();
        this.input.value = '';
        this.resultsContainer.innerHTML = '';
        this.selectedIndex = -1;
        this.currentResults = [];
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.close();
            return;
        }

        const items = document.querySelectorAll('.search-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % items.length;
            this.updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
            this.updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
                this.executeSelection(this.currentResults[this.selectedIndex].entity);
            } else if (this.currentResults.length > 0) {
                this.executeSelection(this.currentResults[0].entity); // default to first
            }
        }
    }

    updateSelection(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    executeSelection(entity) {
        window.location.href = knowledgeGraph.getEntityUrl(entity);
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.renderEmptyState();
            return;
        }
        
        if (!this.engine.isReady) return;
        
        const results = this.engine.search(query);
        this.currentResults = results; // Store for keyboard nav
        this.renderResults(results);
    }
    
    renderEmptyState() {
        this.resultsContainer.innerHTML = `
            <div style="color: var(--clr-text-muted); text-align: center; padding: 2rem;">
                Type to search the MCU Archive...
            </div>
        `;
        this.currentResults = [];
    }
    
    renderResults(scoredResults) {
        if (scoredResults.length === 0) {
            this.resultsContainer.innerHTML = `
                <div style="color: var(--clr-text-muted); text-align: center; padding: 2rem;">
                    No matches found in the universe.
                </div>
            `;
            return;
        }

        // Group by type
        const grouped = {
            'character': [], 'movie': [], 'event': [], 'organization': [], 'artifact': [], 'location': []
        };
        
        scoredResults.slice(0, 15).forEach(({entity}) => { // Limit to top 15 overall
            if (grouped[entity._type]) {
                grouped[entity._type].push(entity);
            } else {
                grouped[entity._type] = [entity];
            }
        });

        let html = '';
        Object.keys(grouped).forEach(type => {
            const entities = grouped[type];
            if (entities.length === 0) return;

            html += `<div class="search-category-title">${type.toUpperCase()}S</div>`;
            
            entities.forEach((entity, index) => {
                const connectionCount = knowledgeGraph.getRelationshipCount(entity.id);
                const desc = entity.releaseYear || entity.alias || `${connectionCount} connections`;
                const globalIndex = this.currentResults.findIndex(r => r.entity.id === entity.id);

                html += `
                    <div class="search-item ${this.selectedIndex === globalIndex ? 'selected' : ''}" data-index="${globalIndex}" onclick="window.location.href='${knowledgeGraph.getEntityUrl(entity)}'">
                        <div class="search-item-main">
                            <span class="search-item-title">${entity.name}</span>
                            <span class="search-item-meta">${type.charAt(0).toUpperCase() + type.slice(1)} • ${desc}</span>
                        </div>
                        <div class="search-item-actions">
                            <a href="${knowledgeGraph.getEntityUrl(entity)}" class="action-btn">Dossier</a>
                            <a href="connections.html?focus=${entity.id}" class="action-btn" onclick="event.stopPropagation();">Connections</a>
                        </div>
                    </div>
                `;
            });
            html += `<div style="height: 1rem;"></div>`;
        });
        
        this.resultsContainer.innerHTML = html;
        
        // Setup hover states for mouse to sync with keyboard
        document.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.selectedIndex = parseInt(e.currentTarget.getAttribute('data-index'));
                this.updateSelection(document.querySelectorAll('.search-item'));
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CommandCenter();
});
