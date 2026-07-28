# MCU Cinematic Archive

![MCU Cinematic Archive](./assets/preview.png)
*(Note: A preview image will be placed here representing the cinematic interface.)*

An interactive cinematic archive and knowledge graph for exploring the Marvel Cinematic Universe. Built to feel like a premium, in-universe intelligence database, it visualizes the vast and interconnected tapestry of Marvel characters, movies, series, events, and timelines.

**Live Deployment:** [https://rishvinreddy.github.io/MCU-Cinematic-Archive/](https://rishvinreddy.github.io/MCU-Cinematic-Archive/)

---

## 🌟 Features

- **Interactive Knowledge Graph:** A D3.js-powered force-directed graph allowing you to explore the relationships between characters, movies, events, and organizations. Features cinematic node halos, edge illumination, and semantic filtering.
- **Dynamic Timeline:** View the entire Infinity Saga and Multiverse Saga in Chronological or Release Order.
- **Cinematic Dossiers:** High-quality character and movie pages styled with a bespoke design system featuring dynamic gradients, editorial typography, and immersive interactions.
- **Command Center Search:** A lightning-fast, keyboard-accessible universal search overlay (`Cmd+K`) to jump to any entity in the archive.
- **Accessibility & Performance:** Fully supports `prefers-reduced-motion` for a calmer experience, keyboard navigation, and semantic HTML without sacrificing the premium aesthetic.

## 🏗 Architecture & Tech Stack

This project is a completely static, serverless architecture designed for seamless deployment on GitHub Pages.

### Tech Stack
- **Core:** Semantic HTML5, Vanilla JavaScript (ESModules)
- **Styling:** Vanilla CSS with scoped custom properties (CSS Variables) and a scalable design system (`global.css`, `components.css`). No CSS frameworks used.
- **Animations & Graph:** D3.js (Force simulations) and GSAP (ScrollTrigger, view transitions).
- **Data Source:** Static JSON files generated deterministically via local Node.js scripts.

### Data Engineering Pipeline
The project uses a structured pipeline to ensure data integrity and avoid manual JSON errors:
1. **Seed Data:** Human-readable domain definitions in `/scripts/seed`.
2. **Generation:** `node scripts/generate-data.js` compiles the seeds into optimized JSON schemas.
3. **Validation:** `node scripts/validate.js` ensures referential integrity across the graph.

## 🚀 Local Setup

To run the archive locally, you do not need Node.js unless you are modifying the dataset.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RishvinReddy/MCU-Cinematic-Archive.git
   cd MCU-Cinematic-Archive
   ```

2. **Serve locally:**
   Since the app uses ESModules (`type="module"`), it must be served over HTTP. You can use any static server. For example, using Python:
   ```bash
   python3 -m http.server 8080
   ```
   Then navigate to `http://localhost:8080` in your browser.

3. **Modifying Data (Optional):**
   If you want to add new characters or movies:
   - Edit the files in `/scripts/seed/`.
   - Run the generation script: `node scripts/generate-data.js`
   - Validate the graph: `node scripts/validate.js`

## 🧠 The Knowledge Graph

At the core of the archive is a custom knowledge engine. Every entity (Movie, Character, Universe, Event) is a node, and their relationships are edges. This allows the application to render highly complex contextual displays automatically. 

For instance, looking at "Tony Stark" doesn't just show a list of movies; the engine resolves his timeline, affiliations, variants across the multiverse, and causal impacts on MCU events.

## ⚖️ Disclaimer

This project is a fan-made, non-commercial portfolio piece. Marvel, the Marvel logo, and all Marvel Cinematic Universe characters, titles, and related materials are trademarks and copyrights of Marvel Entertainment, LLC and The Walt Disney Company. No copyright infringement is intended.

---
**Created by [Rishvin Reddy](https://github.com/RishvinReddy).**
