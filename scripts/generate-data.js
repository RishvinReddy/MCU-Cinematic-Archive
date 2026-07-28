const fs = require('fs');
const path = require('path');

const SEED_DIR = path.join(__dirname, 'seed');
const DATA_DIR = path.join(__dirname, '../data');

// Types of collections we are building
const COLLECTIONS = [
    'movies', 'series', 'characters', 'organizations', 
    'locations', 'artifacts', 'events', 'technologies', 
    'universes', 'timeline', 'relationships',
    'variants', 'branches', 'incursions'
];

function buildDataset() {
    const data = {};
    COLLECTIONS.forEach(col => data[col] = []);

    // Load all seed files
    const loadFromDir = (dirPath) => {
        if (!fs.existsSync(dirPath)) return;
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const seedModule = require(path.join(dirPath, file));
            COLLECTIONS.forEach(col => {
                if (seedModule[col] && Array.isArray(seedModule[col])) {
                    data[col].push(...seedModule[col]);
                }
            });
        }
    };

    loadFromDir(path.join(SEED_DIR, 'projects'));
    loadFromDir(path.join(SEED_DIR, 'domains'));

    // Deduplicate entities by ID (Keep the latest or merge strategically? For now, keep first encountered, log duplicates)
    // Actually, throwing on duplicate in generation is better than runtime. We'll do a strict unique check.
    const uniqueData = {};
    
    COLLECTIONS.forEach(col => {
        if (col === 'relationships' || col === 'timeline') {
            uniqueData[col] = data[col]; // allow dupes here to be caught by validator if necessary, or just dedup rels by sig
            return;
        }

        const map = new Map();
        data[col].forEach(entity => {
            if (map.has(entity.id)) {
                console.warn(`[WARNING] Duplicate entity ID during generation: ${entity.id} in collection ${col}`);
                // Simple merge for arrays like aliases
                const existing = map.get(entity.id);
                if (entity.aliases && existing.aliases) {
                    existing.aliases = [...new Set([...existing.aliases, ...entity.aliases])];
                }
            } else {
                map.set(entity.id, entity);
            }
        });
        uniqueData[col] = Array.from(map.values());
    });

    // Deduplicate relationships by signature + context
    const relMap = new Map();
    uniqueData.relationships.forEach(rel => {
        const sig = `${rel.source}|${rel.type}|${rel.target}`;
        // If there's context, maybe it's distinct? For MCU simplicity, source/type/target should usually be unique.
        if (!relMap.has(sig)) {
            relMap.set(sig, rel);
        }
    });
    uniqueData.relationships = Array.from(relMap.values());

    // Write to JSON
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    
    COLLECTIONS.forEach(col => {
        fs.writeFileSync(
            path.join(DATA_DIR, `${col}.json`), 
            JSON.stringify(uniqueData[col], null, 2)
        );
    });

    console.log("Archive dataset generated successfully from seed files.");
}

buildDataset();
