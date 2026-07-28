const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const VALID_RELATIONSHIPS = new Set([
  "appears-in",
  "member-of",
  "located-in",
  "possesses",
  "created-by",
  "uses",
  "participated-in",
  "enemy-of",
  "ally-of",
  "related-to",
  "contains",
  "involves",
  "occurred-at",
  "mentor-of",
  "partner-of",
  "recruiter-of",
  "part-of",
  "caused-by",
  "leads-to",
  "destroyed-by",
  "parent-of",
  "sibling-of",
  "variant-of",
  "originates-from",
  "exists-in",
  "branches-from",
  "pruned-by",
  "monitored-by",
  "travels-to",
  "causes-incursion",
  "alternate-version-of",
  "encounters"
]);

const FILES = [
    'movies', 'series', 'characters', 'organizations', 
    'locations', 'artifacts', 'events', 'technologies', 
    'universes', 'timeline', 'variants', 'branches', 'incursions'
];

async function validate() {
    let globalIds = new Set();
    let idToFile = new Map();
    let idToType = new Map();
    let duplicateIds = [];
    let invalidEntities = [];
    
    // 1. Load entities
    for (const file of FILES) {
        const filePath = path.join(DATA_DIR, `${file}.json`);
        if (!fs.existsSync(filePath)) {
            console.warn(`[WARNING] Missing file: ${file}.json`);
            continue;
        }
        
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (!Array.isArray(data)) {
                invalidEntities.push(`File ${file}.json does not contain a JSON array.`);
                continue;
            }

            data.forEach((entity, index) => {
                if (!entity.id) {
                    invalidEntities.push(`Entity at index ${index} in ${file}.json has no ID.`);
                    return;
                }
                
                // Validate provenance sources if present
                if (entity.sources && Array.isArray(entity.sources)) {
                    entity.sources.forEach(source => {
                        if (!source.title || !source.url || !source.publisher || !source.type) {
                            invalidEntities.push(`Entity ${entity.id} has malformed provenance schema.`);
                        }
                    });
                }

                if (globalIds.has(entity.id)) {
                    duplicateIds.push({ id: entity.id, files: [idToFile.get(entity.id), `${file}.json`] });
                } else {
                    globalIds.add(entity.id);
                    idToFile.set(entity.id, `${file}.json`);
                    idToType.set(entity.id, file);
                }
            });
        } catch (e) {
            invalidEntities.push(`Failed to parse ${file}.json: ${e.message}`);
        }
    }

    // 2. Load and validate relationships
    let brokenReferences = [];
    let invalidRelationships = [];
    let duplicateRels = [];
    let relSet = new Set();
    let relationships = [];
    let ontologyViolations = [];
    
    const relFile = path.join(DATA_DIR, 'relationships.json');
    if (fs.existsSync(relFile)) {
        relationships = JSON.parse(fs.readFileSync(relFile, 'utf-8'));
        relationships.forEach((rel, index) => {
            if (!rel.source || !rel.target || !rel.type) {
                invalidRelationships.push(`Relationship at index ${index} missing source/target/type.`);
                return;
            }

            if (!VALID_RELATIONSHIPS.has(rel.type)) {
                invalidRelationships.push(`Unknown relationship type: "${rel.type}" at index ${index}`);
            }

            if (rel.source === rel.target) {
                invalidRelationships.push(`Self-referencing relationship for ${rel.source} at index ${index}`);
            }

            if (!globalIds.has(rel.source)) brokenReferences.push(`Source ID not found: ${rel.source}`);
            if (!globalIds.has(rel.target)) brokenReferences.push(`Target ID not found: ${rel.target}`);

            // Ontology validation
            const sourceType = idToType.get(rel.source);
            const targetType = idToType.get(rel.target);
            
            if (rel.type === "variant-of") {
                if (sourceType !== "variants" && sourceType !== "characters") {
                    ontologyViolations.push(`Ontology Violation: variant-of source ${rel.source} must be a variant or character`);
                }
            }
            
            if (rel.type === "originates-from") {
                if (targetType !== "universes" && targetType !== "branches") {
                    ontologyViolations.push(`Ontology Violation: originates-from target ${rel.target} must be a universe or branch`);
                }
            }
            
            if (rel.type === "branches-from") {
                if (sourceType !== "branches" || (targetType !== "universes" && targetType !== "branches")) {
                    ontologyViolations.push(`Ontology Violation: branches-from invalid types (${sourceType} -> ${targetType})`);
                }
            }
            
            if (rel.type === "exists-in") {
                if (targetType !== "universes" && targetType !== "branches") {
                    ontologyViolations.push(`Ontology Violation: exists-in target ${rel.target} must be a universe or branch`);
                }
            }

            const sig = `${rel.source}|${rel.type}|${rel.target}`;
            if (relSet.has(sig)) {
                duplicateRels.push(`Duplicate relationship: ${sig}`);
            } else {
                relSet.add(sig);
            }
        });
    }

    // 3. Timeline check
    let timelineEntries = 0;
    const timelineFile = path.join(DATA_DIR, 'timeline.json');
    if (fs.existsSync(timelineFile)) {
        const timeline = JSON.parse(fs.readFileSync(timelineFile, 'utf-8'));
        timelineEntries = timeline.length;
        timeline.forEach(t => {
            if (t.entityId && !globalIds.has(t.entityId)) {
                brokenReferences.push(`Timeline entry ${t.id} references missing entity: ${t.entityId}`);
            }
        });
    }

    // Report
    console.log(`\nMCU ARCHIVE COVERAGE`);
    console.log(`────────────────────────────`);
    
    // Count entities by type
    const counts = {};
    FILES.forEach(f => counts[f] = 0);
    for (const [id, type] of idToType.entries()) {
        if (counts[type] !== undefined) counts[type]++;
    }
    
    console.log(`Movies                 ${counts['movies'] || 0}`);
    console.log(`Series                 ${counts['series'] || 0}`);
    console.log(`Characters             ${counts['characters'] || 0}`);
    console.log(`Organizations          ${counts['organizations'] || 0}`);
    console.log(`Locations              ${counts['locations'] || 0}`);
    console.log(`Artifacts              ${counts['artifacts'] || 0}`);
    console.log(`Technologies           ${counts['technologies'] || 0}`);
    console.log(`Events                 ${counts['events'] || 0}`);
    console.log(`Universes              ${counts['universes'] || 0}`);
    console.log(`Variants               ${counts['variants'] || 0}`);
    console.log(`Branches               ${counts['branches'] || 0}`);
    console.log(`Incursions             ${counts['incursions'] || 0}`);
    console.log(`Timeline Entries       ${timelineEntries}`);
    console.log(`Relationships          ${relationships.length}`);

    console.log(`\nINTEGRITY`);
    console.log(`────────────────────────────`);
    console.log(`Duplicate IDs             ${duplicateIds.length}`);
    console.log(`Broken References         ${brokenReferences.length}`);
    console.log(`Invalid Relationships     ${invalidRelationships.length}`);
    console.log(`Duplicate Relations       ${duplicateRels.length}`);
    console.log(`Malformed Entities        ${invalidEntities.length}`);
    console.log(`Ontology Violations       ${ontologyViolations.length}`);
    
    let hasErrors = false;

    if (duplicateIds.length > 0 || brokenReferences.length > 0 || invalidRelationships.length > 0 || duplicateRels.length > 0 || invalidEntities.length > 0 || ontologyViolations.length > 0) {
        if (duplicateIds.length > 0) console.error(`\n[ERROR] Duplicate IDs found:`, duplicateIds);
        if (brokenReferences.length > 0) console.error(`\n[ERROR] Broken References:`, brokenReferences);
        if (invalidRelationships.length > 0) console.error(`\n[ERROR] Invalid Relationships:`, invalidRelationships);
        if (duplicateRels.length > 0) console.error(`\n[ERROR] Duplicate Relationships:`, duplicateRels);
        if (invalidEntities.length > 0) console.error(`\n[ERROR] Malformed Entities:`, invalidEntities);
        if (ontologyViolations.length > 0) console.error(`\n[ERROR] Ontology Violations:`, ontologyViolations);
        
        console.error(`\n✗ Validation failed`);
        process.exit(1);
    }
    
    console.log(`\n✓ Dataset valid`);
    process.exit(0);
}

validate().catch(console.error);
