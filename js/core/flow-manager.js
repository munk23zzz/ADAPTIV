/**
 * FLOW MANAGER — ADAPTIV
 * Orchestrates the sequence: Onboarding -> Terms of Agreement -> Welcome Overlay.
 */

class FlowManager {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.isDashboard = window.location.pathname.includes('dashboard.html');
        this.isOnboardingPage = window.location.pathname.includes('onboarding.html');
        this.init();
    }

    init() {
        // Flow logic on Dashboard (Return user vs New user from onboarding)
        if (this.isDashboard) {
            // Dashboard should only show welcome if coming from onboarding with a flag
            if (this.urlParams.get('welcome') === 'true') {
                this.showWelcome();
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }
        }
    }

    startOnboardingFlow() {
        console.log("ADAPTIV Flow: Starting Onboarding Sequence");
        // This is called by onboarding.js when the survey is done or skipped
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
        const welcomeName = document.getElementById('user-display-name-welcome');
        
        // Update name from local storage if possible
        const storedName = localStorage.getItem('adaptiv_user_name');
        if (storedName && welcomeName) {
            welcomeName.textContent = storedName.split(' ')[0];
        }

        if (!overlay) return;

        overlay.style.display = 'flex';
        // Force reflow
        overlay.offsetHeight;
        overlay.classList.add('show');
        overlay.classList.add('active'); // onboarding.css uses .active

        // Auto-hide welcome after 3.5 seconds
        setTimeout(() => {
            overlay.classList.remove('show');
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
                console.log("ADAPTIV Flow: Flow Complete");
                
                // If on onboarding page, redirect to dashboard
                if (this.isOnboardingPage) {
                    window.location.href = '../app/dashboard.html';
                }
            }, 1000);
        }, 3500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adaptivFlowManager = new FlowManager();
});
