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
      
      const isQuiz = text.toLowerCase().includes('kuis') || text.toLowerCase().includes('quiz');
      const params = new URLSearchParams(window.location.search);
      const sessionKey = params.get('session');
      
      if (isQuiz && sessionKey === 'kalkulus') {
          appendAiMsg("Tentu! Saya telah menyiapkan kuis interaktif **Kuis Kalkulus** yang memuat 8 soal menantang seputar materi Limit dan Turunan di panel kanan Anda. Selamat mengerjakan! 📐✨");
          startCalculusQuiz();
      } else if (isQuiz && sessionKey === 'ppkn') {
          appendAiMsg("Tentu! Saya telah menyiapkan kuis interaktif **Kuis PPKn** seputar materi Pancasila dan UUD 1945 di panel kanan Anda. Selamat mengerjakan! 🏛️✨");
          startPpknQuiz();
      } else if (isQuiz && sessionKey === 'algoritma') {
          appendAiMsg("Tentu! Saya telah menyiapkan kuis interaktif **Kuis Algoritma & Pemrograman** seputar algoritma sorting dan searching di panel kanan Anda. Selamat mengerjakan! 💻✨");
          startAlgoritmaQuiz();
      } else {
          const reply = aiReplies[messages.length % aiReplies.length];
          appendAiMsg(reply);
      }
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
    if (type === 'Kuis') {
        const params = new URLSearchParams(window.location.search);
        const sessionKey = params.get('session');
        if (sessionKey === 'kalkulus') {
            startCalculusQuiz();
            return;
        } else if (sessionKey === 'ppkn') {
            startPpknQuiz();
            return;
        } else if (sessionKey === 'algoritma') {
            startAlgoritmaQuiz();
            return;
        }
    }
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

/* ── Interactive Quiz Studio Engine ───────────────────────── */
const defaultStudioToolbarHtml = `
        <div class="studio-collapsed-toolbar">
          <button class="studio-collapsed-btn bg-audio" title="Ringkasan Audio"
            onclick="generateStudioContent('Ringkasan Audio')">
            <span class="material-icons-round mat-icon">graphic_eq</span>
            <span class="collapsed-label">Audio</span>
          </button>

          <button class="studio-collapsed-btn bg-mindmap" title="Studio Podcast"
            onclick="generateStudioContent('Studio Podcast')">
            <span class="material-icons-round mat-icon">tune</span>
            <span class="collapsed-label">Podcast</span>
          </button>

          <button class="studio-collapsed-btn bg-slide" title="Slide Presentasi"
            onclick="generateStudioContent('Slide Presentasi')">
            <span class="material-icons-round mat-icon">branding_watermark</span>
            <span class="collapsed-label">Slide Presentasi</span>
          </button>

          <button class="studio-collapsed-btn bg-video" title="Ringkasan Video"
            onclick="generateStudioContent('Ringkasan Video')">
            <span class="material-icons-round mat-icon">smart_display</span>
            <span class="collapsed-label">Ringkasan Video</span>
          </button>

          <button class="studio-collapsed-btn bg-mindmap" title="Peta Pikiran"
            onclick="generateStudioContent('Peta Pikiran')">
            <span class="material-icons-round mat-icon">account_tree</span>
            <span class="collapsed-label">Peta Pikiran</span>
          </button>

          <button class="studio-collapsed-btn bg-flashcards" title="Kartu Belajar"
            onclick="generateStudioContent('Kartu Belajar')">
            <span class="material-icons-round mat-icon">style</span>
            <span class="collapsed-label">Kartu Belajar</span>
          </button>

          <button class="studio-collapsed-btn bg-quiz" title="Kuis" onclick="generateStudioContent('Kuis')">
            <span class="material-icons-round mat-icon">quiz</span>
            <span class="collapsed-label">Kuis</span>
          </button>

          <button class="studio-collapsed-btn bg-infographic" title="Infografis"
            onclick="generateStudioContent('Infografis')">
            <span class="material-icons-round mat-icon">insert_chart_outlined</span>
            <span class="collapsed-label">Infografis</span>
          </button>

          <button class="studio-collapsed-btn bg-datatable" title="Tabel Data"
            onclick="generateStudioContent('Tabel Data')">
            <span class="material-icons-round mat-icon">table_view</span>
            <span class="collapsed-label">Tabel Data</span>
          </button>
        </div>
`;

let activeQuiz = null;
let activeQuizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizResults = [];

function startCalculusQuiz() {
    activeQuiz = 'Kalkulus';
    activeQuizQuestions = [
        {
            question: "Berapakah nilai dari lim (x→2) (x² - 4) / (x - 2) ?",
            badge: "LIMIT",
            options: [
                { letter: 'A', text: '2', isCorrect: false, rationale: "Faktorisasi salah atau subtitusi nilai x yang salah." },
                { letter: 'B', text: '4', isCorrect: true, rationale: "Tepat sekali! Faktorkan pembilang: (x² - 4) = (x - 2)(x + 2). Setelah membagi dengan (x - 2), diperoleh lim (x→2) (x + 2) = 2 + 2 = 4. Jawaban yang tepat adalah B." },
                { letter: 'C', text: '0', isCorrect: false, rationale: "Hasil 0 diperoleh jika salah melakukan operasi pembagian." },
                { letter: 'D', text: 'Tidak ada (DNE)', isCorrect: false, rationale: "Limit ini ada karena bentuk tak tentu 0/0 dapat disederhanakan." }
            ]
        },
        {
            question: "Berapakah nilai dari lim (x→0) sin(x) / x ?",
            badge: "LIMIT TRIGONOMETRI",
            options: [
                { letter: 'A', text: '0', isCorrect: false, rationale: "Ini bukan limit nilai 0." },
                { letter: 'B', text: '1', isCorrect: true, rationale: "Benar! Ini adalah limit trigonometri dasar yang sangat terkenal di mana lim (x→0) sin(x)/x = 1." },
                { letter: 'C', text: 'Tidak terdefinisi', isCorrect: false, rationale: "Limit ini terdefinisi dengan baik menggunakan Teorema Apit." },
                { letter: 'D', text: 'π', isCorrect: false, rationale: "Tidak ada hubungan dengan nilai π secara langsung." }
            ]
        },
        {
            question: "Tentukan turunan pertama dari f(x) = 3x² + 5x - 2.",
            badge: "TURUNAN",
            options: [
                { letter: 'A', text: '6x + 5', isCorrect: true, rationale: "Tepat! Menggunakan aturan pangkat: d/dx(3x²) = 6x, d/dx(5x) = 5, dan d/dx(-2) = 0. Jadi f'(x) = 6x + 5." },
                { letter: 'B', text: '3x + 5', isCorrect: false, rationale: "Koefisien x² belum dikalikan dengan pangkatnya." },
                { letter: 'C', text: '6x² + 5', isCorrect: false, rationale: "Pangkat x pada turunan 3x² seharusnya berkurang 1 menjadi x¹." },
                { letter: 'D', text: '6x', isCorrect: false, rationale: "Anda melupakan turunan dari 5x." }
            ]
        },
        {
            question: "Berapakah nilai dari lim (x→∞) (2x² + 3) / (x² - 5x) ?",
            badge: "LIMIT TAK HINGGA",
            options: [
                { letter: 'A', text: '0', isCorrect: false, rationale: "Bukan 0 karena pangkat tertinggi di pembilang dan penyebut adalah sama." },
                { letter: 'B', text: '1', isCorrect: false, rationale: "Koefisien dari pangkat tertinggi di pembilang adalah 2." },
                { letter: 'C', text: '2', isCorrect: true, rationale: "Benar! Bagi pembilang dan penyebut dengan pangkat tertinggi x²: lim (x→∞) (2 + 3/x²) / (1 - 5/x) = 2/1 = 2." },
                { letter: 'D', text: '∞', isCorrect: false, rationale: "Limit bernilai terhingga karena pangkat tertinggi pembilang dan penyebut sama." }
            ]
        },
        {
            question: "Tentukan turunan dari f(x) = sin(x).",
            badge: "TURUNAN TRIGONOMETRI",
            options: [
                { letter: 'A', text: 'cos(x)', isCorrect: true, rationale: "Tepat! Turunan standar dari fungsi sinus adalah cosinus positif: f'(x) = cos(x)." },
                { letter: 'B', text: '-cos(x)', isCorrect: false, rationale: "Turunan sinus adalah positif cosinus, bukan negatif." },
                { letter: 'C', text: 'sin(x)', isCorrect: false, rationale: "Turunan sinus adalah fungsi cosinus." },
                { letter: 'D', text: '-sin(x)', isCorrect: false, rationale: "Ini adalah turunan dari cosinus, bukan sinus." }
            ]
        },
        {
            question: "Berapakah nilai dari lim (x→3) (x² - 9) / (x - 3) ?",
            badge: "LIMIT",
            options: [
                { letter: 'A', text: '3', isCorrect: false, rationale: "Anda lupa menjumlahkan nilai setelah penyederhanaan." },
                { letter: 'B', text: '6', isCorrect: true, rationale: "Benar! Faktorkan pembilang: (x² - 9) = (x - 3)(x + 3). Setelah disederhanakan diperoleh lim (x→3) (x + 3) = 3 + 3 = 6." },
                { letter: 'C', text: '0', isCorrect: false, rationale: "Hasil 0 adalah salah." },
                { letter: 'D', text: '9', isCorrect: false, rationale: "Operasi subtitusi yang kurang tepat." }
            ]
        },
        {
            question: "Jika f(x) = cos(x), berapakah turunan pertamanya f'(x) ?",
            badge: "TURUNAN TRIGONOMETRI",
            options: [
                { letter: 'A', text: 'sin(x)', isCorrect: false, rationale: "Turunan cosinus bernilai negatif sinus." },
                { letter: 'B', text: '-sin(x)', isCorrect: true, rationale: "Benar! Turunan standar dari fungsi cosinus adalah negatif sinus: f'(x) = -sin(x)." },
                { letter: 'C', text: 'cos(x)', isCorrect: false, rationale: "Fungsi cosinus berubah menjadi sinus setelah diturunkan." },
                { letter: 'D', text: '-cos(x)', isCorrect: false, rationale: "Salah, turunan cosinus adalah -sin(x)." }
            ]
        },
        {
            question: "Berapakah nilai dari lim (x→1) (x³ - 1) / (x - 1) ?",
            badge: "LIMIT ALJABAR",
            options: [
                { letter: 'A', text: '1', isCorrect: false, rationale: "Hasil subtitusi salah." },
                { letter: 'B', text: '2', isCorrect: false, rationale: "Faktorisasi selisih kubik kurang tepat." },
                { letter: 'C', text: '3', isCorrect: true, rationale: "Benar! Faktorkan pembilang: (x³ - 1) = (x - 1)(x² + x + 1). Diperoleh lim (x→1) (x² + x + 1) = 1 + 1 + 1 = 3." },
                { letter: 'D', text: '0', isCorrect: false, rationale: "Salah, ini adalah bentuk tak tentu yang dapat disederhanakan." }
            ]
        }
    ];
    initStudioQuiz();
}

function startPpknQuiz() {
    activeQuiz = 'PPKn';
    activeQuizQuestions = [
        {
            question: "Apa dasar negara Republik Indonesia?",
            badge: "PANCASILA",
            options: [
                { letter: 'A', text: 'UUD 1945', isCorrect: false, rationale: "UUD 1945 adalah konstitusi tertulis negara, bukan dasar negara." },
                { letter: 'B', text: 'Pancasila', isCorrect: true, rationale: "Tepat sekali! Pancasila adalah dasar negara sekaligus ideologi nasional Republik Indonesia." },
                { letter: 'C', text: 'Bhinneka Tunggal Ika', isCorrect: false, rationale: "Bhinneka Tunggal Ika adalah semboyan negara." },
                { letter: 'D', text: 'Proklamasi', isCorrect: false, rationale: "Proklamasi adalah peristiwa kemerdekaan." }
            ]
        },
        {
            question: "Pasal UUD 1945 manakah yang mengatur tentang hak atas pekerjaan dan penghidupan yang layak?",
            badge: "KONSTITUSI",
            options: [
                { letter: 'A', text: 'Pasal 27 ayat 1', isCorrect: false, rationale: "Pasal 27 ayat 1 mengatur tentang kedudukan yang sama di dalam hukum." },
                { letter: 'B', text: 'Pasal 27 ayat 2', isCorrect: true, rationale: "Benar! Pasal 27 ayat 2 menyatakan bahwa tiap-tiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan." },
                { letter: 'C', text: 'Pasal 28', isCorrect: false, rationale: "Pasal 28 mengatur tentang kemerdekaan berserikat dan berkumpul." },
                { letter: 'D', text: 'Pasal 30 ayat 1', isCorrect: false, rationale: "Pasal 30 ayat 1 mengatur tentang pertahanan dan keamanan negara." }
            ]
        },
        {
            question: "Kewajiban bela negara bagi setiap warga negara diatur dalam Pasal UUD 1945 nomor berapa?",
            badge: "BELA NEGARA",
            options: [
                { letter: 'A', text: 'Pasal 27 ayat 3', isCorrect: true, rationale: "Tepat! Pasal 27 ayat 3 berbunyi: Setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara." },
                { letter: 'B', text: 'Pasal 29 ayat 2', isCorrect: false, rationale: "Pasal 29 ayat 2 mengatur kemerdekaan memeluk agama." },
                { letter: 'C', text: 'Pasal 31 ayat 1', isCorrect: false, rationale: "Pasal 31 ayat 1 mengatur tentang hak mendapatkan pendidikan." },
                { letter: 'D', text: 'Pasal 33 ayat 1', isCorrect: false, rationale: "Pasal 33 ayat 1 mengatur tentang perekonomian nasional." }
            ]
        }
    ];
    initStudioQuiz();
}

function startAlgoritmaQuiz() {
    activeQuiz = 'Algoritma & Pemrograman';
    activeQuizQuestions = [
        {
            question: "Manakah algoritma sorting yang memiliki kompleksitas rata-rata O(n log n)?",
            badge: "SORTING ALGORITHM",
            options: [
                { letter: 'A', text: 'Bubble Sort', isCorrect: false, rationale: "Bubble Sort memiliki kompleksitas rata-rata O(n²)." },
                { letter: 'B', text: 'Selection Sort', isCorrect: false, rationale: "Selection Sort memiliki kompleksitas rata-rata O(n²)." },
                { letter: 'C', text: 'QuickSort', isCorrect: true, rationale: "Tepat! QuickSort menggunakan pembagian divide and conquer sehingga memiliki kompleksitas rata-rata O(n log n)." },
                { letter: 'D', text: 'Insertion Sort', isCorrect: false, rationale: "Insertion Sort memiliki kompleksitas rata-rata O(n²)." }
            ]
        },
        {
            question: "Manakah algoritma yang bekerja dengan menukar elemen tetangga yang berurutan secara berulang jika urutannya salah?",
            badge: "SORTING ALGORITHM",
            options: [
                { letter: 'A', text: 'QuickSort', isCorrect: false, rationale: "QuickSort bekerja dengan mempartisi data di sekitar pivot." },
                { letter: 'B', text: 'Bubble Sort', isCorrect: true, rationale: "Benar! Bubble Sort secara berulang membandingkan dan menukar elemen yang bertetangga jika urutannya tidak sesuai." },
                { letter: 'C', text: 'Merge Sort', isCorrect: false, rationale: "Merge Sort bekerja dengan membagi array menjadi dua lalu menggabungkannya." },
                { letter: 'D', text: 'Binary Search', isCorrect: false, rationale: "Binary Search adalah algoritma pencarian, bukan pengurutan." }
            ]
        },
        {
            question: "Algoritma pencarian yang memerlukan data terurut untuk dapat berfungsi dengan baik adalah?",
            badge: "SEARCHING ALGORITHM",
            options: [
                { letter: 'A', text: 'Linear Search', isCorrect: false, rationale: "Linear Search dapat digunakan pada data yang acak/tidak terurut." },
                { letter: 'B', text: 'Binary Search', isCorrect: true, rationale: "Tepat sekali! Binary Search membagi ruang pencarian menjadi setengah di setiap langkah, yang memerlukan data dalam kondisi terurut terlebih dahulu." },
                { letter: 'C', text: 'Depth First Search', isCorrect: false, rationale: "DFS digunakan untuk penelusuran graf/pohon." },
                { letter: 'D', text: 'Breadth First Search', isCorrect: false, rationale: "BFS digunakan untuk penelusuran graf/pohon." }
            ]
        }
    ];
    initStudioQuiz();
}

function initStudioQuiz() {
    quizIndex = 0;
    quizScore = 0;
    quizResults = new Array(activeQuizQuestions.length).fill(null);

    const studio = document.getElementById('studio');
    if (!studio) return;

    studio.classList.add('expanded');

    studio.innerHTML = `
        <div class="studio-expanded-workspace">
          <div class="quiz-container-split">
            <!-- Header -->
            <div class="quiz-split-header">
              <div class="quiz-split-header__left">
                <span class="material-icons-round quiz-split-icon">quiz</span>
                <span class="quiz-split-title">Kuis ${activeQuiz}</span>
              </div>
              <div class="quiz-split-header__right">
                <button class="icon-btn" onclick="closeStudioQuiz()" title="Tutup Kuis" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
            </div>
            
            <!-- Progress Segmented Row -->
            <div class="quiz-split-progress-row" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: var(--bg-surface-2); border-bottom: 1px solid var(--border); gap: 16px;">
              <div class="segmented-progress" id="quiz-progress-segments" style="display: flex; flex: 1; gap: 6px;">
                <!-- Segments dynamically generated -->
              </div>
              <div class="quiz-split-stats" style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                <span class="quiz-counter-text" id="quiz-counter-text" style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--text-secondary);">1 / 8</span>
              </div>
            </div>
            
            <!-- Body -->
            <div class="quiz-split-body" style="flex: 1; overflow-y: auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 24px;">
              <!-- Badge -->
              <div style="align-self: flex-start;" id="quiz-badge-container">
                <!-- Badge dynamically injected -->
              </div>
              
              <!-- Question -->
              <div class="quiz-split-question" style="display: flex; gap: 8px; font-family: var(--font-ui); font-size: 1.25rem; font-weight: 600; line-height: 1.5; color: var(--text-primary);">
                <span class="q-num" id="q-num-text" style="color: var(--accent-primary);">Q1.</span>
                <span id="quiz-question-text">Loading question...</span>
              </div>
              
              <!-- Options -->
              <div class="quiz-split-options" id="quiz-options-container" style="display: flex; flex-direction: column; gap: 12px;">
                <!-- Options dynamically generated -->
              </div>
              
              <!-- Explanation/Feedback Box -->
              <div class="quiz-split-explanation" id="quiz-explanation-box" style="display: none; background: var(--bg-surface-2); border-left: 3px solid var(--accent-primary); padding: 16px; border-radius: var(--radius-sm); font-size: 13px; color: var(--text-secondary); line-height: 1.5; flex-direction: column; gap: 6px;">
                <!-- Explanation header and rationale -->
              </div>
            </div>
            
            <!-- Footer -->
            <div class="quiz-split-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-top: 1px solid var(--border); background: var(--bg-surface);">
              <button class="quiz-back-btn" id="quiz-prev-btn" onclick="prevQuizQuestion()" style="background: transparent; border: none; color: var(--text-secondary); font-family: var(--font-ui); font-size: 14px; font-weight: 600; cursor: pointer; padding: 8px 16px; border-radius: var(--radius-sm); transition: var(--transition);">Kembali</button>
              <button class="quiz-next-btn" id="quiz-next-btn" onclick="nextQuizQuestion()" disabled style="background-color: var(--accent-primary); color: var(--accent-on); border: none; padding: 10px 24px; border-radius: var(--radius-full); font-family: var(--font-ui); font-size: 14px; font-weight: 700; cursor: pointer; transition: var(--transition); box-shadow: 0 4px 12px var(--accent-glow);">Lanjut</button>
            </div>
          </div>
        </div>
    `;

    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (!activeQuizQuestions || activeQuizQuestions.length === 0) return;

    const currentQuiz = activeQuizQuestions[quizIndex];

    document.getElementById('quiz-counter-text').textContent = `${quizIndex + 1} / ${activeQuizQuestions.length}`;
    document.getElementById('q-num-text').textContent = `Q${quizIndex + 1}.`;
    document.getElementById('quiz-question-text').textContent = currentQuiz.question;

    const badgeContainer = document.getElementById('quiz-badge-container');
    badgeContainer.innerHTML = `<span class="stat-badge badge-correct" style="font-size: 10px; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase;">${currentQuiz.badge}</span>`;

    const segmentsContainer = document.getElementById('quiz-progress-segments');
    segmentsContainer.innerHTML = activeQuizQuestions.map((q, idx) => {
        let stateClass = '';
        if (idx === quizIndex) stateClass = 'active';
        else if (quizResults[idx] === true) stateClass = 'correct';
        else if (quizResults[idx] === false) stateClass = 'wrong';

        return `<div class="progress-segment ${stateClass}" style="height: 6px; flex: 1; border-radius: 3px; background: ${stateClass === 'active' ? 'var(--text-primary)' : stateClass === 'correct' ? 'var(--color-success)' : stateClass === 'wrong' ? 'var(--color-error)' : 'var(--text-disabled)'}; transition: background-color var(--transition);"></div>`;
    }).join('');

    const explanationBox = document.getElementById('quiz-explanation-box');
    explanationBox.style.display = 'none';
    explanationBox.className = 'quiz-split-explanation';

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = '';

    currentQuiz.options.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'split-option-btn';
        button.style.cssText = `
            width: 100%;
            text-align: left;
            background-color: var(--bg-surface-2);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 16px 20px;
            border-radius: var(--radius-md);
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: var(--font-base);
        `;

        button.innerHTML = `<span class="option-prefix" style="font-weight: 700; color: var(--accent-primary); margin-right: 4px;">${option.letter}</span> <span>${option.text}</span>`;

        if (quizResults[quizIndex] !== null) {
            button.disabled = true;
            if (option.isCorrect) {
                button.classList.add('correct');
                button.style.borderColor = 'var(--color-success)';
                button.style.backgroundColor = 'var(--color-success-subtle)';
            } else if (quizResults[quizIndex] === false && option.letter === quizResults[quizIndex + '_choice']) {
                button.classList.add('incorrect');
                button.style.borderColor = 'var(--color-error)';
                button.style.backgroundColor = 'var(--color-error-subtle)';
            }
        }

        button.addEventListener('click', () => selectQuizOption(option, button));
        optionsContainer.appendChild(button);
    });

    document.getElementById('quiz-prev-btn').disabled = quizIndex === 0;
    
    const nextBtn = document.getElementById('quiz-next-btn');
    if (quizResults[quizIndex] !== null) {
        nextBtn.disabled = false;
        nextBtn.textContent = quizIndex === activeQuizQuestions.length - 1 ? 'Selesai' : 'Lanjut';
        
        explanationBox.style.display = 'flex';
        if (quizResults[quizIndex] === true) {
            explanationBox.classList.add('correct-explanation');
            explanationBox.style.borderLeftColor = 'var(--color-success)';
            explanationBox.innerHTML = `
                <div class="explanation-header" style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--color-success);">
                    <span class="material-icons-round" style="font-size: 16px;">check_circle</span> Jawaban Benar!
                </div>
                <div style="margin-top: 4px; line-height: 1.4;">${quizResults[quizIndex + '_rationale']}</div>
            `;
        } else {
            explanationBox.classList.add('incorrect-explanation');
            explanationBox.style.borderLeftColor = 'var(--color-error)';
            explanationBox.innerHTML = `
                <div class="explanation-header" style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--color-error);">
                    <span class="material-icons-round" style="font-size: 16px;">cancel</span> Jawaban Kurang Tepat
                </div>
                <div style="margin-top: 4px; line-height: 1.4;">${quizResults[quizIndex + '_rationale']}</div>
            `;
        }
    } else {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Lanjut';
    }
}

function selectQuizOption(option, selectedButton) {
    const currentQuiz = activeQuizQuestions[quizIndex];
    const allButtons = document.getElementById('quiz-options-container').querySelectorAll('.split-option-btn');
    
    allButtons.forEach(btn => btn.disabled = true);

    quizResults[quizIndex] = option.isCorrect;
    quizResults[quizIndex + '_choice'] = option.letter;
    quizResults[quizIndex + '_rationale'] = option.rationale;

    if (option.isCorrect) {
        quizScore++;
        selectedButton.classList.add('correct');
        selectedButton.style.borderColor = 'var(--color-success)';
        selectedButton.style.backgroundColor = 'var(--color-success-subtle)';
    } else {
        selectedButton.classList.add('incorrect');
        selectedButton.style.borderColor = 'var(--color-error)';
        selectedButton.style.backgroundColor = 'var(--color-error-subtle)';
        
        const correctIndex = currentQuiz.options.findIndex(opt => opt.isCorrect);
        if (correctIndex !== -1 && allButtons[correctIndex]) {
            allButtons[correctIndex].classList.add('correct');
            allButtons[correctIndex].style.borderColor = 'var(--color-success)';
            allButtons[correctIndex].style.backgroundColor = 'var(--color-success-subtle)';
        }
    }

    const segmentsContainer = document.getElementById('quiz-progress-segments');
    segmentsContainer.innerHTML = activeQuizQuestions.map((q, idx) => {
        let stateClass = '';
        if (idx === quizIndex) {
            stateClass = option.isCorrect ? 'correct' : 'wrong';
        } else if (quizResults[idx] === true) stateClass = 'correct';
        else if (quizResults[idx] === false) stateClass = 'wrong';

        return `<div class="progress-segment ${stateClass}" style="height: 6px; flex: 1; border-radius: 3px; background: ${stateClass === 'active' ? 'var(--text-primary)' : stateClass === 'correct' ? 'var(--color-success)' : stateClass === 'wrong' ? 'var(--color-error)' : 'var(--text-disabled)'}; transition: background-color var(--transition);"></div>`;
    }).join('');

    const explanationBox = document.getElementById('quiz-explanation-box');
    explanationBox.style.display = 'flex';
    if (option.isCorrect) {
        explanationBox.classList.add('correct-explanation');
        explanationBox.style.borderLeftColor = 'var(--color-success)';
        explanationBox.innerHTML = `
            <div class="explanation-header" style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--color-success);">
                <span class="material-icons-round" style="font-size: 16px;">check_circle</span> Jawaban Benar!
            </div>
            <div style="margin-top: 4px; line-height: 1.4;">${option.rationale}</div>
        `;
    } else {
        explanationBox.classList.add('incorrect-explanation');
        explanationBox.style.borderLeftColor = 'var(--color-error)';
        explanationBox.innerHTML = `
            <div class="explanation-header" style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--color-error);">
                <span class="material-icons-round" style="font-size: 16px;">cancel</span> Jawaban Kurang Tepat
            </div>
            <div style="margin-top: 4px; line-height: 1.4;">${option.rationale}</div>
        `;
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = false;
    nextBtn.textContent = quizIndex === activeQuizQuestions.length - 1 ? 'Selesai' : 'Lanjut';
}

window.prevQuizQuestion = function() {
    if (quizIndex > 0) {
        quizIndex--;
        renderQuizQuestion();
    }
}

window.nextQuizQuestion = function() {
    if (quizIndex < activeQuizQuestions.length - 1) {
        quizIndex++;
        renderQuizQuestion();
    } else {
        showQuizResults();
    }
}

window.closeStudioQuiz = function() {
    const studio = document.getElementById('studio');
    if (studio) {
        studio.classList.remove('expanded');
        studio.innerHTML = defaultStudioToolbarHtml;
    }
}

function showQuizResults() {
    const studio = document.getElementById('studio');
    if (!studio) return;

    studio.innerHTML = `
        <div class="studio-expanded-workspace">
          <div class="quiz-container-split" style="height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div class="quiz-split-header">
              <div class="quiz-split-header__left">
                <span class="material-icons-round quiz-split-icon">emoji_events</span>
                <span class="quiz-split-title">Kuis Selesai! 🎉</span>
              </div>
              <div class="quiz-split-header__right">
                <button class="icon-btn" onclick="closeStudioQuiz()" title="Tutup Kuis" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
            </div>
            
            <!-- Result Body -->
            <div class="quiz-split-body" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; gap: 24px;">
              <div style="font-size: 64px; animation: bounce 1s infinite alternate;">🏆</div>
              <div>
                <h3 style="font-family: var(--font-ui); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Selamat, Anda Telah Menyelesaikan Kuis!</h3>
                <p style="font-size: 14px; color: var(--text-secondary);">Kuis ini membantu melatih pemahaman materi belajar Anda.</p>
              </div>
              
              <div style="padding: 24px 48px; background: var(--bg-surface-2); border-radius: var(--radius-lg); border: 2px dashed var(--accent-primary); display: flex; flex-direction: column; gap: 8px; min-width: 240px;">
                <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: var(--accent-primary); letter-spacing: 1px;">Skor Akhir Kamu</div>
                <div style="font-size: 3rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary);">${quizScore} <span style="font-size: 1.5rem; font-weight: 500; color: var(--text-muted);">/ ${activeQuizQuestions.length}</span></div>
              </div>
              
              <div style="display: flex; gap: 12px; margin-top: 12px;">
                <button class="quiz-next-btn" onclick="closeStudioQuiz()" style="background-color: var(--accent-primary); color: var(--accent-on); border: none; padding: 12px 32px; border-radius: var(--radius-full); font-family: var(--font-ui); font-size: 14px; font-weight: 700; cursor: pointer; transition: var(--transition); box-shadow: 0 4px 12px var(--accent-glow);">Selesai & Tutup</button>
              </div>
            </div>
          </div>
        </div>
        <style>
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-10px); }
          }
        </style>
    `;
}
