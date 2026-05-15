document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════ MOCK DATA ═══════════════
    const folders = [
        { id: 1, name: "Calculus", icon: "📐", color: "#7C5CFC", fileCount: 4, updated: "14 Jan 2025" },
        { id: 2, name: "Fisika Dasar", icon: "⚡", color: "#F59E0B", fileCount: 3, updated: "12 Jan 2025" },
        { id: 3, name: "Algoritma & Pemrograman", icon: "💻", color: "#10B981", fileCount: 5, updated: "10 Jan 2025" },
        { id: 4, name: "Sistem Operasi", icon: "🖥️", color: "#EF4444", fileCount: 2, updated: "8 Jan 2025" },
        { id: 5, name: "Kimia Organik", icon: "🧪", color: "#06B6D4", fileCount: 3, updated: "5 Jan 2025" },
        { id: 6, name: "Bahasa Inggris", icon: "📝", color: "#EC4899", fileCount: 2, updated: "3 Jan 2025" },
    ];

    const files = {
        1: [
            { name: "Limit_dan_Turunan.pdf", size: "2.4 MB", date: "14 Jan 2025", type: "pdf", status: "ready" },
            { name: "Integral_Tentu.pdf", size: "1.8 MB", date: "13 Jan 2025", type: "pdf", status: "ready" },
            { name: "Slide_Kalkulus_Bab3.pptx", size: "3.2 MB", date: "12 Jan 2025", type: "pptx", status: "ready" },
            { name: "Catatan_Deret.docx", size: "0.5 MB", date: "10 Jan 2025", type: "docx", status: "ready" },
        ],
        2: [
            { name: "Hukum_Newton.pdf", size: "3.1 MB", date: "12 Jan 2025", type: "pdf", status: "ready" },
            { name: "Termodinamika.pdf", size: "2.7 MB", date: "11 Jan 2025", type: "pdf", status: "ready" },
            { name: "Slide_Gelombang.pptx", size: "4.5 MB", date: "9 Jan 2025", type: "pptx", status: "ready" },
        ],
        3: [
            { name: "Sorting_Algorithm.pdf", size: "1.5 MB", date: "10 Jan 2025", type: "pdf", status: "ready" },
            { name: "Graph_Theory.pdf", size: "2.0 MB", date: "9 Jan 2025", type: "pdf", status: "ready" },
            { name: "Slide_Dynamic_Programming.pptx", size: "3.8 MB", date: "8 Jan 2025", type: "pptx", status: "ready" },
            { name: "Tugas_Rekursi.docx", size: "0.3 MB", date: "7 Jan 2025", type: "docx", status: "ready" },
            { name: "Latihan_Struktur_Data.pdf", size: "1.2 MB", date: "6 Jan 2025", type: "pdf", status: "ready" },
        ],
        4: [
            { name: "Modul_Sistem_Operasi.pdf", size: "2.4 MB", date: "8 Jan 2025", type: "pdf", status: "ready" },
            { name: "Slide_Manajemen_Memori.pptx", size: "3.0 MB", date: "7 Jan 2025", type: "pptx", status: "ready" },
        ],
        5: [
            { name: "Bab3_Kimia_Organik.pdf", size: "2.8 MB", date: "5 Jan 2025", type: "pdf", status: "ready" },
            { name: "Catatan_Reaksi_Substitusi.docx", size: "0.6 MB", date: "4 Jan 2025", type: "docx", status: "ready" },
            { name: "Slide_Senyawa_Aromatik.pptx", size: "4.1 MB", date: "3 Jan 2025", type: "pptx", status: "ready" },
        ],
        6: [
            { name: "Grammar_Notes.pdf", size: "1.1 MB", date: "3 Jan 2025", type: "pdf", status: "ready" },
            { name: "Essay_Writing_Guide.docx", size: "0.4 MB", date: "2 Jan 2025", type: "docx", status: "ready" },
        ],
    };

    // ═══════════════ DOM REFERENCES ═══════════════
    const folderContainer = document.getElementById('folder-container');
    const documentContainer = document.getElementById('document-container');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('doc-search');
    const filterSelect = document.getElementById('filter-type');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const actionBtn = document.getElementById('action-btn');
    const actionBtnIcon = document.getElementById('action-btn-icon');
    const actionBtnLabel = document.getElementById('action-btn-label');
    const breadcrumbSep = document.getElementById('breadcrumb-sep');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    const breadcrumbRoot = document.getElementById('breadcrumb-root');
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');

    // Modal References
    const nfOverlay = document.getElementById('nf-overlay');
    const nfNameInput = document.getElementById('nf-name');
    const nfConfirmBtn = document.getElementById('nf-confirm');
    const nfCancelBtn = document.getElementById('nf-cancel');
    const nfTabColor = document.getElementById('nf-tab-color');
    const nfTabIcon = document.getElementById('nf-tab-icon');
    const nfPanelColor = document.getElementById('nf-panel-color');
    const nfPanelIcon = document.getElementById('nf-panel-icon');
    const nfColorGrid = document.getElementById('nf-color-grid');
    const nfIconGrid = document.getElementById('nf-icon-grid');
    const nfPreviewIcon = document.getElementById('nf-preview-icon');
    const nfFolderShape = document.getElementById('nf-folder-shape');
    const nfOverlayIcon = document.getElementById('nf-overlay-icon');

    // Upload Modal References
    const upOverlay = document.getElementById('up-overlay');
    const upClose = document.getElementById('up-close');
    const upCancel = document.getElementById('up-cancel');
    const upConfirm = document.getElementById('up-confirm');
    const upDropzone = document.getElementById('up-dropzone');
    const upFileInput = document.getElementById('up-file-input');
    const upFileList = document.getElementById('up-file-list');

    // ═══════════════ STATE ═══════════════
    let currentFolderId = null; 
    let nextFolderId = folders.length + 1;
    let filesToUpload = [];
    
    // Modal State
    let selectedColor = '#7C5CFC';
    let selectedIcon = ''; // Empty string means no overlay icon (just folder)

    const COLORS = [
        '#7C5CFC', '#F59E0B', '#10B981', '#EF4444', '#06B6D4', 
        '#EC4899', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1',
        '#34D399', '#FBBF24', '#F87171', '#60A5FA'
    ];

    const ICONS = [
        '', 
        '💻', '📐', '⚡', '🧪', '📝', '📚', '📖', '🎓', '✏️', '🔬', 
        '🧮', '🌍', '🎨', '🎵', '⚽', '💡', '🏛️', '🧬', '🪐', '🧩', 
        '📎', '📅', '🎯', '🏆', '🔥', '✨'
    ];

    // ═══════════════ RENDER FUNCTIONS ═══════════════

    function renderFolders(filter = '') {
        const filtered = folders.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

        if (filtered.length === 0 && filter) {
            folderContainer.innerHTML = '';
            emptyState.style.display = 'flex';
            emptyState.querySelector('.empty-state__title').textContent = 'Folder tidak ditemukan';
            emptyState.querySelector('.empty-state__desc').textContent = `Tidak ada folder bernama "${filter}".`;
            return;
        }

        emptyState.style.display = 'none';

        folderContainer.innerHTML = filtered.map(folder => {
            // Check if it's an emoji (or if it's empty)
            const isEmoji = /^\p{Emoji}/u.test(folder.icon);
            const iconContent = isEmoji 
                ? `<span>${folder.icon}</span>`
                : `<span></span>`; // No icon fallback

            return `
                <article class="folder-card" data-folder-id="${folder.id}" tabindex="0" role="button" aria-label="Buka folder ${folder.name}">
                    <div class="folder-card__icon-area" style="background: linear-gradient(135deg, ${folder.color}15, transparent);">
                        <span class="material-icons-round" style="position: absolute; font-size: 80px; color: ${folder.color}; opacity: 0.8; filter: drop-shadow(0 2px 8px ${folder.color}40);">folder</span>
                        <div style="position: relative; z-index: 2; margin-top: 6px; font-size: 22px;">${iconContent}</div>
                    </div>
                    <div class="folder-card__body">
                        <h3 class="folder-card__name">${folder.name}</h3>
                        <div class="folder-card__meta">
                            <span class="folder-card__file-count">
                                <span class="material-icons-round">description</span>
                                ${folder.fileCount} file
                            </span>
                            <span>${folder.updated}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderFiles(folderId, filter = '') {
        const folderFiles = files[folderId] || [];
        const typeFilter = filterSelect.value;
        let filtered = folderFiles.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

        if (typeFilter !== 'all') {
            filtered = filtered.filter(f => f.type === typeFilter);
        }

        if (filtered.length === 0) {
            documentContainer.innerHTML = '';
            documentContainer.style.display = 'none';
            emptyState.style.display = 'flex';
            emptyState.querySelector('.empty-state__title').textContent = filter ? 'File tidak ditemukan' : 'Belum ada file';
            emptyState.querySelector('.empty-state__desc').textContent = filter
                ? `Tidak ada file bernama "${filter}".`
                : 'Unggah dokumen pertamamu ke folder ini.';
            return;
        }

        emptyState.style.display = 'none';
        documentContainer.style.display = '';

        const typeLabels = { pdf: 'PDF', pptx: 'PPT', docx: 'DOC' };

        documentContainer.innerHTML = filtered.map(file => `
            <article class="doc-card" data-type="${file.type}">
                <div class="doc-card__preview">
                    <div class="doc-card__preview-overlay"></div>
                    <span class="file-icon ${file.type}">${typeLabels[file.type] || file.type.toUpperCase()}</span>
                </div>
                <div class="doc-card__body">
                    <h3 class="doc-card__title">${file.name}</h3>
                    <div class="doc-card__meta">
                        <span>${file.size}</span> • <span>${file.date}</span>
                    </div>
                    <div class="doc-card__status">
                        <span class="badge badge--success">✓ Ready to Chat</span>
                    </div>
                </div>
                <div class="doc-card__actions">
                    <button class="btn-action" title="Buka di Chat"><span class="material-icons-round">chat_bubble_outline</span></button>
                    <button class="btn-action btn-action--danger" title="Hapus"><span class="material-icons-round">delete_outline</span></button>
                </div>
            </article>
        `).join('');
    }

    // ═══════════════ MODAL LOGIC ═══════════════

    function initModal() {
        // Populate Colors
        nfColorGrid.innerHTML = COLORS.map(c => `
            <div class="nf-color-swatch ${c === selectedColor ? 'selected' : ''}" 
                 style="background-color: ${c}" data-color="${c}"></div>
        `).join('');

        // Populate Icons
        nfIconGrid.innerHTML = ICONS.map(i => {
            const isEmoji = /^\p{Emoji}/u.test(i);
            return `
                <button class="nf-icon-btn ${i === selectedIcon ? 'selected' : ''} ${i === '' ? 'nf-icon-none' : ''}" data-icon="${i}">
                    <span class="${isEmoji ? '' : 'material-icons-round'}">${i || 'block'}</span>
                </button>
            `;
        }).join('');

        updatePreview();
    }

    function updatePreview() {
        nfFolderShape.style.color = selectedColor;
        
        const isEmoji = /^\p{Emoji}/u.test(selectedIcon);
        nfOverlayIcon.className = isEmoji ? 'nf-folder-overlay-icon' : 'nf-folder-overlay-icon material-icons-round';
        nfOverlayIcon.textContent = selectedIcon;
        
        nfPreviewIcon.style.setProperty('--nf-color', selectedColor + '40');
    }

    function openModal() {
        nfNameInput.value = '';
        selectedColor = COLORS[0];
        selectedIcon = '';
        initModal();
        nfOverlay.classList.remove('hidden');
        setTimeout(() => nfNameInput.focus(), 100);
    }

    function closeModal() {
        nfOverlay.classList.add('hidden');
    }

    // Tab Switching
    nfTabColor.addEventListener('click', () => {
        nfTabColor.classList.add('active');
        nfTabIcon.classList.remove('active');
        nfPanelColor.style.display = 'block';
        nfPanelIcon.style.display = 'none';
    });

    nfTabIcon.addEventListener('click', () => {
        nfTabIcon.classList.add('active');
        nfTabColor.classList.remove('active');
        nfPanelIcon.style.display = 'grid';
        nfPanelColor.style.display = 'none';
    });

    // Color Selection
    nfColorGrid.addEventListener('click', (e) => {
        const swatch = e.target.closest('.nf-color-swatch');
        if (!swatch) return;
        selectedColor = swatch.dataset.color;
        document.querySelectorAll('.nf-color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        updatePreview();
    });

    // Icon Selection
    nfIconGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.nf-icon-btn');
        if (!btn) return;
        selectedIcon = btn.dataset.icon;
        document.querySelectorAll('.nf-icon-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updatePreview();
    });

    nfCancelBtn.addEventListener('click', closeModal);
    nfOverlay.addEventListener('click', (e) => { if (e.target === nfOverlay) closeModal(); });

    nfConfirmBtn.addEventListener('click', () => {
        const name = nfNameInput.value.trim() || 'Tanpa Judul';
        const newFolder = {
            id: nextFolderId++,
            name: name,
            icon: selectedIcon,
            color: selectedColor,
            fileCount: 0,
            updated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
        folders.push(newFolder);
        files[newFolder.id] = [];
        renderFolders();
        closeModal();
    });

    // ═══════════════ UPLOAD MODAL LOGIC ═══════════════

    function openUploadModal() {
        filesToUpload = [];
        upFileList.innerHTML = '';
        upFileList.style.display = 'none';
        upDropzone.style.display = 'block';
        upConfirm.disabled = true;
        upOverlay.classList.remove('hidden');
    }

    function closeUploadModal() {
        upOverlay.classList.add('hidden');
    }

    function handleFiles(files) {
        const newFiles = Array.from(files).filter(f => {
            const ext = f.name.split('.').pop().toLowerCase();
            return ['pdf', 'docx', 'pptx'].includes(ext);
        });

        if (newFiles.length === 0) return;

        filesToUpload = [...filesToUpload, ...newFiles];
        renderUploadList();
        upFileList.style.display = 'flex';
        upConfirm.disabled = false;
    }

    function renderUploadList() {
        upFileList.innerHTML = filesToUpload.map((file, idx) => `
            <div class="up-file-item" data-idx="${idx}">
                <div class="up-file-icon">
                    <span class="material-icons-round">insert_drive_file</span>
                </div>
                <div class="up-file-info">
                    <div class="up-file-name">${file.name}</div>
                    <div class="up-progress-bar">
                        <div class="up-progress-fill" id="up-progress-${idx}"></div>
                    </div>
                </div>
                <button class="up-file-remove" data-idx="${idx}">
                    <span class="material-icons-round">close</span>
                </button>
            </div>
        `).join('');
    }

    // Drag & Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        upDropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    upDropzone.addEventListener('dragenter', () => upDropzone.classList.add('active'));
    upDropzone.addEventListener('dragover', () => upDropzone.classList.add('active'));
    upDropzone.addEventListener('dragleave', () => upDropzone.classList.remove('active'));
    upDropzone.addEventListener('drop', (e) => {
        upDropzone.classList.remove('active');
        handleFiles(e.dataTransfer.files);
    });

    upDropzone.addEventListener('click', () => upFileInput.click());
    upFileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    upFileList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.up-file-remove');
        if (!removeBtn) return;
        const idx = parseInt(removeBtn.dataset.idx);
        filesToUpload.splice(idx, 1);
        renderUploadList();
        if (filesToUpload.length === 0) {
            upFileList.style.display = 'none';
            upConfirm.disabled = true;
        }
    });

    upConfirm.addEventListener('click', () => {
        upConfirm.disabled = true;
        upCancel.disabled = true;

        // Simulate upload for each file
        let completed = 0;
        filesToUpload.forEach((file, idx) => {
            const fill = document.getElementById(`up-progress-${idx}`);
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    completed++;
                    
                    // Add to data
                    const ext = file.name.split('.').pop().toLowerCase();
                    const newFile = {
                        name: file.name,
                        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                        type: ext,
                        status: 'ready'
                    };
                    
                    if (!files[currentFolderId]) files[currentFolderId] = [];
                    files[currentFolderId].push(newFile);

                    if (completed === filesToUpload.length) {
                        // Update folder count
                        const folder = folders.find(f => f.id === currentFolderId);
                        if (folder) folder.fileCount = files[currentFolderId].length;
                        
                        setTimeout(() => {
                            closeUploadModal();
                            navigateToFolder(currentFolderId); // Refresh view
                            upCancel.disabled = false;
                        }, 500);
                    }
                }
                fill.style.width = progress + '%';
            }, 200);
        });
    });

    upClose.addEventListener('click', closeUploadModal);
    upCancel.addEventListener('click', closeUploadModal);
    upOverlay.addEventListener('click', (e) => { if (e.target === upOverlay) closeUploadModal(); });

    // ═══════════════ NAVIGATION ═══════════════

    function navigateToRoot() {
        currentFolderId = null;
        searchInput.value = '';

        pageTitle.textContent = 'Dokumen Saya';
        pageSubtitle.textContent = 'Kelola mata kuliah dan materi belajarmu.';
        actionBtnIcon.textContent = 'create_new_folder';
        actionBtnLabel.textContent = 'Buat Folder Baru';
        searchInput.placeholder = 'Cari folder...';
        breadcrumbSep.style.display = 'none';
        breadcrumbCurrent.textContent = '';
        filterSelect.style.display = 'none';

        folderContainer.style.display = '';
        documentContainer.style.display = 'none';
        emptyState.style.display = 'none';

        renderFolders();
    }

    function navigateToFolder(folderId) {
        currentFolderId = folderId;
        searchInput.value = '';
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        pageTitle.textContent = folder.name;
        pageSubtitle.textContent = `${folder.fileCount} file dalam folder ini`;
        actionBtnIcon.textContent = 'upload_file';
        actionBtnLabel.textContent = 'Unggah Dokumen';
        searchInput.placeholder = 'Cari file...';
        breadcrumbSep.style.display = '';
        breadcrumbCurrent.textContent = folder.name;
        filterSelect.style.display = '';

        folderContainer.style.display = 'none';
        documentContainer.style.display = '';
        emptyState.style.display = 'none';

        renderFiles(folderId);
    }

    // ═══════════════ EVENT LISTENERS ═══════════════

    folderContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.folder-card');
        if (!card) return;
        const folderId = parseInt(card.dataset.folderId);
        navigateToFolder(folderId);
    });

    folderContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('.folder-card');
            if (!card) return;
            e.preventDefault();
            const folderId = parseInt(card.dataset.folderId);
            navigateToFolder(folderId);
        }
    });

    breadcrumbRoot.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToRoot();
    });

    actionBtn.addEventListener('click', () => {
        if (currentFolderId === null) {
            openModal();
        } else {
            openUploadModal();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (currentFolderId === null) {
            renderFolders(query);
        } else {
            renderFiles(currentFolderId, query);
        }
    });

    filterSelect.addEventListener('change', () => {
        if (currentFolderId !== null) {
            renderFiles(currentFolderId, searchInput.value);
        }
    });

    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        folderContainer.classList.remove('list-view');
        documentContainer.classList.remove('list-view');
    });

    listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        folderContainer.classList.add('list-view');
        documentContainer.classList.add('list-view');
    });

    documentContainer.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-action--danger');
        if (!deleteBtn) return;
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            const card = deleteBtn.closest('.doc-card');
            const fileName = card.querySelector('.doc-card__title').textContent;
            const folderFiles = files[currentFolderId];
            const idx = folderFiles.findIndex(f => f.name === fileName);
            if (idx !== -1) {
                folderFiles.splice(idx, 1);
                const folder = folders.find(f => f.id === currentFolderId);
                if (folder) folder.fileCount = folderFiles.length;
                pageSubtitle.textContent = `${folderFiles.length} file dalam folder ini`;
            }
            card.remove();
            if (folderFiles.length === 0) {
                documentContainer.style.display = 'none';
                emptyState.style.display = 'flex';
                emptyState.querySelector('.empty-state__title').textContent = 'Belum ada file';
                emptyState.querySelector('.empty-state__desc').textContent = 'Unggah dokumen pertamamu ke folder ini.';
            }
        }
    });

    // ═══════════════ INITIAL RENDER ═══════════════
    navigateToRoot();
});