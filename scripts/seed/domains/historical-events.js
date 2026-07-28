module.exports = {
    events: [
        {
            id: "event-birth-of-universe",
            title: "Birth of the Universe",
            description: "Six primordial singularities are compressed into the Infinity Stones.",
            continuity: "MCU",
            provenance: "CONFIRMED"
        },
        {
            id: "event-creation-of-eternals",
            title: "Creation of the Eternals",
            description: "Arishem creates the Eternals to protect growing intelligent populations.",
            continuity: "MCU",
            provenance: "CONFIRMED"
        },
        {
            id: "event-vibranium-meteorite",
            title: "Vibranium Meteorite Crashes",
            description: "A vibranium-rich meteorite crashes in Africa, leading to the Heart-Shaped Herb and Wakanda.",
            continuity: "MCU",
            provenance: "CONFIRMED"
        }
    ],
    timeline: [
        {
            id: "tl-birth-of-universe",
            eventId: "event-birth-of-universe",
            year: "Before Time",
            order: 1,
            description: "Creation of the Infinity Stones."
        },
        {
            id: "tl-creation-of-eternals",
            eventId: "event-creation-of-eternals",
            year: "Millions of years ago",
            order: 2,
            description: "Arishem creates Eternals."
        },
        {
            id: "tl-vibranium-meteorite",
            eventId: "event-vibranium-meteorite",
            year: "Millions of years ago",
            order: 3,
            description: "Vibranium arrives on Earth."
        }
    ]
};
