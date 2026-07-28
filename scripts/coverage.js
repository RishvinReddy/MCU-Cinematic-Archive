const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const FILES = [
    'movies', 'series', 'characters', 'organizations', 
    'locations', 'artifacts', 'events', 'technologies', 
    'universes', 'timeline', 'variants', 'branches', 'incursions'
];

async function runCoverage() {
    console.log("MCU ARCHIVE COVERAGE AUDIT");
    console.log("────────────────────────────");

    let entitiesById = new Map();
    let entitiesByType = new Map();
    
    // Load Entities
    for (const file of FILES) {
        const filePath = path.join(DATA_DIR, `${file}.json`);
        if (!fs.existsSync(filePath)) continue;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        entitiesByType.set(file, data);
        data.forEach(entity => {
            entitiesById.set(entity.id, { ...entity, _type: file });
        });
    }

    // Load Relationships
    const relFile = path.join(DATA_DIR, 'relationships.json');
    let relationships = [];
    let relCountByEntity = new Map();
    
    if (fs.existsSync(relFile)) {
        relationships = JSON.parse(fs.readFileSync(relFile, 'utf-8'));
        relationships.forEach(rel => {
            relCountByEntity.set(rel.source, (relCountByEntity.get(rel.source) || 0) + 1);
            relCountByEntity.set(rel.target, (relCountByEntity.get(rel.target) || 0) + 1);
        });
    }

    let errors = 0;
    let warnings = 0;
    let infos = 0;

    function logSeverity(severity, message) {
        if (severity === 'ERROR') {
            console.log(`\x1b[31m[ERROR]\x1b[0m   ${message}`);
            errors++;
        } else if (severity === 'WARNING') {
            console.log(`\x1b[33m[WARNING]\x1b[0m ${message}`);
            warnings++;
        } else if (severity === 'INFO') {
            console.log(`\x1b[36m[INFO]\x1b[0m    ${message}`);
            infos++;
        }
    }

    // 1. Orphan Checks
    entitiesById.forEach((entity, id) => {
        if (!relCountByEntity.has(id)) {
            logSeverity('WARNING', `Entity ${id} (${entity._type}) has 0 relationships.`);
        }
    });

    // 2. Movies without Characters or Events
    (entitiesByType.get('movies') || []).forEach(movie => {
        let hasChar = (movie.characters && movie.characters.length > 0);
        let hasEvent = (movie.events && movie.events.length > 0);
        
        relationships.forEach(rel => {
            if (rel.source === movie.id || rel.target === movie.id) {
                const otherId = rel.source === movie.id ? rel.target : rel.source;
                const other = entitiesById.get(otherId);
                if (other && other._type === 'characters') hasChar = true;
                if (other && other._type === 'events') hasEvent = true;
            }
        });
        if (!hasChar) logSeverity('ERROR', `Movie ${movie.id} has no connected characters.`);
        if (!hasEvent) logSeverity('INFO', `Movie ${movie.id} has no connected events.`);
    });

    // 3. Characters without Project Appearance
    (entitiesByType.get('characters') || []).forEach(char => {
        let hasProject = false;
        
        // Check embedded arrays in movies and series
        (entitiesByType.get('movies') || []).forEach(m => { if (m.characters && m.characters.includes(char.id)) hasProject = true; });
        (entitiesByType.get('series') || []).forEach(s => { if (s.characters && s.characters.includes(char.id)) hasProject = true; });

        let hasOrg = false;
        relationships.forEach(rel => {
            if (rel.source === char.id || rel.target === char.id) {
                const otherId = rel.source === char.id ? rel.target : rel.source;
                const other = entitiesById.get(otherId);
                if (other && (other._type === 'movies' || other._type === 'series')) hasProject = true;
                if (other && other._type === 'organizations') hasOrg = true;
            }
        });
        if (!hasProject) logSeverity('WARNING', `Character ${char.id} has no explicit project connection.`);
        if (!hasOrg) logSeverity('INFO', `Character ${char.id} is not connected to any organization.`);
    });

    // 4. Artifact without Project
    (entitiesByType.get('artifacts') || []).forEach(art => {
        const rels = relCountByEntity.get(art.id) || 0;
        if (rels === 1) logSeverity('WARNING', `Artifact ${art.id} has only 1 relationship.`);
    });

    // 5. Variants without Base Character
    (entitiesByType.get('variants') || []).forEach(variant => {
        if (!variant.baseCharacter) {
            logSeverity('ERROR', `Variant ${variant.id} has no base character.`);
        } else if (!entitiesById.has(variant.baseCharacter)) {
            logSeverity('ERROR', `Variant ${variant.id} points to non-existent base character ${variant.baseCharacter}.`);
        }
    });

    // 6. Branches without Parent Timelines
    (entitiesByType.get('branches') || []).forEach(branch => {
        let hasParent = false;
        relationships.forEach(rel => {
            if (rel.source === branch.id && rel.type === 'branches-from') hasParent = true;
        });
        if (!hasParent) logSeverity('ERROR', `Branch ${branch.id} has no 'branches-from' relationship.`);
    });

    console.log("\nCOVERAGE SUMMARY");
    console.log("────────────────────────────");
    console.log(`Errors:   ${errors}`);
    console.log(`Warnings: ${warnings}`);
    console.log(`Infos:    ${infos}`);
    
    if (errors > 0) {
        console.log("\n\x1b[31mCoverage audit found critical errors. Please resolve.\x1b[0m");
        process.exit(1); // Fail on coverage errors
    } else {
        console.log("\n\x1b[32m✓ Coverage acceptable\x1b[0m");
    }
}

runCoverage().catch(console.error);
