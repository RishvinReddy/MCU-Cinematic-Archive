module.exports = {
    universes: [
        { 
            "id": "universe-earth-616", 
            "name": "Earth-616", 
            "designation": "Sacred Timeline", 
            "description": "The baseline universe of the Marvel Cinematic Universe where the events of the Infinity Saga primarily occurred." 
        },
        {
            "id": "universe-earth-838",
            "name": "Earth-838",
            "designation": "Illuminati Universe",
            "description": "An alternate universe where the Illuminati successfully defeated Thanos, but at a great cost."
        }
    ],
    branches: [
        {
            "id": "timeline-2012-branch",
            "name": "2012 New York Branch",
            "divergencePoint": "The Avengers time travel heist goes wrong, allowing Loki to escape with the Tesseract.",
            "status": "Pruned"
        }
    ],
    incursions: [
        {
            "id": "incursion-838",
            "name": "Earth-838 Incursion",
            "status": "Averted",
            "description": "An event where the boundaries between two universes erode, threatening to destroy both."
        }
    ],
    locations: [
        { "id": "loc-end-of-time", "name": "Citadel at the End of Time", "planet": "Unknown", "realm": "End of Time" },
        { "id": "loc-void", "name": "The Void", "planet": "Unknown", "realm": "End of Time" }
    ],
    relationships: [
        // Fix the relationship directions
        { "source": "org-tva", "target": "char-he-who-remains", "type": "created-by" },
        
        { "source": "timeline-2012-branch", "target": "universe-earth-616", "type": "branches-from" },
        { "source": "timeline-2012-branch", "target": "org-tva", "type": "pruned-by" },
        
        { "source": "variant-loki-2012", "target": "timeline-2012-branch", "type": "originates-from" },
        
        { "source": "char-sylvie", "target": "char-he-who-remains", "type": "encounters" }
    ]
};
