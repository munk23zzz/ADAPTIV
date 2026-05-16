/**
 * ONBOARDING MANAGER — ADAPTIV
 * Handles the step-by-step introduction and triggers the flow sequence.
 */

class OnboardingManager {
    constructor() {
        this.overlay = document.getElementById('onboarding-overlay');
        this.steps = document.querySelectorAll('.onboarding-step');
        this.dots = document.querySelectorAll('.onboarding-dot');
        this.btnNext = document.getElementById('onboarding-next');
        this.btnSkip = document.getElementById('onboarding-skip');
        this.currentStep = 0;
        
        this.init();
    }

    init() {
        if (!this.overlay) return;

        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => this.nextStep());
        }

        if (this.btnSkip) {
            this.btnSkip.addEventListener('click', () => this.finish());
        }
    }

    start() {
        this.overlay.classList.add('show');
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.steps[this.currentStep].classList.remove('active');
            this.dots[this.currentStep].classList.remove('active');
            
            this.currentStep++;
            
            this.steps[this.currentStep].classList.add('active');
            this.dots[this.currentStep].classList.add('active');

            if (this.currentStep === this.steps.length - 1) {
                this.btnNext.textContent = 'Mulai';
            }
        } else {
            this.finish();
        }
    }

    finish() {
        this.overlay.classList.remove('show');
        setTimeout(() => {
            this.overlay.style.display = 'none';
            // TRIGGER NEXT IN FLOW: Terms of Agreement
            if (window.adaptivFlowManager) {
                window.adaptivFlowManager.next('terms');
            }
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.onboardingManager = new OnboardingManager();
});
