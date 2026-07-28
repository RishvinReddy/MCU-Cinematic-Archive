import { fetchJSON } from './data-loader.js';

class KnowledgeGraph {
    constructor() {
        this.entitiesById = new Map();
        this.entitiesByType = new Map();
        this.relationships = [];
        this.relationshipsBySource = new Map();
        this.relationshipsByTarget = new Map();
        this.neighborsByEntity = new Map();
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            const [
                movies, series, characters, variants, events, 
                locations, organizations, artifacts, 
                technologies, universes, branches, incursions, relationships
            ] = await Promise.all([
                fetchJSON('movies.json'),
                fetchJSON('series.json'),
                fetchJSON('characters.json'),
                fetchJSON('variants.json'),
                fetchJSON('events.json'),
                fetchJSON('locations.json'),
                fetchJSON('organizations.json'),
                fetchJSON('artifacts.json'),
                fetchJSON('technologies.json'),
                fetchJSON('universes.json'),
                fetchJSON('branches.json'),
                fetchJSON('incursions.json'),
                fetchJSON('relationships.json')
            ]);

            this._indexEntities('movie', movies || []);
            this._indexEntities('series', series || []);
            this._indexEntities('character', characters || []);
            this._indexEntities('variant', variants || []);
            this._indexEntities('event', events || []);
            this._indexEntities('location', locations || []);
            this._indexEntities('organization', organizations || []);
            this._indexEntities('artifact', artifacts || []);
            this._indexEntities('technology', technologies || []);
            this._indexEntities('universe', universes || []);
            this._indexEntities('branch', branches || []);
            this._indexEntities('incursion', incursions || []);

            // Now validate and index relationships
            if (relationships) {
                this.relationships = relationships.filter(rel => this._validateRelationship(rel));
                this._indexRelationships(this.relationships);
            }

            this.isInitialized = true;
        } catch (error) {
            console.warn("Failed to initialize Knowledge Graph fully", error);
        }
    }

    _indexEntities(type, entities) {
        if (!this.entitiesByType.has(type)) {
            this.entitiesByType.set(type, []);
        }
        
        entities.forEach(entity => {
            if (!entity.id) return;
            const normalizedEntity = { ...entity, _type: type };
            
            // Build name fallback
            if (!normalizedEntity.name) {
                normalizedEntity.name = normalizedEntity.title || normalizedEntity.id;
            }

            this.entitiesById.set(entity.id, normalizedEntity);
            this.entitiesByType.get(type).push(normalizedEntity);
        });
    }

    _validateRelationship(rel) {
        if (!rel.source || !rel.target || !rel.type) return false;
        if (rel.source === rel.target) return false; // No self-reference
        if (!this.entitiesById.has(rel.source)) return false;
        if (!this.entitiesById.has(rel.target)) return false;
        return true;
    }

    _indexRelationships(relationships) {
        relationships.forEach(rel => {
            // Source index
            if (!this.relationshipsBySource.has(rel.source)) {
                this.relationshipsBySource.set(rel.source, []);
            }
            this.relationshipsBySource.get(rel.source).push(rel);

            // Target index
            if (!this.relationshipsByTarget.has(rel.target)) {
                this.relationshipsByTarget.set(rel.target, []);
            }
            this.relationshipsByTarget.get(rel.target).push(rel);

            // Neighbors index (undirected view of graph for fast neighborhood traversal)
            this._addNeighbor(rel.source, rel.target, rel);
            this._addNeighbor(rel.target, rel.source, rel);
        });
    }

    _addNeighbor(entityA, entityB, rel) {
        if (!this.neighborsByEntity.has(entityA)) {
            this.neighborsByEntity.set(entityA, new Map());
        }
        const neighbors = this.neighborsByEntity.get(entityA);
        if (!neighbors.has(entityB)) {
            neighbors.set(entityB, []);
        }
        neighbors.get(entityB).push(rel);
    }

    // --- API Methods ---

    getEntity(id) {
        return this.entitiesById.get(id) || null;
    }

    getEntitiesByType(type) {
        return this.entitiesByType.get(type) || [];
    }
    
    getAllEntities() {
        return Array.from(this.entitiesById.values());
    }

    getOutgoingRelationships(id) {
        return this.relationshipsBySource.get(id) || [];
    }

    getIncomingRelationships(id) {
        return this.relationshipsByTarget.get(id) || [];
    }

    getRelationships(id) {
        return [...this.getOutgoingRelationships(id), ...this.getIncomingRelationships(id)];
    }

    getRelationshipCount(id) {
        return this.getRelationships(id).length;
    }

    getNeighbors(id) {
        const neighborMap = this.neighborsByEntity.get(id);
        if (!neighborMap) return [];
        return Array.from(neighborMap.keys()).map(neighborId => this.getEntity(neighborId));
    }

    getConnectionsBetween(sourceId, targetId) {
        const neighborMap = this.neighborsByEntity.get(sourceId);
        if (!neighborMap) return [];
        return neighborMap.get(targetId) || [];
    }
    
    hasRelationship(sourceId, targetId) {
        return this.getConnectionsBetween(sourceId, targetId).length > 0;
    }

    getEntityUrl(entity) {
        if (!entity || !entity._type || !entity.id) return '#';
        const typeMapping = {
            'movie': 'movies.html',
            'series': 'series.html',
            'character': 'characters.html',
            'variant': 'characters.html',
            'event': 'events.html',
            'organization': 'organizations.html',
            'location': 'locations.html',
            'artifact': 'artifacts.html',
            'universe': 'multiverse.html',
            'branch': 'multiverse.html',
            'incursion': 'multiverse.html'
        };
        const page = typeMapping[entity._type] || 'archive.html';
        return `${page}?id=${entity.id}`;
    }
}

// Singleton export
export const knowledgeGraph = new KnowledgeGraph();
