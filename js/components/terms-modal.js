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
        if (this.overlay) {
            this.overlay.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        }
    }

    handleAgree() {
        if (this.checkbox.checked) {
            localStorage.setItem(this.storageKey, 'true');
            this.overlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // TRIGGER NEXT IN FLOW: Welcome Overlay
            if (window.adaptivFlowManager) {
                window.adaptivFlowManager.next('welcome');
            }
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adaptivTerms = new TermsModal();
});
