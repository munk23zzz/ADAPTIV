/**
 * TERMS OF AGREEMENT — ADAPTIV
 * Handles visibility, consent tracking, and initial display.
 */

class TermsModal {
    constructor() {
        this.overlay = document.getElementById('terms-overlay');
        this.checkbox = document.getElementById('terms-checkbox');
        this.btnAgree = document.getElementById('btn-terms-agree');
        this.storageKey = 'adaptiv_terms_agreed';
        
        this.init();
    }

    init() {
        if (!this.overlay) return;

        // Check if user already agreed
        const hasAgreed = localStorage.getItem(this.storageKey);
        
        // For development/demo purposes, we might want to show it after onboarding
        // We'll trigger it if it's the first time
        if (!hasAgreed) {
            this.show();
        }

        // Listen for checkbox changes
        if (this.checkbox) {
            this.checkbox.addEventListener('change', () => {
                if (this.checkbox.checked) {
                    this.btnAgree.classList.add('active');
                } else {
                    this.btnAgree.classList.remove('active');
                }
            });
        }

        // Listen for agree button click
        if (this.btnAgree) {
            this.btnAgree.addEventListener('click', () => {
                this.handleAgree();
            });
        }
    }

    show() {
        // Wait a bit after page load or onboarding
        setTimeout(() => {
            this.overlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }, 1000);
    }

    handleAgree() {
        if (this.checkbox.checked) {
            localStorage.setItem(this.storageKey, 'true');
            this.overlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // Trigger welcome toast or something else
            console.log('ADAPTIV: Terms Agreed');
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adaptivTerms = new TermsModal();
});
