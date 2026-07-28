import { knowledgeGraph } from './graph-data.js';

export class SearchEngine {
    constructor() {
        this.isReady = false;
    }

    async initialize() {
        if (!knowledgeGraph.isInitialized) {
            await knowledgeGraph.initialize();
        }
        this.isReady = true;
    }

    _normalize(str) {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/[^a-z0-9\s]/g, "") // Keep alphanumeric and spaces
            .trim();
    }

    search(query) {
        if (!this.isReady || !query) return [];

        const normalizedQuery = this._normalize(query);
        if (!normalizedQuery) return [];

        const queryTokens = normalizedQuery.split(/\s+/);
        const allEntities = knowledgeGraph.getAllEntities();
        
        const scoredResults = [];

        for (const entity of allEntities) {
            let score = 0;
            const name = this._normalize(entity.name);
            const alias = this._normalize(entity.alias || '');
            const aliases = (entity.aliases || []).map(a => this._normalize(a));
            const desc = this._normalize(entity.biography || entity.synopsis || entity.description || '');

            // 1. Exact match (+100)
            if (name === normalizedQuery || alias === normalizedQuery || aliases.includes(normalizedQuery)) {
                score += 100;
            } 
            // 2. Starts with query (+75)
            else if (name.startsWith(normalizedQuery) || alias.startsWith(normalizedQuery)) {
                score += 75;
            }
            // 3. Whole word match (+60)
            else {
                const nameTokens = name.split(/\s+/);
                const hasWholeWordMatch = queryTokens.some(qt => nameTokens.includes(qt));
                if (hasWholeWordMatch) score += 60;
                
                // 4. Substring match (+40)
                else if (name.includes(normalizedQuery)) {
                    score += 40;
                }
            }

            // 5. Alias substring match (+35)
            if (score < 100 && (alias.includes(normalizedQuery) || aliases.some(a => a.includes(normalizedQuery)))) {
                score += 35;
            }

            // 6. Description match (+5)
            if (score === 0 && desc.includes(normalizedQuery)) {
                score += 5;
            }

            if (score > 0) {
                scoredResults.push({ entity, score });
            }
        }

        // Sort by score descending
        scoredResults.sort((a, b) => b.score - a.score);

        return scoredResults;
    }
}
