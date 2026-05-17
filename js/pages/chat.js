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
      const isFlashcards = text.toLowerCase().includes('kartu belajar') || text.toLowerCase().includes('flashcards') || text.toLowerCase().includes('flashcard');
      const isMindmap = text.toLowerCase().includes('peta pikiran') || text.toLowerCase().includes('mindmap') || text.toLowerCase().includes('mind map');
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
      } else if (isFlashcards && sessionKey === 'kalkulus') {
          appendAiMsg("Tentu! Saya telah menyiapkan 12 **Kartu Belajar (Flashcards) Kalkulus** interaktif yang mencakup materi Limit, Turunan, Integral, dan Aplikasinya di panel kanan Anda. Silakan pelajari dan uji pemahaman Anda! 📐✨");
          startCalculusFlashcards();
      } else if (isFlashcards && sessionKey === 'ppkn') {
          appendAiMsg("Tentu! Saya telah menyiapkan **Kartu Belajar PPKn** interaktif seputar Pancasila dan Konstitusi di panel kanan Anda. Silakan pelajari dan uji pemahaman Anda! 🏛️✨");
          startPpknFlashcards();
      } else if (isFlashcards && sessionKey === 'algoritma') {
          appendAiMsg("Tentu! Saya telah menyiapkan **Kartu Belajar Algoritma & Pemrograman** interaktif seputar Sorting, Searching, dan Struktur Data di panel kanan Anda. Silakan pelajari dan uji pemahaman Anda! 💻✨");
          startAlgoritmaFlashcards();
      } else if (isMindmap && sessionKey === 'kalkulus') {
          appendAiMsg("Tentu! Saya telah mendesain **Peta Pikiran (Mind Map) Kalkulus** interaktif yang memetakan materi Limit, Turunan, Integral, dan Aplikasi di panel kanan Anda. Klik cabang untuk memperluas atau klik topik untuk melihat rangkuman detail! 📐🗺️");
          startCalculusMindmap();
      } else if (isMindmap && sessionKey === 'ppkn') {
          appendAiMsg("Tentu! Saya telah mendesain **Peta Pikiran (Mind Map) PPKn** interaktif di panel kanan Anda. Klik cabang untuk memperluas atau klik topik untuk detail rangkuman! 🏛️🗺️");
          startPpknMindmap();
      } else if (isMindmap && sessionKey === 'algoritma') {
          appendAiMsg("Tentu! Saya telah mendesain **Peta Pikiran (Mind Map) Algoritma & Pemrograman** interaktif di panel kanan Anda. Klik cabang untuk memperluas atau klik topik untuk detail rangkuman! 💻🗺️");
          startAlgoritmaMindmap();
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
    const params = new URLSearchParams(window.location.search);
    const sessionKey = params.get('session');
    
    if (type === 'Kuis') {
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
    } else if (type === 'Kartu Belajar') {
        if (sessionKey === 'kalkulus') {
            startCalculusFlashcards();
            return;
        } else if (sessionKey === 'ppkn') {
            startPpknFlashcards();
            return;
        } else if (sessionKey === 'algoritma') {
            startAlgoritmaFlashcards();
            return;
        }
    } else if (type === 'Peta Pikiran') {
        if (sessionKey === 'kalkulus') {
            startCalculusMindmap();
            return;
        } else if (sessionKey === 'ppkn') {
            startPpknMindmap();
            return;
        } else if (sessionKey === 'algoritma') {
            startAlgoritmaMindmap();
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

/* ── Interactive Flashcard (Kartu Belajar) Studio Engine ──── */
let activeFlashcardsDeck = [];
let fcIndex = 0;
let fcFilter = 'Semua';
let fcFlipped = false;

function startCalculusFlashcards() {
    fcFilter = 'Semua';
    fcIndex = 0;
    fcFlipped = false;
    activeFlashcardsDeck = [
        {
            category: "Limit",
            question: "Apa yang dimaksud dengan limit suatu fungsi f(x) saat x mendekati a?",
            answer: "Limit adalah nilai yang didekati f(x) ketika x semakin dekat ke nilai a, tanpa harus tepat di a.",
            formula: "lim(x→a) f(x) = L",
            subtext: "Penting: f(a) belum tentu sama dengan L. Limit membahas perilaku fungsi di sekitar titik, bukan di titiknya.",
            rated: null // 'paham' or 'ulang' or null
        },
        {
            category: "Limit",
            question: "Apa bunyi Teorema Apit (Squeeze Theorem) dalam penentuan limit?",
            answer: "Jika f(x) ≤ g(x) ≤ h(x) untuk semua x dekat a, dan limit f(x) serta h(x) saat x→a adalah L, maka limit g(x) juga L.",
            formula: "lim f(x) = lim h(x) = L ⇒ lim g(x) = L",
            subtext: "Sangat berguna untuk mencari limit fungsi trigonometri kompleks seperti x² sin(1/x).",
            rated: null
        },
        {
            category: "Limit",
            question: "Kapan suatu limit fungsi dikatakan ada (exist) di suatu titik x = a?",
            answer: "Limit f(x) saat x mendekati a ada jika dan hanya jika limit kiri sama dengan limit kanan.",
            formula: "lim(x→a⁻) f(x) = lim(x→a⁺) f(x) = L",
            subtext: "Jika kedua limit sepihak bernilai berbeda, maka limit tersebut dikatakan tidak ada (Does Not Exist / DNE).",
            rated: null
        },
        {
            category: "Turunan",
            question: "Apa definisi formal dari turunan f'(x) menggunakan limit?",
            answer: "Turunan adalah limit dari perubahan rata-rata fungsi saat perubahan input (h) mendekati nol.",
            formula: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
            subtext: "Definisi ini merepresentasikan kemiringan garis singgung kurva f(x) pada titik x.",
            rated: null
        },
        {
            category: "Turunan",
            question: "Bagaimana aturan rantai (Chain Rule) digunakan untuk turunan fungsi komposisi f(g(x))?",
            answer: "Turunan dari f(g(x)) adalah turunan fungsi luar dikali turunan fungsi dalam.",
            formula: "d/dx [f(g(x))] = f'(g(x)) · g'(x)",
            subtext: "Sering ditulis dalam notasi Leibniz sebagai dy/dx = (dy/du) · (du/dx).",
            rated: null
        },
        {
            category: "Turunan",
            question: "Apa aturan turunan hasil kali (Product Rule) untuk dua fungsi u(x) dan v(x)?",
            answer: "Turunan dari perkalian dua fungsi adalah turunan pertama dikali kedua ditambah pertama dikali turunan kedua.",
            formula: "(u · v)' = u'v + uv'",
            subtext: "Jangan tertukar dengan aturan hasil bagi (Quotient Rule) yang memiliki tanda minus dan pembagi v².",
            rated: null
        },
        {
            category: "Integral",
            question: "Apa bunyi Teorema Dasar Kalkulus I (Fundamental Theorem of Calculus I)?",
            answer: "Jika F(x) adalah integral dari f(t) dari a ke x, maka turunan dari F(x) adalah f(x) itu sendiri.",
            formula: "d/dx [ ∫[a to x] f(t) dt ] = f(x)",
            subtext: "Teorema ini membuktikan bahwa turunan dan integral adalah dua operasi yang saling berkebalikan.",
            rated: null
        },
        {
            category: "Integral",
            question: "Bagaimana rumus dasar Integral Substitusi (perluasan aturan rantai)?",
            answer: "Metode substitusi digunakan dengan memisalkan u = g(x) sehingga du = g'(x)dx untuk menyederhanakan integrand.",
            formula: "∫ f(g(x))g'(x) dx = ∫ f(u) du",
            subtext: "Cari bagian dari integran yang merupakan turunan dari bagian lainnya.",
            rated: null
        },
        {
            category: "Integral",
            question: "Bagaimana rumus dasar dari Integral Parsial (Integration by Parts)?",
            answer: "Integral parsial diturunkan dari aturan perkalian (Product Rule) pada turunan.",
            formula: "∫ u dv = u·v - ∫ v du",
            subtext: "Pilihlah bagian 'u' yang mudah diturunkan, dan 'dv' yang mudah diintegralkan (Aturan LIATE).",
            rated: null
        },
        {
            category: "Aplikasi",
            question: "Bagaimana menentukan titik stasioner dan jenis ekstrem dari fungsi f(x)?",
            answer: "Titik stasioner dicapai saat f'(x) = 0. Titik maksimum terjadi jika f''(x) < 0, dan minimum jika f''(x) > 0.",
            formula: "Stasioner: f'(c) = 0 ; Maks: f''(c) < 0 ; Min: f''(c) > 0",
            subtext: "Jika f''(c) = 0, gunakan uji turunan pertama di sekitar titik c untuk menentukan jenis stasionernya.",
            rated: null
        },
        {
            category: "Aplikasi",
            question: "Bagaimana cara menghitung luas daerah di bawah kurva y = f(x) dari x = a ke x = b?",
            answer: "Luas daerah dihitung menggunakan Integral Tentu dari fungsi f(x) pada selang batas [a, b].",
            formula: "Luas = ∫[a to b] f(x) dx",
            subtext: "Pastikan kurva berada di atas sumbu X. Jika kurva di bawah sumbu X, integralkan nilai mutlak fungsinya.",
            rated: null
        },
        {
            category: "Aplikasi",
            question: "Apa syarat suatu fungsi f(x) dikatakan kontinu di titik x = a?",
            answer: "Fungsi dikatakan kontinu jika nilai limit saat x mendekati a sama dengan nilai fungsi di titik a tersebut.",
            formula: "lim(x→a) f(x) = f(a)",
            subtext: "Syarat ini mencakup tiga hal: f(a) terdefinisi, limit f(x) ada, dan kedua nilai tersebut sama.",
            rated: null
        }
    ];
    initStudioFlashcards();
}

function startPpknFlashcards() {
    fcFilter = 'Semua';
    fcIndex = 0;
    fcFlipped = false;
    activeFlashcardsDeck = [
        {
            category: "Pancasila",
            question: "Apa makna lambang sila ke-1 Pancasila, yaitu Bintang Emas?",
            answer: "Bintang emas melambangkan cahaya rohani bagi setiap manusia, dipancarkan oleh Tuhan Yang Maha Esa.",
            formula: "Ketuhanan Yang Maha Esa",
            subtext: "Lambang ini terletak di bagian tengah perisai Garuda Pancasila.",
            rated: null
        },
        {
            category: "Konstitusi",
            question: "Pasal berapa di UUD 1945 yang menjamin kemerdekaan tiap penduduk untuk memeluk agamanya masing-masing?",
            answer: "Pasal 29 ayat 2 UUD 1945 menjamin kemerdekaan beragama bagi seluruh masyarakat.",
            formula: "Pasal 29 Ayat 2 UUD 1945",
            subtext: "Negara menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya masing-masing.",
            rated: null
        },
        {
            category: "Kewarganegaraan",
            question: "Apa asas kewarganegaraan yang berdasarkan pertalian darah atau keturunan?",
            answer: "Asas Ius Sanguinis (Asas Keturunan) menetapkan kewarganegaraan seseorang berdasarkan kewarganegaraan orang tuanya.",
            formula: "Asas Keturunan / Ius Sanguinis",
            subtext: "Kebalikan dari Ius Soli yang menetapkan berdasarkan tempat kelahiran.",
            rated: null
        }
    ];
    initStudioFlashcards();
}

function startAlgoritmaFlashcards() {
    fcFilter = 'Semua';
    fcIndex = 0;
    fcFlipped = false;
    activeFlashcardsDeck = [
        {
            category: "Sorting",
            question: "Apa karakteristik utama dari algoritma Insertion Sort?",
            answer: "Mengurutkan data dengan cara mengambil satu per satu elemen lalu menyisipkannya pada posisi yang tepat dalam array terurut.",
            formula: "Time Complexity: O(n²)",
            subtext: "Sangat efisien untuk dataset kecil atau data yang hampir terurut.",
            rated: null
        },
        {
            category: "Searching",
            question: "Bagaimana pembagian ruang pencarian pada Binary Search?",
            answer: "Binary Search membagi ruang pencarian menjadi setengah di setiap iterasi dengan membandingkan nilai tengah.",
            formula: "Time Complexity: O(log n)",
            subtext: "Syarat wajib agar Binary Search bekerja adalah data harus dalam kondisi terurut.",
            rated: null
        },
        {
            category: "Struktur Data",
            question: "Apa perbedaan utama antara Stack dan Queue dalam pengelolaan data?",
            answer: "Stack menerapkan prinsip LIFO (Last In First Out), sedangkan Queue menerapkan prinsip FIFO (First In First Out).",
            formula: "Stack: LIFO | Queue: FIFO",
            subtext: "Stack mirip seperti tumpukan piring, Queue mirip seperti antrean loket.",
            rated: null
        }
    ];
    initStudioFlashcards();
}

function getFilteredFlashcards() {
    if (fcFilter === 'Semua') return activeFlashcardsDeck;
    return activeFlashcardsDeck.filter(card => card.category.toLowerCase() === fcFilter.toLowerCase());
}

function initStudioFlashcards() {
    const studio = document.getElementById('studio');
    if (!studio) return;

    studio.classList.add('expanded');

    studio.innerHTML = `
        <div class="studio-expanded-workspace" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Header -->
          <div class="quiz-split-header" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--border); background: var(--bg-surface);">
            <div class="quiz-split-header__left" style="display: flex; align-items: center; gap: 10px;">
              <span class="material-icons-round quiz-split-icon" style="color: var(--accent-primary);">style</span>
              <span class="quiz-split-title" style="font-family: var(--font-ui); font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">KARTU BELAJAR · ${activeQuiz ? activeQuiz.toUpperCase() : 'KALKULUS'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div class="fc-progress-dots-row" id="fc-progress-dots" style="display: flex; gap: 6px;">
                <!-- progress dots dynamically generated -->
              </div>
              <span class="quiz-counter-text" id="fc-counter-text" style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--text-secondary);">1 / 12</span>
            </div>
          </div>

          <!-- Body -->
          <div class="quiz-split-body" style="flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column;">
            
            <!-- Category Pills Filter -->
            <div class="flashcard-category-row" id="fc-categories-container">
              <!-- Category pills dynamically generated -->
            </div>

            <!-- Flipped Card Wrapper -->
            <div class="flashcard-wrapper" onclick="flipFlashcard()">
              <div class="flashcard-inner" id="fc-card-inner">
                
                <!-- FRONT (Pertanyaan) -->
                <div class="flashcard-front">
                  <div style="display: flex; flex-direction: column; gap: 14px;">
                    <div class="fc-badge fc-badge-question">
                      <span class="material-icons-round" style="font-size: 14px;">help_outline</span>
                      <span>Pertanyaan</span>
                    </div>
                    <div class="fc-category-label" id="fc-front-category">LIMIT</div>
                    <div class="fc-main-text" id="fc-front-question">Loading question...</div>
                  </div>
                  <div class="fc-hint-footer">
                    <span class="material-icons-round">cached</span>
                    <span>Klik kartu untuk lihat jawaban</span>
                  </div>
                </div>

                <!-- BACK (Jawaban) -->
                <div class="flashcard-back">
                  <div style="display: flex; flex-direction: column; gap: 14px; flex: 1;">
                    <div class="fc-badge fc-badge-answer">
                      <span class="material-icons-round" style="font-size: 14px;">lightbulb</span>
                      <span>Jawaban</span>
                    </div>
                    <div class="fc-main-text" id="fc-back-answer" style="font-size: 0.95rem; font-weight: 500;">Loading answer...</div>
                    <div class="fc-formula-box" id="fc-back-formula">lim(x→a) f(x) = L</div>
                  </div>
                  <div class="fc-subtext-note" id="fc-back-note">
                    <span class="material-icons-round">info</span>
                    <span id="fc-back-note-text">Penting: f(a) belum tentu sama dengan L...</span>
                  </div>
                </div>

              </div>
            </div>

            <!-- Navigation Bar + Rating Actions -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
              
              <!-- Left Arrow, Balik, Right Arrow -->
              <div style="display: flex; gap: 8px;">
                <button class="fc-btn-paham" id="fc-prev-btn" onclick="prevFlashcard()" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); min-width: 44px; justify-content: center;">
                  <span class="material-icons-round">arrow_back</span>
                </button>
                <button class="fc-btn-paham" onclick="flipFlashcard()" style="font-weight: 700; border-radius: var(--radius-sm); min-width: 90px; justify-content: center;">
                  <span class="material-icons-round">history</span>
                  <span>Balik</span>
                </button>
                <button class="fc-btn-paham" id="fc-next-btn" onclick="nextFlashcard()" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); min-width: 44px; justify-content: center;">
                  <span class="material-icons-round">arrow_forward</span>
                </button>
              </div>

              <!-- Rating Buttons (Paham / Perlu ulang) -->
              <div class="fc-rating-actions" id="fc-rating-container" style="visibility: hidden;">
                <button class="fc-btn-paham" onclick="rateFlashcard('paham')">
                  <span class="material-icons-round" style="color: var(--color-success);">check</span>
                  <span>Sudah paham</span>
                </button>
                <button class="fc-btn-ulang" onclick="rateFlashcard('ulang')">
                  <span class="material-icons-round" style="color: #ef5350;">refresh</span>
                  <span>Perlu diulang</span>
                </button>
              </div>

            </div>

          </div>

          <!-- Footer Stats -->
          <div class="fc-stats-row">
            <div class="fc-stat-item fc-stat-paham">
              <span class="fc-stat-num" id="fc-stat-paham-val">0</span>
              <span class="fc-stat-label">Paham</span>
            </div>
            <div style="width: 1px; height: 16px; background: var(--divider);"></div>
            <div class="fc-stat-item fc-stat-ulang">
              <span class="fc-stat-num" id="fc-stat-ulang-val">0</span>
              <span class="fc-stat-label">Perlu ulang</span>
            </div>
            <div style="width: 1px; height: 16px; background: var(--divider);"></div>
            <div class="fc-stat-item fc-stat-belum">
              <span class="fc-stat-num" id="fc-stat-belum-val">12</span>
              <span class="fc-stat-label">Belum dinilai</span>
            </div>
            <div style="margin-left: auto;">
              <button onclick="closeStudioQuiz()" style="font-family: var(--font-ui); font-size: 13px; font-weight: 700; color: var(--text-secondary); cursor: pointer; background: none; border: none; padding: 6px 12px; border-radius: 4px; transition: all 0.2s;">Tutup Studio</button>
            </div>
          </div>
        </div>
    `;

    renderFlashcard();
}

function renderFlashcard() {
    const filtered = getFilteredFlashcards();
    if (!filtered || filtered.length === 0) {
        document.getElementById('fc-front-question').textContent = "Tidak ada kartu belajar di kategori ini.";
        document.getElementById('fc-front-category').textContent = "";
        document.getElementById('fc-counter-text').textContent = "0 / 0";
        document.getElementById('fc-progress-dots').innerHTML = "";
        return;
    }

    // Adjust active index
    if (fcIndex >= filtered.length) fcIndex = filtered.length - 1;
    if (fcIndex < 0) fcIndex = 0;

    const currentCard = filtered[fcIndex];

    // Reset flipped state on card
    fcFlipped = false;
    const cardInner = document.getElementById('fc-card-inner');
    if (cardInner) cardInner.classList.remove('flipped');

    // Hide rating actions by default (only visible on back)
    document.getElementById('fc-rating-container').style.visibility = 'hidden';

    // Set Text Content
    document.getElementById('fc-front-question').textContent = currentCard.question;
    document.getElementById('fc-front-category').textContent = currentCard.category.toUpperCase();
    document.getElementById('fc-back-answer').textContent = currentCard.answer;
    document.getElementById('fc-back-formula').textContent = currentCard.formula;
    document.getElementById('fc-back-note-text').textContent = currentCard.subtext;
    document.getElementById('fc-counter-text').textContent = `${fcIndex + 1} / ${filtered.length}`;

    // Render filter categories pills
    const categoriesSet = new Set(activeFlashcardsDeck.map(c => c.category));
    const categoriesList = ['Semua', ...Array.from(categoriesSet)];
    
    const catContainer = document.getElementById('fc-categories-container');
    catContainer.innerHTML = categoriesList.map(cat => {
        const isActive = fcFilter.toLowerCase() === cat.toLowerCase() ? 'active' : '';
        return `<button class="flashcard-pill ${isActive}" onclick="filterFlashcards('${cat}')">${cat}</button>`;
    }).join('');

    // Render progress dots
    const dotsContainer = document.getElementById('fc-progress-dots');
    dotsContainer.innerHTML = filtered.map((c, idx) => {
        let dotStyle = 'background-color: var(--text-disabled);';
        if (idx === fcIndex) {
            dotStyle = 'background-color: var(--accent-primary);';
        } else if (c.rated === 'paham') {
            dotStyle = 'background-color: var(--color-success);';
        } else if (c.rated === 'ulang') {
            dotStyle = 'background-color: #ef5350;';
        }
        return `<div style="width: 6px; height: 6px; border-radius: 50%; ${dotStyle} transition: all 0.2s;"></div>`;
    }).join('');

    // Disable navigation buttons if out of range
    document.getElementById('fc-prev-btn').disabled = fcIndex === 0;
    document.getElementById('fc-next-btn').disabled = fcIndex === filtered.length - 1;

    // Recalculate stats
    recalculateFcStats();
}

function flipFlashcard() {
    const cardInner = document.getElementById('fc-card-inner');
    if (!cardInner) return;

    fcFlipped = !fcFlipped;
    if (fcFlipped) {
        cardInner.classList.add('flipped');
        document.getElementById('fc-rating-container').style.visibility = 'visible';
    } else {
        cardInner.classList.remove('flipped');
        document.getElementById('fc-rating-container').style.visibility = 'hidden';
    }
}

function filterFlashcards(cat) {
    fcFilter = cat;
    fcIndex = 0;
    fcFlipped = false;
    renderFlashcard();
}

window.prevFlashcard = function() {
    if (fcIndex > 0) {
        fcIndex--;
        renderFlashcard();
    }
}

window.nextFlashcard = function() {
    const filtered = getFilteredFlashcards();
    if (fcIndex < filtered.length - 1) {
        fcIndex++;
        renderFlashcard();
    }
}

window.rateFlashcard = function(status) {
    const filtered = getFilteredFlashcards();
    if (!filtered || filtered.length === 0) return;

    const currentCard = filtered[fcIndex];
    currentCard.rated = status;

    recalculateFcStats();

    // Automatically navigate to next card after a brief, smooth delay
    setTimeout(() => {
        if (fcIndex < filtered.length - 1) {
            fcIndex++;
            renderFlashcard();
        } else {
            // Flipped first to show rated status dot update
            renderFlashcard();
        }
    }, 250);
}

function recalculateFcStats() {
    let paham = 0;
    let ulang = 0;
    let belum = 0;

    activeFlashcardsDeck.forEach(card => {
        if (card.rated === 'paham') paham++;
        else if (card.rated === 'ulang') ulang++;
        else belum++;
    });

    const pahamVal = document.getElementById('fc-stat-paham-val');
    const ulangVal = document.getElementById('fc-stat-ulang-val');
    const belumVal = document.getElementById('fc-stat-belum-val');

    if (pahamVal) pahamVal.textContent = paham;
    if (ulangVal) ulangVal.textContent = ulang;
    if (belumVal) belumVal.textContent = belum;
}

}

/* ── Interactive Mind Map (Peta Pikiran) Studio Engine ────── */
let activeMindmapData = null;
let expandedBranches = new Set(); // Stores expanded branch IDs

function startCalculusMindmap() {
    activeMindmapData = {
        title: "Kalkulus",
        center: { name: "KALKULUS", subtitle: "∫ · d/dx · lim", keyFormula: "Teorema Fundamental: d/dx [∫[a to x] f(t) dt] = f(x)" },
        branches: [
            {
                id: "limit",
                name: "LIMIT",
                subtitle: "lim f(x)",
                color: "#00e8c8",
                position: { top: 32, left: 28 }, // percent coordinates inside workspace
                childs: [
                    { name: "Definisi Limit", desc: "Menjelaskan nilai hampiran f(x) saat x mendekati c secara sepihak maupun dua pihak.", formula: "lim(x→c) f(x) = L", tip: "Limit ada jika limit kiri sama dengan limit kanan." },
                    { name: "Teorema Apit", desc: "Membuktikan limit dengan cara menjepit fungsi di antara dua fungsi lain yang limitnya sama.", formula: "f(x)≤g(x)≤h(x) ⇒ lim g(x) = L", tip: "Sangat ampuh untuk fungsi osilasi kompleks seperti x sin(1/x)." },
                    { name: "Asimtot", desc: "Penyelidikan perilaku fungsi rasional saat mendekati nilai tak hingga atau pembagian nol.", formula: "lim(x→∞) 1/x = 0", tip: "Membantu melukis grafik fungsi secara presisi." }
                ]
            },
            {
                id: "turunan",
                name: "TURUNAN",
                subtitle: "d/dx f(x)",
                color: "#8b5cf6",
                position: { top: 32, left: 72 },
                childs: [
                    { name: "Definisi Laju", desc: "Kemiringan garis singgung kurva f(x) pada koordinat tertentu menggunakan konsep limit.", formula: "f'(x) = lim(h→0) [f(x+h)-f(x)]/h", tip: "Turunan menyatakan laju perubahan sesaat." },
                    { name: "Aturan Rantai", desc: "Metode turunan fungsi bersarang atau fungsi komposisi.", formula: "dy/dx = dy/du · du/dx", tip: "Turunkan bagian luar dahulu baru kalikan turunan bagian dalam." },
                    { name: "Product Rule", desc: "Aturan perkalian antara dua buah fungsi variabel bebas yang sama.", formula: "(u · v)' = u'v + uv'", tip: "Bandingkan dengan Quotient Rule yang berselisih negatif di pembilang." }
                ]
            },
            {
                id: "integral",
                name: "INTEGRAL",
                subtitle: "∫ f(x) dx",
                color: "#f97316",
                position: { top: 68, left: 72 },
                childs: [
                    { name: "Anti-Turunan", desc: "Operasi mencari fungsi asal sebelum diturunkan, dinotasikan dengan lambang integral.", formula: "∫ f(x) dx = F(x) + C", tip: "Selalu sertakan konstanta +C pada integral tak tentu." },
                    { name: "Substitusi", desc: "Metode pemisalan u untuk menyelesaikan bentuk integral perkalian fungsi.", formula: "∫ f(g(x))g'(x) dx = ∫ f(u) du", tip: "Cari bagian integrand yang merupakan kelipatan turunan bagian lainnya." },
                    { name: "Parsial", desc: "Metode integrasi perkalian fungsi menggunakan diferensial bertingkat.", formula: "∫ u dv = u v - ∫ v du", tip: "Gunakan aturan LIATE untuk memilih bagian u." }
                ]
            },
            {
                id: "aplikasi",
                name: "APLIKASI",
                subtitle: "Optimasi",
                color: "#eab308",
                position: { top: 68, left: 28 },
                childs: [
                    { name: "Nilai Stasioner", desc: "Mencari titik ekstrem (maksimum/minimum) kurva saat kemiringannya nol.", formula: "f'(c) = 0", tip: "Gunakan uji turunan kedua f''(c) untuk memastikan jenis ekstremnya." },
                    { name: "Luas Daerah", desc: "Menghitung luas di antara kurva dan sumbu koordinat dengan integral tentu.", formula: "Luas = ∫[a to b] f(x) dx", tip: "Daerah di bawah sumbu X bernilai negatif, mutlakkan nilainya." },
                    { name: "Volume Putar", desc: "Menghitung volume benda tiga dimensi hasil pemutaran daerah kurva.", formula: "V = π ∫ y² dx", tip: "Metode cincin atau kulit tabung dapat mempermudah perhitungan." }
                ]
            }
        ]
    };
    expandedBranches.clear();
    initStudioMindmap();
}

function startPpknMindmap() {
    activeMindmapData = {
        title: "PPKn",
        center: { name: "PPKN", subtitle: "Negara & Konstitusi", keyFormula: "Bhinneka Tunggal Ika: Berbeda-beda tetapi tetap satu" },
        branches: [
            {
                id: "pancasila",
                name: "PANCASILA",
                subtitle: "Dasar Negara",
                color: "#00e8c8",
                position: { top: 32, left: 28 },
                childs: [
                    { name: "Sila Ke-1", desc: "Ketuhanan Yang Maha Esa melambangkan kebebasan beragama warga negara.", formula: "Bintang Emas", tip: "Saling menghargai antar pemeluk kepercayaan." },
                    { name: "Keadilan Sosial", desc: "Sila ke-5 menjamin pemerataan kesejahteraan bagi seluruh masyarakat.", formula: "Padi & Kapas", tip: "Mengutamakan kepentingan umum di atas pribadi." }
                ]
            },
            {
                id: "uud1945",
                name: "UUD 1945",
                subtitle: "Konstitusi Negara",
                color: "#8b5cf6",
                position: { top: 32, left: 72 },
                childs: [
                    { name: "Amandemen", desc: "Perubahan resmi dokumen negara untuk menyesuaikan era reformasi.", formula: "Empat Kali Perubahan", tip: "Dilakukan tanpa mengubah Pembukaan UUD 1945." },
                    { name: "Pasal 27", desc: "Mengatur kesamaan kedudukan hukum dan hak atas pekerjaan yang layak.", formula: "Pasal 27 Ayat 1 & 2", tip: "Merupakan jaminan dasar kesejahteraan sipil." }
                ]
            },
            {
                id: "bela_negara",
                name: "BELA NEGARA",
                subtitle: "Hak & Kewajiban",
                color: "#f97316",
                position: { top: 68, left: 72 },
                childs: [
                    { name: "Pasal 30", desc: "Mengatur pertahanan negara melalui sistem pertahanan rakyat semesta.", formula: "Sishankamrata", tip: "TNI dan POLRI sebagai kekuatan utama, rakyat sebagai pendukung." }
                ]
            },
            {
                id: "nkri",
                name: "NKRI",
                subtitle: "Persatuan",
                color: "#eab308",
                position: { top: 68, left: 28 },
                childs: [
                    { name: "Wawasan Nusantara", desc: "Cara pandang bangsa terhadap kesatuan wilayah kepulauan Indonesia.", formula: "Satu Kesatuan IPOLEKSOSBUDHANKAM", tip: "Menyatukan laut sebagai penghubung daratan." }
                ]
            }
        ]
    };
    expandedBranches.clear();
    initStudioMindmap();
}

function startAlgoritmaMindmap() {
    activeMindmapData = {
        title: "Algoritma & Prog.",
        center: { name: "ALGORITMA", subtitle: "Struktur & Logika", keyFormula: "Kompleksitas Waktu: O(n log n) - Efisiensi Sorting Terbaik" },
        branches: [
            {
                id: "sorting",
                name: "SORTING",
                subtitle: "Pengurutan",
                color: "#00e8c8",
                position: { top: 32, left: 28 },
                childs: [
                    { name: "QuickSort", desc: "Pengurutan membagi-bagi dengan memilih elemen pivot.", formula: "Average O(n log n)", tip: "Sangat cepat untuk dataset besar acak." },
                    { name: "Insertion Sort", desc: "Menyisipkan elemen ke posisi yang pas satu demi satu.", formula: "Worst O(n²)", tip: "Efisien untuk data berukuran kecil." }
                ]
            },
            {
                id: "searching",
                name: "SEARCHING",
                subtitle: "Pencarian",
                color: "#8b5cf6",
                position: { top: 32, left: 72 },
                childs: [
                    { name: "Binary Search", desc: "Mencari dengan membagi ruang pencarian menjadi setengah bagian secara terus-menerus.", formula: "Worst O(log n)", tip: "Hanya bekerja pada array terurut." },
                    { name: "Linear Search", desc: "Mengecek setiap elemen dari indeks awal sampai akhir satu persatu.", formula: "Worst O(n)", tip: "Cocok untuk data acak tak terurut berukuran kecil." }
                ]
            },
            {
                id: "struktur_data",
                name: "STRUKTUR DATA",
                subtitle: "Organisasi Data",
                color: "#f97316",
                position: { top: 68, left: 72 },
                childs: [
                    { name: "Stack", desc: "Tumpukan elemen yang menerapkan urutan masuk terakhir keluar pertama.", formula: "LIFO Principle", tip: "Mendukung operasi push dan pop." },
                    { name: "Queue", desc: "Antrean elemen yang menerapkan urutan masuk pertama keluar pertama.", formula: "FIFO Principle", tip: "Mendukung operasi enqueue dan dequeue." }
                ]
            },
            {
                id: "paradigma",
                name: "PARADIGMA",
                subtitle: "Pola Desain",
                color: "#eab308",
                position: { top: 68, left: 28 },
                childs: [
                    { name: "Divide & Conquer", desc: "Memecah masalah menjadi submasalah kecil lalu menyatukan solusinya.", formula: "Rekursi Pembagian", tip: "Contoh: Merge Sort dan QuickSort." }
                ]
            }
        ]
    };
    expandedBranches.clear();
    initStudioMindmap();
}

function initStudioMindmap() {
    const studio = document.getElementById('studio');
    if (!studio) return;

    studio.classList.add('expanded');

    studio.innerHTML = `
        <div class="mindmap-workspace">
          <!-- Header -->
          <div class="quiz-split-header" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--border); background: var(--bg-surface); z-index: 10;">
            <div class="quiz-split-header__left" style="display: flex; align-items: center; gap: 10px;">
              <span class="material-icons-round quiz-split-icon" style="color: var(--accent-primary);">account_tree</span>
              <span class="quiz-split-title" style="font-family: var(--font-ui); font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">PETA PIKIRAN · ${activeMindmapData.title.toUpperCase()}</span>
            </div>
            <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-ui); font-weight: 500;">Klik cabang untuk perluas · klik topik untuk detail</span>
          </div>

          <!-- Canvas Viewport -->
          <div class="mindmap-canvas" id="mm-canvas-container">
            <!-- Connecting SVG Lines -->
            <svg class="mm-svg-canvas" id="mm-svg-canvas"></svg>

            <!-- Center Node -->
            <div class="mm-node mm-node-center" style="top: 50%; left: 50%;" onclick="openMindmapDrawer('${activeMindmapData.center.name}', 'Topik sentral pembelajaran aktif materi ini.', '${activeMindmapData.center.keyFormula}', 'Gunakan cabang di bawah ini untuk melihat detail submateri secara interaktif.', 'var(--accent-primary)')">
              <span class="mm-node-title">${activeMindmapData.center.name}</span>
              <span class="mm-node-subtitle">${activeMindmapData.center.subtitle}</span>
            </div>

            <!-- Dynamic Branch Nodes & Subnodes (Injected by JS) -->
            <div id="mm-dynamic-nodes"></div>

            <!-- Muted bottom key formulas -->
            <div class="mm-footer-note" id="mm-footer-formula">
              ${activeMindmapData.center.keyFormula}
            </div>
          </div>

          <!-- Slide Detail Drawer -->
          <div class="mm-detail-drawer" id="mm-drawer">
            <div class="mm-drawer-header">
              <div class="mm-drawer-title-row">
                <span class="material-icons-round" id="mm-drawer-icon" style="color: var(--accent-primary);">article</span>
                <span class="quiz-split-title" id="mm-drawer-title" style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Topik</span>
              </div>
              <button class="mm-drawer-close-btn" onclick="closeMindmapDrawer()">
                <span class="material-icons-round">close</span>
              </button>
            </div>
            <div class="mm-drawer-body">
              <p id="mm-drawer-desc" style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6;"></p>
              <div class="fc-formula-box" id="mm-drawer-formula" style="margin: 8px 0;">lim(x→a) f(x) = L</div>
              <div class="fc-subtext-note" id="mm-drawer-tip" style="margin-top: auto;">
                <span class="material-icons-round">lightbulb</span>
                <span id="mm-drawer-tip-text">Tips Belajar...</span>
              </div>
            </div>
          </div>
        </div>
    `;

    renderMindmap();
}

function renderMindmap() {
    if (!activeMindmapData) return;

    const dynamicNodesContainer = document.getElementById('mm-dynamic-nodes');
    if (!dynamicNodesContainer) return;

    let nodesHtml = '';

    activeMindmapData.branches.forEach(branch => {
        const isExpanded = expandedBranches.has(branch.id);
        const nodeClass = `mm-node-branch mm-node-${branch.id}`;
        const expandedClass = isExpanded ? 'expanded' : '';

        // Render Branch Node
        nodesHtml += `
            <div class="mm-node mm-node-topic ${nodeClass} ${expandedClass}" id="node-${branch.id}" 
                 style="top: ${branch.position.top}%; left: ${branch.position.left}%;"
                 onclick="handleBranchClick(event, '${branch.id}')">
              <span class="mm-node-title">${branch.name}</span>
              <span class="mm-node-subtitle">${branch.subtitle}</span>
              <div class="mm-expand-badge">+</div>
            </div>
        `;

        // Render child subnodes if expanded
        if (isExpanded && branch.childs) {
            branch.childs.forEach((child, index) => {
                const subCoords = getSubnodeCoordinates(branch.position, branch.id, index, branch.childs.length);
                nodesHtml += `
                    <div class="mm-node mm-node-sub" id="sub-${branch.id}-${index}"
                         style="top: ${subCoords.top}%; left: ${subCoords.left}%; border-color: ${branch.color};"
                         onclick="openMindmapDrawer('${child.name}', '${child.desc}', '${child.formula}', '${child.tip}', '${branch.color}')">
                      <span class="mm-node-title" style="color: ${branch.color}; font-weight: 700;">${child.name}</span>
                    </div>
                `;
            });
        }
    });

    dynamicNodesContainer.innerHTML = nodesHtml;

    // Timeout guarantees nodes are appended before we draw connecting lines
    setTimeout(() => {
        drawMindmapConnections();
    }, 50);
}

function getSubnodeCoordinates(branchPos, branchId, idx, total) {
    // Generate gorgeous arc placement around the parent node based on its quadrant position!
    const step = 14; // spacing factor
    if (branchId === 'limit') {
        // Quadrant: Top Left (Limit)
        if (idx === 0) return { top: branchPos.top - 12, left: branchPos.left - 12 };
        if (idx === 1) return { top: branchPos.top - 2, left: branchPos.left - 17 };
        if (idx === 2) return { top: branchPos.top + 8, left: branchPos.left - 12 };
    } else if (branchId === 'turunan') {
        // Quadrant: Top Right (Turunan)
        if (idx === 0) return { top: branchPos.top - 12, left: branchPos.left + 12 };
        if (idx === 1) return { top: branchPos.top - 2, left: branchPos.left + 17 };
        if (idx === 2) return { top: branchPos.top + 8, left: branchPos.left + 12 };
    } else if (branchId === 'integral') {
        // Quadrant: Bottom Right (Integral)
        if (idx === 0) return { top: branchPos.top - 8, left: branchPos.left + 12 };
        if (idx === 1) return { top: branchPos.top + 2, left: branchPos.left + 17 };
        if (idx === 2) return { top: branchPos.top + 12, left: branchPos.left + 12 };
    } else if (branchId === 'aplikasi') {
        // Quadrant: Bottom Left (Aplikasi)
        if (idx === 0) return { top: branchPos.top - 8, left: branchPos.left - 12 };
        if (idx === 1) return { top: branchPos.top + 2, left: branchPos.left - 17 };
        if (idx === 2) return { top: branchPos.top + 12, left: branchPos.left - 12 };
    }
    // General fallback
    return { top: branchPos.top, left: branchPos.left - 12 };
}

window.handleBranchClick = function(event, branchId) {
    event.stopPropagation();
    
    // Toggle expand state
    if (expandedBranches.has(branchId)) {
        expandedBranches.delete(branchId);
    } else {
        expandedBranches.add(branchId);
    }

    renderMindmap();

    // Trigger detailed branch drawer
    const branch = activeMindmapData.branches.find(b => b.id === branchId);
    if (branch) {
        openMindmapDrawer(branch.name, `Topik cabang utama Kalkulus membahas submateri ${branch.name}. Klik sub-cabang di sebelah luar untuk mempelajari rumus penting dan trik pengerjaan secara terperinci.`, `Rangkuman Kategori: ${branch.name}`, `Gunakan tombol + untuk melipat/membuka subtopik.`, branch.color);
    }
}

function drawMindmapConnections() {
    const canvas = document.getElementById('mm-canvas-container');
    const svg = document.getElementById('mm-svg-canvas');
    if (!canvas || !svg || !activeMindmapData) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Set SVG ViewBox dimensions
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    let pathsHtml = '';

    // Center coordinates
    const centerX = width / 2;
    const centerY = height / 2;

    activeMindmapData.branches.forEach(branch => {
        const branchEl = document.getElementById(`node-${branch.id}`);
        if (!branchEl) return;

        const bRect = branchEl.getBoundingClientRect();
        const branchX = bRect.left - rect.left + bRect.width / 2;
        const branchY = bRect.top - rect.top + bRect.height / 2;

        // Draw curve from center to branch
        pathsHtml += `
            <path class="mm-svg-path active" 
                  d="M ${centerX} ${centerY} C ${(centerX + branchX) / 2} ${centerY}, ${(centerX + branchX) / 2} ${branchY}, ${branchX} ${branchY}" 
                  stroke="${branch.color}" />
        `;

        // Draw curve to subnodes if branch is expanded
        if (expandedBranches.has(branch.id) && branch.childs) {
            branch.childs.forEach((child, index) => {
                const subEl = document.getElementById(`sub-${branch.id}-${index}`);
                if (!subEl) return;

                const sRect = subEl.getBoundingClientRect();
                const subX = sRect.left - rect.left + sRect.width / 2;
                const subY = sRect.top - rect.top + sRect.height / 2;

                pathsHtml += `
                    <path class="mm-svg-path" style="stroke-dasharray: 4, 3; stroke-width: 1.5; opacity: 0.7;"
                          d="M ${branchX} ${branchY} C ${(branchX + subX) / 2} ${branchY}, ${(branchX + subX) / 2} ${subY}, ${subX} ${subY}" 
                          stroke="${branch.color}" />
                `;
            });
        }
    });

    svg.innerHTML = pathsHtml;
}

window.openMindmapDrawer = function(title, desc, formula, tip, color) {
    const drawer = document.getElementById('mm-drawer');
    const drawerTitle = document.getElementById('mm-drawer-title');
    const drawerIcon = document.getElementById('mm-drawer-icon');
    const drawerDesc = document.getElementById('mm-drawer-desc');
    const drawerFormula = document.getElementById('mm-drawer-formula');
    const drawerTip = document.getElementById('mm-drawer-tip-text');

    if (!drawer) return;

    drawerTitle.textContent = title;
    drawerTitle.style.color = color;
    if (drawerIcon) drawerIcon.style.color = color;
    
    drawerDesc.textContent = desc;
    drawerFormula.textContent = formula;
    drawerTip.textContent = tip;

    drawer.classList.add('open');
}

window.closeMindmapDrawer = function() {
    const drawer = document.getElementById('mm-drawer');
    if (drawer) drawer.classList.remove('open');
}

// Window resize listener ensures connections are always aligned perfectly!
window.addEventListener('resize', () => {
    if (document.getElementById('mm-canvas-container')) {
        drawMindmapConnections();
    }
});
