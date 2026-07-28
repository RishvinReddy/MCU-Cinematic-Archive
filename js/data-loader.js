/**
 * Utility for fetching and caching JSON data
 * Uses session storage for simple caching mechanism
 */

const CACHE_PREFIX = 'mcu_data_';

export async function fetchJSON(filename) {
    const cacheKey = CACHE_PREFIX + filename;
    
    // Check cache
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        // Use relative path for GitHub Pages compatibility
        const response = await fetch(`./data/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Cache for subsequent requests
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error("Data loading error:", error);
        return null;
    }
}

/**
 * Loads the core datasets required for global operations
 */
export async function loadCoreData() {
    const [movies, characters, relationships, events, variants, timeline] = await Promise.all([
        fetchJSON('movies.json'),
        fetchJSON('characters.json'),
        fetchJSON('relationships.json'),
        fetchJSON('events.json'),
        fetchJSON('variants.json'),
        fetchJSON('timeline.json')
    ]);
    
    return { movies, characters, relationships, events, variants, timeline };
}
