module.exports = {
    movies: [
        { "id": "movie-iron-man-3-2013", "title": "Iron Man 3", "releaseYear": "2013", "phase": "2", "synopsis": "When Tony Stark's world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.", "characters": ["char-tony-stark", "char-pepper-potts", "char-james-rhodes"], "organizations": ["org-stark-industries"], "locations": ["loc-earth"] },
        { "id": "movie-thor-dark-world-2013", "title": "Thor: The Dark World", "releaseYear": "2013", "phase": "2", "synopsis": "When the Dark Elves attempt to plunge the universe into darkness, Thor must embark on a perilous and personal journey that will reunite him with doctor Jane Foster.", "characters": ["char-thor", "char-loki"], "organizations": [], "locations": ["loc-asgard", "loc-earth"], "artifacts": ["artifact-aether"] },
        { "id": "movie-cap-winter-soldier-2014", "title": "Captain America: The Winter Soldier", "releaseYear": "2014", "phase": "2", "synopsis": "As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow, to battle a new threat from history: an assassin known as the Winter Soldier.", "characters": ["char-steve-rogers", "char-natasha-romanoff", "char-sam-wilson", "char-bucky-barnes", "char-nick-fury"], "organizations": ["org-shield", "org-hydra"], "locations": ["loc-earth"], "events": ["event-fall-of-shield"] },
        { "id": "movie-gotg-2014", "title": "Guardians of the Galaxy", "releaseYear": "2014", "phase": "2", "synopsis": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.", "characters": ["char-peter-quill", "char-gamora", "char-drax", "char-rocket", "char-groot"], "organizations": ["org-guardians", "org-nova-corps"], "locations": ["loc-xandar", "loc-knowhere"], "events": ["event-battle-of-xandar"] },
        { "id": "movie-avengers-age-of-ultron-2015", "title": "Avengers: Age of Ultron", "releaseYear": "2015", "phase": "2", "synopsis": "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.", "characters": ["char-tony-stark", "char-steve-rogers", "char-thor", "char-bruce-banner", "char-natasha-romanoff", "char-clint-barton", "char-ultron", "char-vision", "char-wanda-maximoff", "char-nick-fury"], "organizations": ["org-avengers"], "locations": ["loc-sokovia", "loc-earth"], "events": ["event-battle-of-sokovia"] },
        { "id": "movie-ant-man-2015", "title": "Ant-Man", "releaseYear": "2015", "phase": "2", "synopsis": "Armed with a super-suit with the astonishing ability to shrink in scale but increase in strength, cat burglar Scott Lang must embrace his inner hero and help his mentor, Dr. Hank Pym, pull off a heist that will save the world.", "characters": ["char-scott-lang", "char-hank-pym", "char-hope-van-dyne", "char-sam-wilson"], "organizations": [], "locations": ["loc-earth"], "artifacts": ["artifact-pym-particles"] }
    ],
    characters: [
        { "id": "char-sam-wilson", "name": "Sam Wilson", "aliases": ["Falcon"] },
        { "id": "char-peter-quill", "name": "Peter Quill", "aliases": ["Star-Lord"] },
        { "id": "char-gamora", "name": "Gamora", "aliases": [] },
        { "id": "char-drax", "name": "Drax", "aliases": ["The Destroyer"] },
        { "id": "char-rocket", "name": "Rocket Raccoon", "aliases": ["Rocket"] },
        { "id": "char-groot", "name": "Groot", "aliases": [] },
        { "id": "char-ultron", "name": "Ultron", "aliases": [] },
        { "id": "char-vision", "name": "Vision", "aliases": [] },
        { "id": "char-wanda-maximoff", "name": "Wanda Maximoff", "aliases": ["Scarlet Witch"] },
        { "id": "char-scott-lang", "name": "Scott Lang", "aliases": ["Ant-Man"] },
        { "id": "char-hank-pym", "name": "Hank Pym", "aliases": ["Original Ant-Man"] }
    ],
    organizations: [
        { "id": "org-guardians", "name": "Guardians of the Galaxy", "founded": "2014" },
        { "id": "org-nova-corps", "name": "Nova Corps", "founded": "Unknown" }
    ],
    locations: [
        { "id": "loc-xandar", "name": "Xandar", "planet": "Xandar", "realm": "Andromeda" },
        { "id": "loc-knowhere", "name": "Knowhere", "planet": "Knowhere", "realm": "Unknown" },
        { "id": "loc-sokovia", "name": "Sokovia", "planet": "Earth", "realm": "Midgard", "partOf": "loc-earth" },
        { "id": "loc-quantum-realm", "name": "Quantum Realm", "planet": "Microverse", "realm": "Quantum" }
    ],
    artifacts: [
        { "id": "artifact-power-stone", "name": "Power Stone", "abilities": ["Energy Manipulation"] },
        { "id": "artifact-orb", "name": "The Orb", "abilities": ["Containment"] },
        { "id": "artifact-mind-stone", "name": "Mind Stone", "abilities": ["Consciousness Manipulation"] },
        { "id": "artifact-scepter", "name": "Loki's Scepter", "abilities": ["Energy Projection", "Mind Control"] },
        { "id": "artifact-reality-stone", "name": "Reality Stone", "abilities": ["Reality Warping"] },
        { "id": "artifact-aether", "name": "The Aether", "abilities": ["Reality Warping", "Dark Matter Infection"] },
        { "id": "artifact-pym-particles", "name": "Pym Particles", "abilities": ["Size Alteration"] }
    ],
    events: [
        { "id": "event-fall-of-shield", "name": "Fall of S.H.I.E.L.D.", "date": "2014", "location": "loc-earth" },
        { "id": "event-battle-of-xandar", "name": "Battle of Xandar", "date": "2014", "location": "loc-xandar" },
        { "id": "event-battle-of-sokovia", "name": "Battle of Sokovia", "date": "2015", "location": "loc-sokovia" }
    ],
    timeline: [
        { "id": "tl-iron-man-3", "entityId": "movie-iron-man-3-2013", "chronologicalYear": 2012 },
        { "id": "tl-thor-dark-world", "entityId": "movie-thor-dark-world-2013", "chronologicalYear": 2013 },
        { "id": "tl-cap-winter-soldier", "entityId": "movie-cap-winter-soldier-2014", "chronologicalYear": 2014 },
        { "id": "tl-gotg", "entityId": "movie-gotg-2014", "chronologicalYear": 2014 },
        { "id": "tl-event-fall-shield", "entityId": "event-fall-of-shield", "chronologicalYear": 2014 },
        { "id": "tl-event-xandar", "entityId": "event-battle-of-xandar", "chronologicalYear": 2014 },
        { "id": "tl-avengers-age-of-ultron", "entityId": "movie-avengers-age-of-ultron-2015", "chronologicalYear": 2015 },
        { "id": "tl-event-sokovia", "entityId": "event-battle-of-sokovia", "chronologicalYear": 2015 },
        { "id": "tl-ant-man", "entityId": "movie-ant-man-2015", "chronologicalYear": 2015 }
    ],
    relationships: [
        // SHIELD Fall
        { "source": "event-fall-of-shield", "target": "org-shield", "type": "destroyed-by" }, // well, shield destroyed by this event
        { "source": "char-steve-rogers", "target": "event-fall-of-shield", "type": "participated-in" },
        { "source": "char-natasha-romanoff", "target": "event-fall-of-shield", "type": "participated-in" },
        { "source": "char-sam-wilson", "target": "event-fall-of-shield", "type": "participated-in" },
        { "source": "char-bucky-barnes", "target": "event-fall-of-shield", "type": "participated-in" },
        
        // Guardians Hub
        { "source": "char-peter-quill", "target": "org-guardians", "type": "member-of" },
        { "source": "char-gamora", "target": "org-guardians", "type": "member-of" },
        { "source": "char-drax", "target": "org-guardians", "type": "member-of" },
        { "source": "char-rocket", "target": "org-guardians", "type": "member-of" },
        { "source": "char-groot", "target": "org-guardians", "type": "member-of" },
        { "source": "event-battle-of-xandar", "target": "loc-xandar", "type": "occurred-at" },
        { "source": "event-battle-of-xandar", "target": "org-guardians", "type": "participated-in" },
        { "source": "org-guardians", "target": "artifact-power-stone", "type": "uses" },
        { "source": "artifact-orb", "target": "artifact-power-stone", "type": "contains" },
        { "source": "event-battle-of-xandar", "target": "artifact-power-stone", "type": "involves" },

        // Sokovia Hub
        { "source": "char-ultron", "target": "event-battle-of-sokovia", "type": "caused-by" }, // Actually ultron caused it. So event caused by ultron.
        { "source": "char-ultron", "target": "char-tony-stark", "type": "created-by" },
        { "source": "event-battle-of-sokovia", "target": "loc-sokovia", "type": "occurred-at" },
        { "source": "event-battle-of-sokovia", "target": "char-ultron", "type": "participated-in" },
        { "source": "event-battle-of-sokovia", "target": "org-avengers", "type": "participated-in" },
        { "source": "char-vision", "target": "artifact-mind-stone", "type": "possesses" },
        { "source": "artifact-scepter", "target": "artifact-mind-stone", "type": "contains" },
        
        // Dark World
        { "source": "artifact-aether", "target": "artifact-reality-stone", "type": "contains" },

        // Ant Man
        { "source": "char-hank-pym", "target": "artifact-pym-particles", "type": "created-by" },
        { "source": "char-scott-lang", "target": "artifact-pym-particles", "type": "uses" }
    ]
};
