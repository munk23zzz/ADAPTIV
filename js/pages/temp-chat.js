/**
 * TEMPORARY CHAT MANAGER
 * Handles toggling between normal and temporary chat modes.
 * Ensures data is cleared upon exiting or navigating away.
 */

document.addEventListener('DOMContentLoaded', () => {
    const btnTempChat = document.getElementById('btn-temp-chat');
    const chatInner = document.getElementById('chat-inner');
    const emptyState = document.getElementById('empty-state');
    
    let isTempMode = false;
    let normalChatBackup = null;

    if (!btnTempChat) return;

    btnTempChat.addEventListener('click', () => {
        toggleTemporaryMode();
    });

    function toggleTemporaryMode() {
        isTempMode = !isTempMode;
        const body = document.body;

        if (isTempMode) {
            // ENTERING TEMPORARY MODE
            body.classList.add('temp-mode-active');
            
            // 1. Backup current chat state (optional, here we just hide it)
            // For a real app, we might save the 'messages' array from chat.js
            
            // 2. Clear current view
            // We keep the empty state but clear any actual message groups
            const messages = chatInner.querySelectorAll('.msg-group');
            messages.forEach(m => m.remove());
            
            // Show a small notification
            console.log("Temporary Mode Activated");
            
            // Reset empty state if it was hidden
            if (emptyState) emptyState.style.display = 'flex';

        } else {
            // EXITING TEMPORARY MODE
            body.classList.remove('temp-mode-active');
            
            // The user requested that data be lost when leaving.
            // The safest and cleanest way to "reset" everything and clear memory 
            // is to reload the page or clear the internal message arrays.
            
            alert("Sesi Chat Sementara berakhir. Seluruh pesan dalam mode ini telah dihapus.");
            window.location.reload(); 
        }
    }

    // Handle "Clear on navigation" 
    // Since this is a multi-page app, clicking any link will reload the page 
    // and naturally clear the 'messages' array in chat.js.
    // However, we can add a specific listener for extra security.
    window.addEventListener('beforeunload', () => {
        if (isTempMode) {
            // Clear any sensitive temp data from localStorage if we had any
            // sessionStorage.removeItem('temp_chat_history');
        }
    });
});
