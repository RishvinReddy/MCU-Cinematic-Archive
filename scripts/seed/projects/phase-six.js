module.exports = {
    movies: [
        {
            "id": "movie-deadpool-and-wolverine-2024",
            "title": "Deadpool & Wolverine",
            "releaseYear": "2024",
            "phase": "5",
            "saga": "Multiverse Saga",
            "director": "Shawn Levy",
            "synopsis": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
            "characters": ["char-deadpool", "char-wolverine", "char-cassandra-nova", "char-paradox", "char-b-15"],
            "organizations": ["org-tva"],
            "locations": ["loc-void"],
            "sources": [{"title": "Marvel.com — Deadpool & Wolverine", "url": "https://marvel.com", "publisher": "Marvel", "type": "official"}]
        },
        {
            "id": "movie-fantastic-four-first-steps-2025",
            "title": "The Fantastic Four: First Steps",
            "releaseYear": "2025",
            "phase": "6",
            "saga": "Multiverse Saga",
            "director": "Matt Shakman",
            "synopsis": "Set in a vibrant, retro-futuristic 1960s alternative universe, Marvel Studios' The Fantastic Four introduces Marvel's First Family.",
            "characters": ["char-reed-richards", "char-sue-storm", "char-johnny-storm", "char-ben-grimm", "char-galactus", "char-silver-surfer"],
            "organizations": ["org-fantastic-four"],
            "locations": ["loc-earth"], // will likely be a retro-future earth variant
            "sources": [{"title": "Marvel.com — Fantastic Four", "url": "https://marvel.com", "publisher": "Marvel", "type": "official"}]
        }
    ],
    characters: [
        { "id": "char-deadpool", "name": "Wade Wilson", "aliases": ["Deadpool"] },
        { "id": "char-wolverine", "name": "Logan", "aliases": ["Wolverine"] },
        { "id": "char-cassandra-nova", "name": "Cassandra Nova", "aliases": [] },
        { "id": "char-paradox", "name": "Paradox", "aliases": ["Mr. Paradox"] },
        { "id": "char-b-15", "name": "Hunter B-15", "aliases": [] },
        { "id": "char-sue-storm", "name": "Sue Storm", "aliases": ["Invisible Woman"] },
        { "id": "char-johnny-storm", "name": "Johnny Storm", "aliases": ["Human Torch"] },
        { "id": "char-ben-grimm", "name": "Ben Grimm", "aliases": ["The Thing"] },
        { "id": "char-galactus", "name": "Galactus", "aliases": ["Devourer of Worlds"] },
        { "id": "char-silver-surfer", "name": "Shalla-Bal", "aliases": ["Silver Surfer"] }
    ],
    organizations: [
        { "id": "org-fantastic-four", "name": "Fantastic Four", "founded": "Unknown" }
    ]
};
