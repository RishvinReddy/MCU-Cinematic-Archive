import { loadCoreData } from './data-loader.js';

// Setup GSAP
gsap.registerPlugin(ScrollTrigger);

async function initAnimations() {
    // Hero Timeline
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-kicker', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
      .fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo('.hero-description', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5')
      .fromTo('.btn-primary', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.5')
      .fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 0.5, duration: 1 }, '-=0.2');

    // Load data for showcase
    const { movies } = await loadCoreData();
    if (movies) {
        renderPhaseShowcase(movies);
    }
}

function renderPhaseShowcase(movies) {
    const container = document.getElementById('phase-one-movies');
    if (!container) return;

    const phaseOneMovies = movies.filter(m => m.phase == 1 || m.phase === '1');
    
    let html = '';
    phaseOneMovies.forEach(movie => {
        let sagaClass = '';
        if (movie.saga === 'Infinity Saga') sagaClass = 'saga-infinity';
        else if (movie.saga === 'Multiverse Saga') sagaClass = 'saga-multiverse';

        html += `
            <a href="movies.html?id=${movie.id}" class="movie-card gsap-card ${sagaClass}">
                <div class="movie-card-inner hover-glow">
                    <div class="movie-card-placeholder">Poster Placeholder</div>
                    <div class="movie-card-info">
                        <h3>${movie.title}</h3>
                        <span>${movie.releaseYear}</span>
                    </div>
                </div>
            </a>
        `;
    });
    
    container.innerHTML = html;

    // ScrollTrigger Animations
    gsap.fromTo('.phase-header', 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, y: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.showcase-section',
                start: 'top 70%',
            }
        }
    );

    gsap.fromTo('.gsap-card',
        { opacity: 0, x: 50 },
        {
            opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: {
                trigger: '#phase-one-movies',
                start: 'top 80%'
            }
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});
