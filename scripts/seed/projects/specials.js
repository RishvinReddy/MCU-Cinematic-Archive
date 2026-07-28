module.exports = {
    movies: [
        {
            "id": "special-werewolf-by-night",
            "title": "Werewolf by Night",
            "releaseYear": "2022",
            "phase": "4",
            "saga": "Multiverse Saga",
            "director": "Michael Giacchino",
            "synopsis": "On a dark and somber night, a secret cabal of monster hunters emerge from the shadows and gather at the foreboding Bloodstone Temple following the death of their leader.",
            "characters": ["char-jack-russell", "char-elsa-bloodstone", "char-man-thing"],
            "locations": ["loc-bloodstone-temple"],
            "artifacts": ["art-bloodstone"],
            "sources": [{"title": "Marvel.com — Werewolf by Night", "url": "https://marvel.com", "publisher": "Marvel", "type": "official"}]
        },
        {
            "id": "special-gotg-holiday",
            "title": "The Guardians of the Galaxy Holiday Special",
            "releaseYear": "2022",
            "phase": "4",
            "saga": "Multiverse Saga",
            "director": "James Gunn",
            "synopsis": "The Guardians, who are on a mission to make Christmas unforgettable for Quill, head to Earth in search of the perfect present.",
            "characters": ["char-peter-quill", "char-drax", "char-mantis", "char-rocket", "char-groot", "char-kevin-bacon"],
            "organizations": ["org-guardians"],
            "locations": ["loc-knowhere", "loc-earth"],
            "sources": [{"title": "Marvel.com — GOTG Holiday Special", "url": "https://marvel.com", "publisher": "Marvel", "type": "official"}]
        }
    ],
    characters: [
        { "id": "char-jack-russell", "name": "Jack Russell", "aliases": ["Werewolf by Night"] },
        { "id": "char-elsa-bloodstone", "name": "Elsa Bloodstone", "aliases": [] },
        { "id": "char-man-thing", "name": "Ted Sallis", "aliases": ["Man-Thing"] },
        { "id": "char-kevin-bacon", "name": "Kevin Bacon", "aliases": [] },
        { "id": "char-mantis", "name": "Mantis", "aliases": [] }
    ],
    locations: [
        { "id": "loc-bloodstone-temple", "name": "Bloodstone Temple", "planet": "Earth", "realm": "Midgard" }
    ],
    artifacts: [
        { "id": "art-bloodstone", "name": "The Bloodstone", "abilities": ["Monster Control", "Longevity"] }
    ]
};
