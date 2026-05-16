/**
 * ONBOARDING MANAGER — ADAPTIV
 * Manages the premium introduction flow with smooth transitions.
 * When skipped, it correctly signals the FlowManager to proceed to Terms.
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
            this.btnSkip.addEventListener('click', () => {
                console.log("ADAPTIV: Onboarding skipped");
                this.finish();
            });
        }
    }

    start() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            // Trigger reflow
            void this.overlay.offsetWidth;
            this.overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            // Fade out current content
            const content = this.steps[this.currentStep];
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                this.steps[this.currentStep].classList.remove('active');
                this.dots[this.currentStep].classList.remove('active');
                
                this.currentStep++;
                
                this.steps[this.currentStep].classList.add('active');
                this.dots[this.currentStep].classList.add('active');
                
                if (this.currentStep === this.steps.length - 1) {
                    this.btnNext.textContent = 'Mulai Belajar';
                }
            }, 300);
        } else {
            this.finish();
        }
    }

    finish() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
            setTimeout(() => {
                this.overlay.style.display = 'none';
                document.body.style.overflow = '';
                
                // SIGNAL FLOW MANAGER: Direct to Terms
                if (window.adaptivFlowManager) {
                    window.adaptivFlowManager.next('terms');
                }
            }, 600);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.onboardingManager = new OnboardingManager();
});
