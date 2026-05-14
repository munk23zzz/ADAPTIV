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

    // ═══════════════ STATE ═══════════════
    let currentFolderId = null; // null = root level (folders), number = inside folder
    let nextFolderId = folders.length + 1;

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

        folderContainer.innerHTML = filtered.map(folder => `
            <article class="folder-card" data-folder-id="${folder.id}" tabindex="0" role="button" aria-label="Buka folder ${folder.name}">
                <div class="folder-card__icon-area" style="background: linear-gradient(135deg, ${folder.color}15, transparent);">
                    <span style="filter: drop-shadow(0 2px 8px ${folder.color}40);">${folder.icon}</span>
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
        `).join('');
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

    // ═══════════════ NAVIGATION ═══════════════

    function navigateToRoot() {
        currentFolderId = null;
        searchInput.value = '';

        // UI updates
        pageTitle.textContent = 'Dokumen Saya';
        pageSubtitle.textContent = 'Kelola mata kuliah dan materi belajarmu.';
        actionBtnIcon.textContent = 'create_new_folder';
        actionBtnLabel.textContent = 'Buat Folder Baru';
        searchInput.placeholder = 'Cari folder...';
        breadcrumbSep.style.display = 'none';
        breadcrumbCurrent.textContent = '';
        filterSelect.style.display = 'none';

        // Show folders, hide documents
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

        // UI updates
        pageTitle.textContent = folder.name;
        pageSubtitle.textContent = `${folder.fileCount} file dalam folder ini`;
        actionBtnIcon.textContent = 'upload_file';
        actionBtnLabel.textContent = 'Unggah Dokumen';
        searchInput.placeholder = 'Cari file...';
        breadcrumbSep.style.display = '';
        breadcrumbCurrent.textContent = folder.name;
        filterSelect.style.display = '';

        // Show documents, hide folders
        folderContainer.style.display = 'none';
        documentContainer.style.display = '';
        emptyState.style.display = 'none';

        renderFiles(folderId);
    }

    // ═══════════════ EVENT LISTENERS ═══════════════

    // Click on folder card
    folderContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.folder-card');
        if (!card) return;
        const folderId = parseInt(card.dataset.folderId);
        navigateToFolder(folderId);
    });

    // Keyboard support for folder cards
    folderContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('.folder-card');
            if (!card) return;
            e.preventDefault();
            const folderId = parseInt(card.dataset.folderId);
            navigateToFolder(folderId);
        }
    });

    // Breadcrumb root click
    breadcrumbRoot.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToRoot();
    });

    // Action button (create folder or upload)
    actionBtn.addEventListener('click', () => {
        if (currentFolderId === null) {
            // Create new folder
            const name = prompt('Masukkan nama folder baru:');
            if (name && name.trim()) {
                const icons = ['📁', '📂', '📚', '📖', '🎓', '✏️', '🔬', '🧮', '🌍', '🎨'];
                const colors = ['#7C5CFC', '#F59E0B', '#10B981', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6', '#14B8A6'];
                const newFolder = {
                    id: nextFolderId++,
                    name: name.trim(),
                    icon: icons[Math.floor(Math.random() * icons.length)],
                    color: colors[Math.floor(Math.random() * colors.length)],
                    fileCount: 0,
                    updated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                };
                folders.push(newFolder);
                files[newFolder.id] = [];
                renderFolders();
            }
        } else {
            // Simulate upload (just an alert for now)
            alert('Fitur upload dokumen akan segera tersedia.');
        }
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (currentFolderId === null) {
            renderFolders(query);
        } else {
            renderFiles(currentFolderId, query);
        }
    });

    // Filter by type (inside folder only)
    filterSelect.addEventListener('change', () => {
        if (currentFolderId !== null) {
            renderFiles(currentFolderId, searchInput.value);
        }
    });

    // Grid/List toggle
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

    // Delete file handler
    documentContainer.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-action--danger');
        if (!deleteBtn) return;
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            const card = deleteBtn.closest('.doc-card');
            const fileName = card.querySelector('.doc-card__title').textContent;
            // Remove from data
            const folderFiles = files[currentFolderId];
            const idx = folderFiles.findIndex(f => f.name === fileName);
            if (idx !== -1) {
                folderFiles.splice(idx, 1);
                // Update folder count
                const folder = folders.find(f => f.id === currentFolderId);
                if (folder) folder.fileCount = folderFiles.length;
                pageSubtitle.textContent = `${folderFiles.length} file dalam folder ini`;
            }
            card.remove();
            // Check if empty
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