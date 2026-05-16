/**
 * TEMPORARY CHAT MANAGER
 * Handles the "Incognito/Temporary" mode for the chat interface.
 * This mode is transient and will disappear upon navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const tempChatBtn = document.getElementById('btn-temp-chat');
    const html = document.documentElement;
    let isTemporary = false;

    if (!tempChatBtn) return;

    // Store the theme before entering temporary mode
    let originalTheme = html.getAttribute('data-theme') || 'dark';

    tempChatBtn.addEventListener('click', () => {
        isTemporary = !isTemporary;

        if (isTemporary) {
            // Enter Temporary Mode
            originalTheme = html.getAttribute('data-theme'); // Refresh original theme
            html.setAttribute('data-theme', 'temporary');
            tempChatBtn.classList.add('active');
            
            // Show a subtle notification or feedback
            console.log('Mode Obrolan Sementara Aktif');
            
            // Change button icon or style if needed
            // tempChatBtn.querySelector('svg').style.color = 'var(--accent-primary)';
        } else {
            // Exit Temporary Mode
            html.setAttribute('data-theme', originalTheme);
            tempChatBtn.classList.remove('active');
            console.log('Mode Obrolan Sementara Dinonaktifkan');
        }
    });

    // Handle the case where the global ThemeManager toggles the theme while in temporary mode
    window.addEventListener('themechanged', (e) => {
        if (!isTemporary) {
            originalTheme = e.detail.theme;
        }
    });
});
