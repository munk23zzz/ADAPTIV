/**
 * GLOBAL THEME MANAGER
 * Handles Dark/Light mode switching and persistence across all pages.
 */

const ThemeManager = {
    storageKey: 'edumentor-theme',

    init() {
        // 1. Get saved theme or default to 'dark'
        const savedTheme = localStorage.getItem(this.storageKey) || 'dark';
        
        // 2. Apply theme immediately to documentElement
        this.apply(savedTheme);

        // 3. Sync across tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey && e.newValue) {
                this.apply(e.newValue);
            }
        });

        // 4. Set up UI listeners once DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    },

    setupUI() {
        this.updateToggleIcons();
        
        // Use event delegation for theme toggles to handle dynamic content
        document.addEventListener('click', (e) => {
            const themeBtn = e.target.closest('#btn-theme');
            if (themeBtn) {
                this.toggle();
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
        if (!theme) return;
        
        // Apply to <html> tag
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update icons if DOM is ready
        this.updateToggleIcons();
        
        // Trigger custom event for components that need to re-render
        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
    },

    updateToggleIcons() {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            // Invert the icon: if dark mode, show light_mode icon (to switch to light)
            themeIcon.textContent = current === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
};

// Initialize immediately
ThemeManager.init();
