/**
 * FLOW MANAGER — ADAPTIV
 * Orchestrates the sequence: Onboarding -> Terms of Agreement -> Welcome Overlay.
 */

class FlowManager {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.isNewUser = this.urlParams.get('newuser') === 'true';
        this.init();
    }

    init() {
        if (this.isNewUser) {
            // Clean up URL immediately to prevent re-triggering on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            // Start the flow
            this.start();
        }
    }

    start() {
        console.log("ADAPTIV Flow: Skipping Onboarding, showing Terms");
        this.next('terms');
    }

    next(target) {
        if (target === 'terms') {
            console.log("ADAPTIV Flow: Showing Terms");
            if (window.adaptivTerms) {
                window.adaptivTerms.show();
            }
        } else if (target === 'welcome') {
            console.log("ADAPTIV Flow: Showing Welcome Overlay");
            this.showWelcome();
        }
    }

    showWelcome() {
        const overlay = document.getElementById('welcome-overlay');
        if (!overlay) return;

        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 100);

        // Auto-hide welcome after 3 seconds
        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
                console.log("ADAPTIV Flow: Flow Complete");
            }, 800);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adaptivFlowManager = new FlowManager();
});
