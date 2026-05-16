/**
 * ADAPTIV AI - Dashboard Logic
 * Enterprise-grade Vanilla JS.
 * Menangani interaksi UI, Modals, Upload Zone, dan Animasi Data.
 */

class DashboardController {
    constructor() {
        // 1. Inisialisasi DOM Elements
        this.body = document.body;
        
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

        // Jalankan semua setup
        this.init();
    }

    init() {
        this.setupModals();
        this.setupUploadZone();
        this.animateCounters();
        this.updateUserGreeting();
        this.checkWelcomeAnimation();
    }

    /**
     * Update Greeting dengan nama dari localStorage
     */
    updateUserGreeting() {
        const dashboardUserName = document.getElementById('dashboard-user-name');
        if (dashboardUserName) {
            const storedName = localStorage.getItem('adaptiv_user_name') || 'Nabil';
            dashboardUserName.textContent = storedName.split(' ')[0]; // Ambil nama depan saja
        }
    }

    /**
     * Apple-style Welcome Animation
     * Dipicu jika ada parameter ?newuser=true di URL
     */
    checkWelcomeAnimation() {
        const urlParams = new URLSearchParams(window.location.search);
        const isNewUser = urlParams.get('newuser') === 'true';
        const welcomeOverlay = document.getElementById('welcome-overlay');
        const userDisplayName = document.getElementById('user-display-name');

        if (isNewUser && welcomeOverlay) {
            // Ambil nama dari localStorage
            const storedName = localStorage.getItem('adaptiv_user_name') || 'User';
            if (userDisplayName) userDisplayName.textContent = storedName;

            // Tampilkan Overlay & Blur Dashboard
            welcomeOverlay.style.display = 'flex';
            document.body.classList.add('welcome-active');

            // Trigger Fade In & Scale
            requestAnimationFrame(() => {
                welcomeOverlay.classList.add('active');
            });

            // Sembunyikan setelah beberapa detik
            setTimeout(() => {
                welcomeOverlay.classList.remove('active');
                document.body.classList.remove('welcome-active');
                
                // Hapus overlay sepenuhnya setelah transisi selesai
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                    // Bersihkan URL agar tidak re-trigger saat refresh
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                }, 1200);
            }, 3000);
        }
    }

    // ═══════════════════════════════════════════════
    // 1. MODAL MANAGEMENT
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

        // Update UI: Tampilkan nama file di dropzone premium
        const dropzoneTitle = this.dropzone.querySelector('.dropzone__title--premium');
        if (dropzoneTitle) {
            dropzoneTitle.innerHTML = `Memproses: <span class="text--accent-cyan">${file.name}</span>`;
        }

        // Jalankan upload otomatis
        this.simulateUploadProcess();
    }

    simulateUploadProcess() {
        // Simulasi delay jaringan/AI processing
        setTimeout(() => {
            this.showToast('Dokumen berhasil diupload dan diproses!', 'success');
            this.closeModal(document.getElementById('upload-modal-overlay'));

            // Reset Dropzone state setelah tertutup
            setTimeout(() => {
                const dropzoneTitle = this.dropzone.querySelector('.dropzone__title--premium');
                if (dropzoneTitle) dropzoneTitle.textContent = 'atau seret file Anda';
                this.uploadedFiles = [];
            }, 500);
        }, 2500);
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