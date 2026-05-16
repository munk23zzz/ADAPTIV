/**
 * TEMPORARY CHAT MANAGER
 * Handles the logic for "Temporary Mode" where chats are not saved.
 */

class TemporaryChatManager {
    constructor() {
        this.isTemporary = false;
        this.btn = document.getElementById('btn-temp-chat');
        this.appContainer = document.getElementById('app');
        this.chatInner = document.getElementById('chat-inner');
        this.init();
    }

    init() {
        if (!this.btn) return;

        this.btn.addEventListener('click', () => this.toggleTemporaryMode());

        // Handle navigation away
        const navLinks = document.querySelectorAll('.drawer-main-nav a, .recent-item, .logo-wrap');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isTemporary) {
                    this.disableTemporaryMode();
                }
            });
        });
    }

    toggleTemporaryMode() {
        if (this.isTemporary) {
            this.disableTemporaryMode();
        } else {
            this.enableTemporaryMode();
        }
    }

    enableTemporaryMode() {
        this.isTemporary = true;
        document.body.classList.add('is-temporary-mode');
        
        // Change icon and title
        if (this.btn) {
            this.btn.setAttribute('title', 'Matikan Chat Sementara');
            const icon = this.btn.querySelector('svg path');
            if (icon) {
                icon.setAttribute('stroke-dasharray', '4 3'); // Make it dashed
            }
        }

        // Clear existing messages for the temporary session
        this.clearChatUI();

        console.log("ADAPTIV: Temporary Mode Enabled");
    }

    disableTemporaryMode() {
        this.isTemporary = false;
        document.body.classList.remove('is-temporary-mode');
        
        if (this.btn) {
            this.btn.setAttribute('title', 'Mulai Temporary Chat');
            const icon = this.btn.querySelector('svg path');
            if (icon) {
                icon.removeAttribute('stroke-dasharray');
            }
        }

        // Return to normal state - clear temp messages
        this.clearChatUI();

        console.log("ADAPTIV: Temporary Mode Disabled");
    }

    clearChatUI() {
        if (!this.chatInner) return;
        
        // Remove all messages (msg-group elements)
        const groups = this.chatInner.querySelectorAll('.msg-group');
        groups.forEach(g => g.remove());

        // Reset empty state visibility if not in temp mode
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = this.isTemporary ? 'none' : 'flex';
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.tempChatManager = new TemporaryChatManager();
});
