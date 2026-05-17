/* ── Data ─────────────────────────────────────────────────── */
let sources = [];


let messages = [];
let isTyping = false;
let ctxTargetId = null;

const suggestedPrompts = [
  'Apa temuan utama dari laporan ini?',
  'Ringkaskan poin-poin kritis dalam sumber',
  'Buat daftar tindakan berdasarkan isi dokumen',
  'Bandingkan data dari berbagai sumber',
  'Jelaskan istilah teknis yang ada dalam sumber',
];

const aiReplies = [
  `Berdasarkan sumber yang Anda berikan, berikut adalah **temuan utama**:\n\n• Pertumbuhan pendapatan sebesar **23%** dibandingkan tahun sebelumnya <span class="citation">1</span>\n• Ekspansi ke 3 pasar baru di Asia Tenggara <span class="citation">2</span>\n• Efisiensi biaya operasional meningkat **15%** melalui otomatisasi proses <span class="citation">1</span>\n\nSumber-sumber ini secara konsisten menunjukkan tren positif dalam kinerja bisnis.`,
  `Saya telah menganalisis sumber aktif Anda. **Poin-poin kritis** yang ditemukan:\n\n1. **Strategi pertumbuhan** difokuskan pada segmen B2B enterprise\n2. **Risiko utama** mencakup fluktuasi mata uang dan regulasi baru <span class="citation">2</span>\n3. **Peluang** terbesar ada di digitalisasi layanan pelanggan\n\nApakah Anda ingin saya elaborasi lebih lanjut tentang salah satu poin ini?`,
  `Berdasarkan dokumen yang tersedia, berikut adalah **rekomendasi tindakan** yang dapat diambil:\n\n• Prioritaskan investasi di infrastruktur digital Q3 2026\n• Rekrut 50 tenaga ahli untuk divisi teknologi <span class="citation">3</span>\n• Review ulang kontrak vendor utama sebelum akhir semester\n• Implementasikan dashboard real-time untuk monitoring KPI`,
];

/* ── Theme ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    /* ── Sidebar / Studio toggle ──────────────────────────────── */
    const sidebar = document.getElementById('sidebar');
    const btnSidebar = document.getElementById('btn-toggle-sidebar');

    function toggleSidebar() {
      sidebar.classList.toggle('collapsed');
      btnSidebar.classList.toggle('active');
    }
    if (btnSidebar) btnSidebar.addEventListener('click', toggleSidebar);

    /* ── Render ───────────────────────────────────────────────── */
    renderSources();
    renderPrompts();



    /* ── Render ───────────────────────────────────────────────── */
    renderSources();
    renderPrompts();

    /* ── Chat Logic ───────────────────────────────────────────── */
    const chatInput = document.getElementById('chat-input');
    const actionBtn = document.getElementById('chat-action-btn');

    if (chatInput && actionBtn) {
        chatInput.addEventListener('input', () => {
          const len = chatInput.value.length;
          const icon = actionBtn.querySelector('.material-icons-round');
          
          if (len > 0) {
            actionBtn.classList.add('active');
            if (icon) icon.textContent = 'send';
          } else {
            actionBtn.classList.remove('active');
            if (icon) icon.textContent = 'mic';
          }

          chatInput.style.height = 'auto';
          chatInput.style.height = Math.min(chatInput.scrollHeight, 200) + 'px';
        });

        actionBtn.addEventListener('click', () => {
          if (actionBtn.classList.contains('active')) {
            doSend();
          } else {
            // Voice input logic here if needed
            alert('Fitur Voice Input akan segera hadir!');
          }
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (actionBtn && actionBtn.classList.contains('active')) doSend();
          }
        });
    }

    /* ── Notebook title editable ──────────────────────────────── */
    const titleEl = document.getElementById('notebook-title');
    if (titleEl) {
        titleEl.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); titleEl.blur(); }
        });
        titleEl.addEventListener('blur', () => {
          document.title = (titleEl.textContent.trim() || 'Notebook') + ' — ADAPTIV';
        });
    }


    /* ── Modal & Upload Initialization ────────────────────────── */
    setupModals();
    setupUploadZone();


    /* ── History Restoration ──────────────────────────────────── */
    checkHistorySession();

    window.handleExternalSourceToggle = function(checkbox) {
        const isActive = checkbox.checked;
        if (isActive) {
            console.log('External Source Activated');
        } else {
            console.log('External Source Deactivated');
        }
    };

    /* ── Model Selector ────────────────────────────────────────── */
    setupModelSelector();

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        const modelDropdown = document.getElementById('model-dropdown');
        const btnModelSelector = document.getElementById('btn-model-selector');
        
        if (modelDropdown && !modelDropdown.classList.contains('hidden')) {
            if (!modelDropdown.contains(e.target) && !btnModelSelector.contains(e.target)) {
                modelDropdown.classList.add('hidden');
            }
        }

        const modalDropdown = document.getElementById('modal-search-dropdown');
        const btnModalSelector = document.getElementById('btn-modal-search-selector');
        if (modalDropdown && !modalDropdown.classList.contains('hidden')) {
            if (!modalDropdown.contains(e.target) && !btnModalSelector.contains(e.target)) {
                modalDropdown.classList.add('hidden');
            }
        }

        const ctxMenu = document.getElementById('ctx-menu');
        if (ctxMenu && ctxMenu.classList.contains('show')) {
            if (!ctxMenu.contains(e.target)) {
                ctxMenu.classList.remove('show');
            }
        }
    });
});

const sessionHistory = {
  'kalkulus': {
    title: 'Kalkulus',
    sources: [
      { id: 101, name: 'Limit_dan_Turunan.pdf', type: 'PDF', icon: '📄', checked: true },
      { id: 102, name: 'Integral_Tentu.pdf', type: 'PDF', icon: '📄', checked: true }
    ],
    messages: [
      { role: 'user', text: 'Jelaskan konsep dasar tentang limit fungsi.' },
      { role: 'ai', text: 'Berdasarkan sumber **Limit dan Turunan**, konsep dasar **limit** menjelaskan perilaku suatu fungsi mendekati nilai input tertentu.\n\n• **Limit Kiri & Kanan**: Fungsi $f(x)$ dikatakan memiliki limit $L$ di $c$ jika dan hanya jika limit dari kiri mendekati limit dari kanan <span class="citation">1</span>.\n• **Aplikasi**: Konsep ini mendasari definisi turunan dan kontinuitas fungsi.' }
    ]
  },
  'ppkn': {
    title: 'PPKn',
    sources: [
      { id: 201, name: 'Pancasila_dan_UUD1945.pdf', type: 'PDF', icon: '📄', checked: true },
      { id: 202, name: 'Hak_dan_Kewajiban_Warga_Negara.pdf', type: 'PDF', icon: '📄', checked: true }
    ],
    messages: [
      { role: 'user', text: 'Sebutkan hak dan kewajiban warga negara berdasarkan UUD 1945.' },
      { role: 'ai', text: 'Berdasarkan sumber **Pancasila dan UUD 1945**, berikut adalah poin-poin penting hak dan kewajiban warga negara:\n\n• **Hak**: Mendapatkan pekerjaan & penghidupan yang layak (Pasal 27 ayat 2), berserikat dan berkumpul (Pasal 28) <span class="citation">1</span>.\n• **Kewajiban**: Menjunjung tinggi hukum dan pemerintahan (Pasal 27 ayat 1), ikut serta dalam pembelaan negara (Pasal 27 ayat 3) <span class="citation">2</span>.' }
    ]
  },
  'algoritma': {
    title: 'Algoritma & Pemrograman',
    sources: [
      { id: 301, name: 'Sorting_Algorithm.pdf', type: 'PDF', icon: '📄', checked: true },
      { id: 302, name: 'Graph_Theory.pdf', type: 'PDF', icon: '📄', checked: true }
    ],
    messages: [
      { role: 'user', text: 'Jelaskan perbedaan mendasar antara Bubble Sort dan QuickSort.' },
      { role: 'ai', text: 'Berdasarkan sumber **Sorting Algorithm**, perbedaan utamanya terletak pada efisiensi:\n\n• **Bubble Sort** memiliki kompleksitas O(n²) dan bekerja dengan menukar elemen tetangga secara berulang.\n• **QuickSort** menggunakan pendekatan *divide and conquer* dengan kompleksitas rata-rata O(n log n), yang jauh lebih cepat untuk data besar <span class="citation">1</span>.' }
    ]
  }
};

function checkHistorySession() {
    const params = new URLSearchParams(window.location.search);
    const sessionKey = params.get('session');
    
    if (sessionKey && sessionHistory[sessionKey]) {
        const history = sessionHistory[sessionKey];
        
        // Update Title
        const titleEl = document.getElementById('notebook-title');
        if (titleEl) titleEl.textContent = history.title;
        
        // Update Sources
        sources = history.sources;
        renderSources();
        
        // Update Messages
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'none';
        
        history.messages.forEach(msg => {
            if (msg.role === 'user') {
                appendUserMsg(msg.text);
            } else {
                appendAiMsg(msg.text);
            }
        });
        
        // Scroll to bottom
        scrollBottom();
    }
}

/* ── Modal Functions ──────────────────────────────────────── */
function setupModals() {
    const triggers = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            const overlay = document.getElementById(`${targetId}-overlay`);
            if (overlay) openModal(overlay);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-modal-close');
            const overlay = document.getElementById(`${targetId}-overlay`);
            if (overlay) closeModal(overlay);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openOverlay = document.querySelector('.modal-overlay:not([hidden])');
            if (openOverlay) closeModal(openOverlay);
        }
    });
}

function openModal(overlay) {
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
    overlay.setAttribute('hidden', 'true');
    document.body.style.overflow = '';
}

/* ── Upload Zone Functions ────────────────────────────────── */
function setupUploadZone() {
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('file-input');

    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, e => { e.preventDefault(); e.stopPropagation(); });
    });

    ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, () => dropzone.style.borderColor = 'var(--accent-primary)');
    });

    ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, () => dropzone.style.borderColor = '');
    });

    dropzone.addEventListener('drop', e => {
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', e => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];
    const dropzone = document.getElementById('upload-dropzone');
    const title = dropzone.querySelector('.dropzone__title--premium');
    
    if (title) title.innerHTML = `Memproses: <span style="color:var(--accent-primary)">${file.name}</span>`;
    
    simulateUploadProcess(dropzone, file.name);
}

function simulateUploadProcess(dropzone, fileName) {
    setTimeout(() => {
        // Tambahkan ke list sources secara simulasi
        sources.push({
            id: Date.now(),
            name: fileName,
            type: fileName.split('.').pop().toUpperCase(),
            icon: '📄',
            checked: true
        });
        
        renderSources();
        closeModal(document.getElementById('upload-modal-overlay'));
        
        // Reset
        setTimeout(() => {
            const title = dropzone.querySelector('.dropzone__title--premium');
            if (title) title.textContent = 'atau seret file Anda';
        }, 500);
    }, 2000);
}

/* ── Chat Functions ───────────────────────────────────────── */
function doSend() {
    const chatInput = document.getElementById('chat-input');
    const emptyState = document.getElementById('empty-state');
    const actionBtn = document.getElementById('chat-action-btn');
    const icon = actionBtn?.querySelector('.material-icons-round');

    const text = chatInput.value.trim();
    if (!text || isTyping) return;

    if (emptyState) emptyState.style.display = 'none';

    appendUserMsg(text);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    if (actionBtn) {
        actionBtn.classList.remove('active');
        if (icon) icon.textContent = 'mic';
    }

    showTyping();

    setTimeout(() => {
      removeTyping();
      const reply = aiReplies[messages.length % aiReplies.length];
      appendAiMsg(reply);
    }, 1200 + Math.random() * 800);
}

function sendMessage(text) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.value = text;
        chatInput.dispatchEvent(new Event('input'));
        doSend();
    }
}

function appendUserMsg(text) {
    const chatInner = document.getElementById('chat-inner');
    messages.push({ role: 'user', text });
    const group = document.createElement('div');
    group.className = 'msg-group';
    group.innerHTML = `
    <div class="msg-user">
      <div class="bubble">${escHtml(text)}</div>
    </div>
    <div class="msg-actions" style="justify-content:flex-end">
      <button class="msg-action-btn" onclick="copyText(this)" data-text="${escHtml(text)}">
        <span class="material-icons-round">content_copy</span>
      </button>
    </div>
  `;
    if (chatInner) chatInner.appendChild(group);
    scrollBottom();
}

function appendAiMsg(html) {
    const chatInner = document.getElementById('chat-inner');
    messages.push({ role: 'ai', text: html });
    const group = document.createElement('div');
    group.className = 'msg-group';
    group.innerHTML = `
    <div class="msg-ai">
      <div class="ai-avatar">
        <img src="../../assets/images/profile_logo_dark.png" alt="AI Avatar" class="ai-avatar-img theme-dark-avatar">
        <img src="../../assets/images/profile_logo_light.png" alt="AI Avatar" class="ai-avatar-img theme-light-avatar">
      </div>
      <div class="bubble">
        ${formatMsgHtml(html)}
      </div>
    </div>
    <div class="msg-actions" style="margin-left:44px">
      <button class="msg-action-btn" onclick="copyText(this)" data-text="${escHtml(html)}">
        <span class="material-icons-round">content_copy</span>
      </button>
      <button class="msg-action-btn">
        <span class="material-icons-round">thumb_up</span>
      </button>
      <button class="msg-action-btn">
        <span class="material-icons-round">thumb_down</span>
      </button>
      <button class="msg-action-btn">
        <span class="material-icons-round">refresh</span>
      </button>
    </div>
  `;
    if (chatInner) chatInner.appendChild(group);
    scrollBottom();
}

function formatMsgHtml(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n• /g, '</p><ul><li>').replace(/\n/g, '<br>')
      .replace(/^/, '<p>').replace(/$/, '</p>');
}

let typingEl = null;
function showTyping() {
    const chatInner = document.getElementById('chat-inner');
    isTyping = true;
    typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
    <div class="ai-avatar">
      <img src="../../assets/images/profile_logo_dark.png" alt="AI Avatar" class="ai-avatar-img theme-dark-avatar">
      <img src="../../assets/images/profile_logo_light.png" alt="AI Avatar" class="ai-avatar-img theme-light-avatar">
    </div>
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
    if (chatInner) chatInner.appendChild(typingEl);
    scrollBottom();
}

function removeTyping() {
    isTyping = false;
    if (typingEl) { typingEl.remove(); typingEl = null; }
}

function scrollBottom() {
    const area = document.getElementById('chat-area');
    if (area) setTimeout(() => area.scrollTop = area.scrollHeight, 50);
}

/* ── Source Management ────────────────────────────────────── */
function renderSources() {
    const list = document.getElementById('sources-list');
    if (!list) return;

    if (sources.length === 0) {
        list.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 16px; text-align: center; color: var(--text-muted); opacity: 0.85;">
                <span class="material-icons-round" style="font-size: 40px; margin-bottom: 12px; color: var(--text-disabled);">description</span>
                <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">Belum ada sumber</div>
                <div style="font-size: 11px; margin-top: 4px; line-height: 1.4; color: var(--text-muted);">Tambahkan dokumen atau seret file Anda untuk memulai belajar</div>
            </div>
        `;
        return;
    }

    list.innerHTML = sources.map(s => `
  <div class="source-item ${s.checked ? 'checked' : ''}" data-id="${s.id}" onclick="toggleSource(${s.id})">
    <div class="source-check">
      ${s.checked ? `<svg viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
    </div>
    <div class="source-icon">${s.icon}</div>
    <div class="source-meta">
      <div class="source-name">${s.name}</div>
      <div class="source-type">${s.type}</div>
    </div>
    <button class="source-more" onclick="openCtxMenu(event, ${s.id})" title="Opsi lainnya">
      <span class="material-icons-round" style="font-size:18px">more_vert</span>
    </button>
  </div>
`).join('');
}

function toggleSource(id) {
    const s = sources.find(x => x.id === id);
    if (s) s.checked = !s.checked;
    renderSources();
}


/* ── Suggested Prompts ────────────────────────────────────── */
function renderPrompts() {
    const wrap = document.getElementById('suggested-prompts');
    if (!wrap) return;
    wrap.innerHTML = suggestedPrompts.map(p => `
  <button class="prompt-chip" onclick="sendMessage('${p}')">${p}</button>
`).join('');
}

/* ── Helpers ──────────────────────────────────────────────── */
function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function copyText(btn) {
    navigator.clipboard?.writeText(btn.dataset.text || '');
    const icon = btn.querySelector('.material-icons-round');
    if (icon) {
        icon.textContent = 'check';
        setTimeout(() => icon.textContent = 'content_copy', 1500);
    }
}

function openCtxMenu(e, id) {
    e.stopPropagation();
    ctxTargetId = id;
    const ctxMenu = document.getElementById('ctx-menu');
    if (ctxMenu) {
        ctxMenu.style.left = e.clientX + 'px';
        ctxMenu.style.top = e.clientY + 'px';
        ctxMenu.classList.add('show');
    }
}

function ctxAction(action) {
    const s = sources.find(x => x.id === ctxTargetId);
    if (!s) return;
    if (action === 'rename') {
      const n = prompt('Nama baru:', s.name);
      if (n) { s.name = n; renderSources(); }
    } else if (action === 'delete') {
      if (confirm(`Hapus "${s.name}"?`)) {
        sources = sources.filter(x => x.id !== ctxTargetId);
        renderSources();
      }
    } else if (action === 'view') {
      alert(`Membuka: ${s.name}`);
    }
    const ctxMenu = document.getElementById('ctx-menu');
    if (ctxMenu) ctxMenu.classList.remove('show');
}

/* ── Studio ───────────────────────────────────────────────── */
function generateStudioContent(type) {
    sendMessage(`Buat ${type} dari sumber yang saya miliki`);
}

function handleToolAction(type, menuId) {
    const menu = document.getElementById(menuId);
    if (menu) menu.classList.remove('show');

    if (type === 'external') {
        alert('Membuka sumber eksternal...');
    } else if (type === 'internal') {
        const uploadModal = document.getElementById('upload-modal-overlay');
        if (uploadModal) openModal(uploadModal);
    }
}

// Spin animation for loading
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);

function setupModelSelector() {
    // 1. Main Chat Model Selector
    const mainBtn = document.getElementById('btn-model-selector');
    const mainDropdown = document.getElementById('model-dropdown');
    const mainText = document.getElementById('current-model-text');

    if (mainBtn && mainDropdown) {
        mainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainDropdown.classList.toggle('hidden');
            // Close the modal dropdown if open
            const modalDropdown = document.getElementById('modal-search-dropdown');
            if (modalDropdown) modalDropdown.classList.add('hidden');
        });

        const mainOptions = mainDropdown.querySelectorAll('.model-option');
        mainOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const model = option.getAttribute('data-model');
                mainOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                if (mainText) mainText.textContent = model;
                mainDropdown.classList.add('hidden');
                console.log(`Main model switched to: ${model}`);
            });
        });
    }

    // 2. Modal Search Model Selector
    const modalBtn = document.getElementById('btn-modal-search-selector');
    const modalDropdown = document.getElementById('modal-search-dropdown');
    const modalText = document.getElementById('modal-search-model-text');

    if (modalBtn && modalDropdown) {
        modalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modalDropdown.classList.toggle('hidden');
            // Close the main dropdown if open
            const mainDropdownEl = document.getElementById('model-dropdown');
            if (mainDropdownEl) mainDropdownEl.classList.add('hidden');
        });

        const modalOptions = modalDropdown.querySelectorAll('.model-option');
        modalOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const model = option.getAttribute('data-model');
                modalOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                if (modalText) modalText.textContent = model;
                modalDropdown.classList.add('hidden');
                console.log(`Modal search model switched to: ${model}`);
            });
        });
    }
}
