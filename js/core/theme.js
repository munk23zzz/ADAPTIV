/**
 * GLOBAL THEME MANAGER
 * Handles Dark/Light mode switching and persistence across all pages.
 */

const ThemeManager = {
    storageKey: 'edumentor-theme',

    init() {
        const savedTheme = localStorage.getItem(this.storageKey) || 'dark';
        this.apply(savedTheme);

        // Sync across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.apply(e.newValue);
            }
        });

        // Initialize any theme toggles on the page
        document.addEventListener('DOMContentLoaded', () => {
            this.updateToggleIcons();
            
            const themeBtn = document.getElementById('btn-theme');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => this.toggle());
            }
        });
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const target = current === 'dark' ? 'light' : 'dark';
        this.apply(target);
        localStorage.setItem(this.storageKey, target);
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleIcons();
        
        // Trigger custom event for components that need to re-render
        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
    },

    updateToggleIcons() {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            themeIcon.textContent = current === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
};

// Initialize immediately to prevent flash of unstyled content (FOUC)
ThemeManager.init();
