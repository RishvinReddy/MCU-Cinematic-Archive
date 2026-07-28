module.exports = {
    movies: [
        { "id": "movie-iron-man-2008", "title": "Iron Man", "releaseYear": "2008", "phase": "1", "synopsis": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", "characters": ["char-tony-stark", "char-pepper-potts", "char-james-rhodes", "char-phil-coulson", "char-nick-fury"], "organizations": ["org-stark-industries", "org-shield", "org-ten-rings"], "locations": ["loc-earth"] },
        { "id": "movie-incredible-hulk-2008", "title": "The Incredible Hulk", "releaseYear": "2008", "phase": "1", "synopsis": "Bruce Banner, a scientist on the run from the U.S. Government, must find a cure for the monster he turns into whenever he loses his temper.", "characters": ["char-bruce-banner", "char-tony-stark"], "organizations": ["org-shield"], "locations": ["loc-earth"] },
        { "id": "movie-iron-man-2-2010", "title": "Iron Man 2", "releaseYear": "2010", "phase": "1", "synopsis": "With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man tied to his father's legacy.", "characters": ["char-tony-stark", "char-pepper-potts", "char-james-rhodes", "char-natasha-romanoff", "char-nick-fury", "char-phil-coulson"], "organizations": ["org-stark-industries", "org-shield"], "locations": ["loc-earth"] },
        { "id": "movie-thor-2011", "title": "Thor", "releaseYear": "2011", "phase": "1", "synopsis": "The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.", "characters": ["char-thor", "char-loki", "char-phil-coulson", "char-clint-barton", "char-nick-fury"], "organizations": ["org-shield"], "locations": ["loc-asgard", "loc-earth"] },
        { "id": "movie-cap-first-avenger-2011", "title": "Captain America: The First Avenger", "releaseYear": "2011", "phase": "1", "synopsis": "Steve Rogers, a rejected military soldier, transforms into Captain America after taking a dose of a Super-Soldier serum.", "characters": ["char-steve-rogers", "char-bucky-barnes", "char-nick-fury"], "organizations": ["org-shield", "org-hydra"], "locations": ["loc-earth"] },
        { "id": "movie-avengers-2012", "title": "The Avengers", "releaseYear": "2012", "phase": "1", "synopsis": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.", "characters": ["char-steve-rogers", "char-tony-stark", "char-thor", "char-bruce-banner", "char-natasha-romanoff", "char-clint-barton", "char-loki", "char-nick-fury", "char-phil-coulson"], "organizations": ["org-avengers", "org-shield"], "locations": ["loc-new-york", "loc-earth"], "events": ["event-battle-of-new-york"] }
    ],
    characters: [
        { "id": "char-tony-stark", "name": "Tony Stark", "aliases": ["Iron Man"] },
        { "id": "char-pepper-potts", "name": "Pepper Potts", "aliases": ["Rescue"] },
        { "id": "char-james-rhodes", "name": "James Rhodes", "aliases": ["War Machine", "Iron Patriot"] },
        { "id": "char-steve-rogers", "name": "Steve Rogers", "aliases": ["Captain America"] },
        { "id": "char-thor", "name": "Thor Odinson", "aliases": ["God of Thunder"] },
        { "id": "char-bruce-banner", "name": "Bruce Banner", "aliases": ["The Hulk"] },
        { "id": "char-natasha-romanoff", "name": "Natasha Romanoff", "aliases": ["Black Widow"] },
        { "id": "char-clint-barton", "name": "Clint Barton", "aliases": ["Hawkeye"] },
        { "id": "char-nick-fury", "name": "Nick Fury", "aliases": ["Director of S.H.I.E.L.D."] },
        { "id": "char-loki", "name": "Loki Laufeyson", "aliases": ["God of Mischief"] },
        { "id": "char-bucky-barnes", "name": "Bucky Barnes", "aliases": ["The Winter Soldier"] },
        { "id": "char-phil-coulson", "name": "Phil Coulson", "aliases": ["Agent Coulson"] }
    ],
    organizations: [
        { "id": "org-avengers", "name": "The Avengers", "founded": "2012" },
        { "id": "org-shield", "name": "S.H.I.E.L.D.", "founded": "1940s" },
        { "id": "org-hydra", "name": "HYDRA", "founded": "Ancient" },
        { "id": "org-stark-industries", "name": "Stark Industries", "founded": "1940" }
    ],
    locations: [
        { "id": "loc-earth", "name": "Earth", "planet": "Earth", "realm": "Midgard" },
        { "id": "loc-asgard", "name": "Asgard", "planet": "Asgard", "realm": "Asgard" },
        { "id": "loc-new-york", "name": "New York City", "planet": "Earth", "realm": "Midgard", "partOf": "loc-earth" }
    ],
    artifacts: [
        { "id": "artifact-tesseract", "name": "The Tesseract", "abilities": ["Space Manipulation", "Energy Source"] },
        { "id": "artifact-mjolnir", "name": "Mjolnir", "abilities": ["Weather Control", "Flight", "Worthiness Enchantment"] },
        { "id": "artifact-cap-shield", "name": "Captain America's Shield", "abilities": ["Vibranium Absorption"] },
        { "id": "artifact-space-stone", "name": "Space Stone", "abilities": ["Teleportation", "Space Manipulation"] }
    ],
    events: [
        { "id": "event-battle-of-new-york", "name": "Battle of New York", "date": "2012", "location": "loc-new-york" }
    ],
    technologies: [
        { "id": "tech-arc-reactor", "name": "Arc Reactor", "creator": "char-tony-stark", "purpose": "Clean Energy / Suit Power" },
        { "id": "tech-iron-man-armor", "name": "Iron Man Armor", "creator": "char-tony-stark", "purpose": "Combat / Defense" }
    ],
    timeline: [
        { "id": "tl-cap-first-avenger", "entityId": "movie-cap-first-avenger-2011", "chronologicalYear": 1943 },
        { "id": "tl-iron-man", "entityId": "movie-iron-man-2008", "chronologicalYear": 2010 },
        { "id": "tl-iron-man-2", "entityId": "movie-iron-man-2-2010", "chronologicalYear": 2011 },
        { "id": "tl-incredible-hulk", "entityId": "movie-incredible-hulk-2008", "chronologicalYear": 2011 },
        { "id": "tl-thor", "entityId": "movie-thor-2011", "chronologicalYear": 2011 },
        { "id": "tl-avengers", "entityId": "movie-avengers-2012", "chronologicalYear": 2012 },
        { "id": "tl-event-new-york", "entityId": "event-battle-of-new-york", "chronologicalYear": 2012 }
    ],
    relationships: [
        // Stark Hub
        { "source": "char-tony-stark", "target": "movie-iron-man-2008", "type": "appears-in" },
        { "source": "char-tony-stark", "target": "movie-iron-man-2-2010", "type": "appears-in" },
        { "source": "char-tony-stark", "target": "movie-avengers-2012", "type": "appears-in" },
        { "source": "char-tony-stark", "target": "char-pepper-potts", "type": "partner-of" },
        { "source": "char-tony-stark", "target": "char-james-rhodes", "type": "ally-of" },
        { "source": "char-tony-stark", "target": "org-avengers", "type": "member-of" },
        { "source": "char-tony-stark", "target": "org-stark-industries", "type": "member-of" },
        { "source": "char-tony-stark", "target": "tech-arc-reactor", "type": "created-by" },
        { "source": "char-tony-stark", "target": "tech-iron-man-armor", "type": "created-by" },
        { "source": "char-tony-stark", "target": "event-battle-of-new-york", "type": "participated-in" },

        // Steve Rogers Hub
        { "source": "char-steve-rogers", "target": "movie-cap-first-avenger-2011", "type": "appears-in" },
        { "source": "char-steve-rogers", "target": "movie-avengers-2012", "type": "appears-in" },
        { "source": "char-steve-rogers", "target": "char-bucky-barnes", "type": "ally-of" },
        { "source": "char-steve-rogers", "target": "org-avengers", "type": "member-of" },
        { "source": "char-steve-rogers", "target": "artifact-cap-shield", "type": "possesses" },
        { "source": "char-steve-rogers", "target": "event-battle-of-new-york", "type": "participated-in" },

        // Thor Hub
        { "source": "char-thor", "target": "movie-thor-2011", "type": "appears-in" },
        { "source": "char-thor", "target": "movie-avengers-2012", "type": "appears-in" },
        { "source": "char-thor", "target": "char-loki", "type": "sibling-of" },
        { "source": "char-thor", "target": "loc-asgard", "type": "located-in" },
        { "source": "char-thor", "target": "artifact-mjolnir", "type": "possesses" },
        { "source": "char-thor", "target": "org-avengers", "type": "member-of" },
        { "source": "char-thor", "target": "event-battle-of-new-york", "type": "participated-in" },

        // Avengers org links
        { "source": "char-bruce-banner", "target": "org-avengers", "type": "member-of" },
        { "source": "char-natasha-romanoff", "target": "org-avengers", "type": "member-of" },
        { "source": "char-clint-barton", "target": "org-avengers", "type": "member-of" },
        
        // Artifacts / Space Stone
        { "source": "artifact-tesseract", "target": "artifact-space-stone", "type": "contains" },
        { "source": "char-loki", "target": "artifact-tesseract", "type": "uses" },
        { "source": "event-battle-of-new-york", "target": "artifact-tesseract", "type": "involves", "context": { "project": "movie-avengers-2012" } }
    ]
};
