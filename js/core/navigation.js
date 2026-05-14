/**
 * GLOBAL NAVIGATION MANAGER
 * Handles active states for sidebar and header links dynamically.
 * Also manages: Global Drawer, Account Popup (2-level), Profile Dropdown.
 */

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // 1. ACTIVE STATE HIGHLIGHTING
    const mainNavLinks = document.querySelectorAll('.drawer-main-nav a');
    mainNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Legacy nav links (fallback)
    const otherNavLinks = document.querySelectorAll('.sidebar-nav__link, .nav-links a, .drawer-nav a');
    otherNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPath)) {
            link.classList.add('sidebar-nav__link--active', 'active');
        } else {
            link.classList.remove('sidebar-nav__link--active', 'active');
        }
    });

    // 2. GLOBAL DRAWER LOGIC (Sidebar)
    const sidebar = document.getElementById('global-drawer');
    const sidebarToggle = document.getElementById('sidebar-toggle-btn') ||
                          document.getElementById('btn-global-menu');
    const sidebarBackdrop = document.getElementById('global-drawer-overlay');
    const drawerCloseBtn = document.getElementById('btn-close-drawer');

    const closeSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.remove('show');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
        if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        // Also close popups when drawer closes
        closeAllPopups();
    };

    const openSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.add('show');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
        if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.contains('show') ? closeSidebar() : openSidebar();
        });
    }

    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // 3. ACCOUNT POPUP — 2-LEVEL LOGIC
    const accountBarBtn  = document.getElementById('account-bar-btn');
    const accountPopup   = document.getElementById('account-popup');
    const popupUserRow   = document.getElementById('popup-user-row');
    const accountSubPopup = document.getElementById('account-sub-popup');

    const closeAllPopups = () => {
        if (accountPopup)    accountPopup.classList.add('hidden');
        if (accountSubPopup) accountSubPopup.classList.add('hidden');
    };

    // Toggle Level-1 popup when clicking account bar
    if (accountBarBtn && accountPopup) {
        accountBarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = accountPopup.classList.contains('hidden');
            if (isHidden) {
                // Close sub-popup first
                if (accountSubPopup) accountSubPopup.classList.add('hidden');
                accountPopup.classList.remove('hidden');
            } else {
                closeAllPopups();
            }
        });
    }

    // Toggle Level-2 sub-popup when clicking user row inside Level-1 popup
    if (popupUserRow && accountSubPopup) {
        popupUserRow.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = accountSubPopup.classList.contains('hidden');
            if (isHidden) {
                accountSubPopup.classList.remove('hidden');
            } else {
                accountSubPopup.classList.add('hidden');
            }
        });
    }

    // Close both popups when clicking outside the drawer-account zone
    document.addEventListener('click', (e) => {
        const drawerAccount = document.querySelector('.drawer-account');
        if (drawerAccount && !drawerAccount.contains(e.target)) {
            closeAllPopups();
        }
    });

    // 4. PROFILE DROPDOWN LOGIC (legacy — topbar)
    const profileBtn  = document.getElementById('profile-menu-btn');
    const profileMenu = document.getElementById('profile-menu');

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = profileMenu.hasAttribute('hidden');
            if (isHidden) {
                profileMenu.removeAttribute('hidden');
                profileBtn.setAttribute('aria-expanded', 'true');
            } else {
                profileMenu.setAttribute('hidden', '');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.setAttribute('hidden', '');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
