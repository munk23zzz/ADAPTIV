/* ── Data ─────────────────────────────────────────────────── */
let sources = [
  { id: 1, name: 'Laporan Tahunan 2024.pdf', type: 'PDF', icon: '📄', checked: true },
  { id: 2, name: 'Ringkasan Eksekutif.docx', type: 'Word', icon: '📝', checked: true },
  { id: 3, name: 'Data Penjualan Q4.xlsx', type: 'Spreadsheet', icon: '📊', checked: false },
  { id: 4, name: 'Presentasi Strategi.pptx', type: 'Slide', icon: '📋', checked: true },
  { id: 5, name: 'https://example.com/artikel', type: 'Web', icon: '🌐', checked: false },
];

let notes = [
  { id: 1, title: 'Catatan Rapat 12 Mei', date: '12 Mei 2026', icon: '📌' },
  { id: 2, title: 'Poin Utama Laporan', date: '10 Mei 2026', icon: '📎' },
];

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
    const studio = document.getElementById('studio');
    const btnSidebar = document.getElementById('btn-toggle-sidebar');
    const btnStudio = document.getElementById('btn-toggle-studio');

    function toggleSidebar() {
      sidebar.classList.toggle('collapsed');
      btnSidebar.classList.toggle('active');
    }
    function toggleStudio() {
      studio.classList.toggle('collapsed');
      btnStudio.classList.toggle('active');
    }
    if (btnSidebar) btnSidebar.addEventListener('click', toggleSidebar);
    if (btnStudio) btnStudio.addEventListener('click', toggleStudio);

    /* ── Global Drawer toggle ─────────────────────────────────── */
    const globalDrawer = document.getElementById('global-drawer');
    const globalDrawerOverlay = document.getElementById('global-drawer-overlay');
    const btnGlobalMenu = document.getElementById('btn-global-menu');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');

    if (btnGlobalMenu) {
        btnGlobalMenu.addEventListener('click', () => {
          globalDrawer.classList.add('show');
          globalDrawerOverlay.classList.add('show');
        });
    }
    if (btnCloseDrawer) {
        btnCloseDrawer.addEventListener('click', () => {
          globalDrawer.classList.remove('show');
          globalDrawerOverlay.classList.remove('show');
        });
    }
    if (globalDrawerOverlay) {
        globalDrawerOverlay.addEventListener('click', () => {
          globalDrawer.classList.remove('show');
          globalDrawerOverlay.classList.remove('show');
        });
    }

    /* ── Studio tabs ──────────────────────────────────────────── */
    document.querySelectorAll('.studio-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.dataset.tab;
        ['studio', 'notes', 'mindmap'].forEach(k => {
          const el = document.getElementById('tab-' + k);
          if (el) el.style.display = k === key ? 'flex' : 'none';
        });
        const studioTab = document.getElementById('tab-studio');
        if (key === 'studio' && studioTab) studioTab.style.display = '';
      });
    });

    /* ── Render ───────────────────────────────────────────────── */
    renderSources();
    renderNotes();
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
          document.title = (titleEl.textContent.trim() || 'Notebook') + ' — NotebookLM';
        });
    }

    /* ── Studio Toggle (Inner) ────────────────────────────────── */
    const btnToggleStudioInner = document.getElementById('btn-toggle-studio-inner');
    if (btnToggleStudioInner) {
        btnToggleStudioInner.addEventListener('click', () => {
          if (studio) {
              studio.classList.toggle('collapsed');
              btnToggleStudioInner.classList.toggle('active');
          }
        });
    }

    /* ── Modal & Upload Initialization ────────────────────────── */
    setupModals();
    setupUploadZone();
});

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
            if (title) title.textContent = 'or drop your files';
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
      <div class="ai-avatar">✨</div>
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
      <button class="msg-action-btn" onclick="saveToNote(this)">
        <span class="material-icons-round">bookmark_border</span>
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
    <div class="ai-avatar">✨</div>
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

/* ── Notes Management ─────────────────────────────────────── */
function renderNotes() {
    const list = document.getElementById('notes-list');
    if (!list) return;
    list.innerHTML = notes.map(n => `
  <div class="note-item">
    <div class="note-thumb">${n.icon}</div>
    <div class="note-meta">
      <div class="note-title">${n.title}</div>
      <div class="note-date">${n.date}</div>
    </div>
  </div>
`).join('');
}

function saveToNote(btn) {
    const bubble = btn.closest('.msg-group').querySelector('.bubble');
    const content = bubble ? bubble.innerText.slice(0, 60) + '…' : 'Catatan AI';
    notes.unshift({
      id: Date.now(),
      title: content,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      icon: '⭐',
    });
    renderNotes();
    const icon = btn.querySelector('.material-icons-round');
    if (icon) icon.textContent = 'bookmark';
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

// Spin animation for loading
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);
