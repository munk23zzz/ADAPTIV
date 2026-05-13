/**
 * ADAPTIV AI - Dashboard Logic
 * Enterprise-grade Vanilla JS.
 * Menangani interaksi UI, Modals, Upload Zone, dan Animasi Data.
 */

class DashboardController {
    constructor() {
        // 1. Inisialisasi DOM Elements
        this.body = document.body;

        // Sidebar Elements
        this.sidebar = document.getElementById('global-drawer');
        this.sidebarToggle = document.getElementById('sidebar-toggle-btn');
        this.sidebarBackdrop = document.getElementById('global-drawer-overlay');
        this.drawerCloseBtn = document.getElementById('btn-close-drawer');

        // Dropdown Elements
        this.profileBtn = document.getElementById('profile-menu-btn');
        this.profileMenu = document.getElementById('profile-menu');
        this.notifBtn = document.getElementById('notifications-btn');
        this.notifPanel = document.getElementById('notifications-panel');

        // Upload Elements
        this.dropzone = document.getElementById('upload-dropzone');
        this.fileInput = document.getElementById('file-input');
        this.uploadBtn = document.getElementById('start-upload-btn');
        this.primaryText = this.dropzone ? this.dropzone.querySelector('.dropzone__primary-text') : null;
        this.secondaryText = this.dropzone ? this.dropzone.querySelector('.dropzone__secondary-text') : null;

        // Modal Triggers
        this.modalTriggers = document.querySelectorAll('[data-modal-target]');
        this.modalCloseBtns = document.querySelectorAll('[data-modal-close]');

        // State
        this.uploadedFiles = [];
        this.activeDropdown = null;

        // Jalankan semua setup
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupDropdowns();
        this.setupModals();
        this.setupUploadZone();
        this.animateCounters();

        // Global click listener untuk nutup dropdown kalau klik di luar
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
    }

    // ═══════════════════════════════════════════════
    // 1. SIDEBAR LOGIC
    // ═══════════════════════════════════════════════
    setupSidebar() {
        if (!this.sidebarToggle || !this.sidebar) return;

        const toggleSidebar = () => {
            const isExpanded = this.sidebar.classList.contains('show');

            if (isExpanded) {
                this.sidebar.classList.remove('show');
                this.sidebarBackdrop.classList.remove('show');
                this.sidebarToggle.setAttribute('aria-expanded', 'false');
                this.body.style.overflow = '';
            } else {
                this.sidebar.classList.add('show');
                this.sidebarBackdrop.classList.add('show');
                this.sidebarToggle.setAttribute('aria-expanded', 'true');
                this.body.style.overflow = 'hidden';
            }
        };

        this.sidebarToggle.addEventListener('click', toggleSidebar);
        if (this.drawerCloseBtn) {
            this.drawerCloseBtn.addEventListener('click', toggleSidebar);
        }
        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener('click', toggleSidebar);
        }
    }

    // ═══════════════════════════════════════════════
    // 2. DROPDOWNS (Profile & Notifications)
    // ═══════════════════════════════════════════════
    setupDropdowns() {
        const toggleDropdown = (btn, menu) => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Tutup dropdown lain yang lagi kebuka
            this.closeAllDropdowns();

            if (!isExpanded) {
                btn.setAttribute('aria-expanded', 'true');
                menu.removeAttribute('hidden');
                this.activeDropdown = { btn, menu };
            }
        };

        if (this.profileBtn && this.profileMenu) {
            this.profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDropdown(this.profileBtn, this.profileMenu);
            });
        }

        if (this.notifBtn && this.notifPanel) {
            this.notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDropdown(this.notifBtn, this.notifPanel);
            });
        }
    }

    closeAllDropdowns() {
        if (this.activeDropdown) {
            this.activeDropdown.btn.setAttribute('aria-expanded', 'false');
            this.activeDropdown.menu.setAttribute('hidden', 'true');
            this.activeDropdown = null;
        }
    }

    handleGlobalClick(e) {
        if (this.activeDropdown) {
            const isClickInside = this.activeDropdown.menu.contains(e.target) ||
                this.activeDropdown.btn.contains(e.target);
            if (!isClickInside) {
                this.closeAllDropdowns();
            }
        }
    }

    // ═══════════════════════════════════════════════
    // 3. MODAL MANAGEMENT
    // ═══════════════════════════════════════════════
    setupModals() {
        this.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-modal-target');
                const overlay = document.getElementById(`${targetId}-overlay`);
                if (overlay) this.openModal(overlay);
            });
        });

        this.modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-modal-close');
                const overlay = document.getElementById(`${targetId}-overlay`);
                if (overlay) this.closeModal(overlay);
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openOverlay = document.querySelector('.modal-overlay:not([hidden])');
                if (openOverlay) this.closeModal(openOverlay);
                this.closeAllDropdowns();
            }
        });
    }

    openModal(overlay) {
        overlay.removeAttribute('hidden');
        this.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Focus management untuk aksesibilitas
        const focusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
            setTimeout(() => focusable.focus(), 100);
        }
    }

    closeModal(overlay) {
        overlay.setAttribute('hidden', 'true');
        this.body.style.overflow = '';
    }

    // ═══════════════════════════════════════════════
    // 4. UPLOAD ZONE (Drag & Drop)
    // ═══════════════════════════════════════════════
    setupUploadZone() {
        if (!this.dropzone || !this.fileInput) return;

        // Prevent default browser behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight dropzone on drag over
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropzone.addEventListener(eventName, () => {
                this.dropzone.setAttribute('data-state', 'dragover');
                this.dropzone.style.borderColor = 'var(--color-accent-cyan)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropzone.addEventListener(eventName, () => {
                this.dropzone.setAttribute('data-state', 'idle');
                this.dropzone.style.borderColor = '';
            }, false);
        });

        // Handle dropped files
        this.dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFiles(files);
        });

        // Handle clicked files
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Handle Upload Button Click (Simulasi)
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => {
                this.simulateUploadProcess();
            });
        }
    }

    handleFiles(files) {
        if (files.length === 0) return;

        // Ambil file pertama saja untuk demo ini
        const file = files[0];
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

        // Keamanan: Validasi tipe file di frontend
        if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|txt|doc|docx|ppt|pptx)$/i)) {
            this.showToast('Format file tidak didukung.', 'error');
            return;
        }

        this.uploadedFiles = [file];

        // Update UI Dropzone
        if (this.primaryText) this.primaryText.innerHTML = `File terpilih: <strong class="text--accent-cyan">${this.sanitizeHTML(file.name)}</strong>`;
        if (this.secondaryText) this.secondaryText.textContent = `Ukuran: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;

        this.uploadBtn.disabled = false;
        this.dropzone.style.borderColor = 'var(--color-accent-cyan)';
    }

    simulateUploadProcess() {
        this.uploadBtn.disabled = true;
        this.uploadBtn.innerHTML = '<span class="icon icon--spinner fa-spin" aria-hidden="true"></span> Memproses...';

        // Simulasi delay jaringan/AI processing
        setTimeout(() => {
            this.showToast('Dokumen berhasil diupload dan diproses!', 'success');
            this.closeModal(document.getElementById('upload-modal-overlay'));

            // Reset Modal state
            this.uploadBtn.innerHTML = 'Upload & Proses';
            if (this.primaryText) this.primaryText.textContent = 'Seret & lepas file di sini';
            if (this.secondaryText) this.secondaryText.textContent = 'atau';
            this.dropzone.style.borderColor = '';
            this.uploadedFiles = [];
        }, 2000);
    }

    // ═══════════════════════════════════════════════
    // 5. ANIMATED COUNTERS (Stat Cards)
    // ═══════════════════════════════════════════════
    animateCounters() {
        const statValues = document.querySelectorAll('.stat-card__value');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    this.countUp(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(stat => observer.observe(stat));
    }

    countUp(element, target) {
        const duration = 1500; // 1.5 detik
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const isPercentage = element.textContent.includes('%');
        const isHours = element.textContent.includes('j');

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);

            if (isPercentage) {
                element.textContent = `${currentCount}%`;
            } else if (isHours) {
                element.textContent = `${currentCount}j`;
            } else {
                element.textContent = currentCount;
            }

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameRate);
    }

    // ═══════════════════════════════════════════════
    // 6. UTILITIES (Keamanan & Toast)
    // ═══════════════════════════════════════════════
    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type} fade-in`;

        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';

        toast.innerHTML = `
      <span aria-hidden="true">${icon}</span>
      <p class="toast__message">${this.sanitizeHTML(message)}</p>
    `;

        container.appendChild(toast);

        // Hapus toast setelah 3 detik
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inisialisasi class saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    window.adaptivDashboard = new DashboardController();
});