class SoundSystem {
    constructor() {
        this.enabled = localStorage.getItem('mcu-sound') === 'true';
        this.context = null;
        this.sounds = {
            hover: null,
            focus: null,
            ambient: null
        };
        this.init();
    }

    init() {
        // Only initialize AudioContext after first user interaction if enabled
        document.addEventListener('click', () => {
            if (this.enabled && !this.context) {
                this.setupAudio();
            }
        }, { once: true });

        const toggleBtn = document.getElementById('sound-toggle');
        if (toggleBtn) {
            this.updateIcon(toggleBtn);
            toggleBtn.addEventListener('click', () => {
                this.enabled = !this.enabled;
                localStorage.setItem('mcu-sound', this.enabled);
                this.updateIcon(toggleBtn);
                
                if (this.enabled) {
                    if (!this.context) this.setupAudio();
                    else this.context.resume();
                } else {
                    if (this.context) this.context.suspend();
                }
            });
        }
    }

    updateIcon(btn) {
        const icon = btn.querySelector('.sound-icon');
        if (icon) {
            icon.textContent = this.enabled ? '🔊' : '🔇';
        }
    }

    setupAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            
            // We use synthetic sounds to avoid missing asset errors,
            // but this could easily load fetch() buffers in a real prod app.
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.enabled = false;
        }
    }

    play(type) {
        if (!this.enabled || !this.context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const osc = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(this.context.destination);

        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, this.context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + 0.1);
        } else if (type === 'focus') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.3);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + 0.3);
        }
    }
}

window.SoundManager = new SoundSystem();

// Global Hover Events
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.movie-card') || e.target.closest('.node')) {
        if (window.SoundManager) {
            window.SoundManager.play('hover');
        }
    }
});
