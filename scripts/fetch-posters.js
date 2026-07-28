const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'posters');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function fetchWikipediaPoster(title) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title + " film")}&utf8=&format=json`;
    
    try {
        const searchRes = await fetchJson(searchUrl);
        if (searchRes.query.search.length === 0) return null;
        
        const pageTitle = searchRes.query.search[0].title;
        const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=500`;
        
        const pageRes = await fetchJson(pageUrl);
        const pages = pageRes.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        }
        return null;
    } catch (e) {
        console.error("Error fetching", title, e);
        return null;
    }
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'MCUCinematicArchive/1.0 (test@example.com)'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'MCUCinematicArchive/1.0 (test@example.com)'
            }
        };
        https.get(url, options, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', err => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    const movies = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'movies.json'), 'utf-8'));
    
    for (const movie of movies) {
        console.log(`Processing: ${movie.title}`);
        const filename = `${movie.id}.jpg`;
        const dest = path.join(ASSETS_DIR, filename);
        
        if (!fs.existsSync(dest)) {
            const imageUrl = await fetchWikipediaPoster(movie.title);
            if (imageUrl) {
                console.log(`  Downloading ${imageUrl}`);
                await downloadImage(imageUrl, dest);
                movie.image = `assets/posters/${filename}`;
            } else {
                console.log(`  No poster found for ${movie.title}`);
            }
        }
        
        // Wait a bit to respect Wikipedia API limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    fs.writeFileSync(path.join(DATA_DIR, 'movies.json'), JSON.stringify(movies, null, 2));
    console.log("Done!");
}

run();
