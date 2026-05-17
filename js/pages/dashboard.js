/**
 * ADAPTIV DASHBOARD PAGE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ══════════════════════════════════
     DRAWER
  ══════════════════════════════════ */
  const drawer = document.getElementById('global-drawer');
  const overlay = document.getElementById('global-drawer-overlay');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const closeBtn = document.getElementById('btn-close-drawer');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  /* ══════════════════════════════════
     ACCOUNT POPUP
  ══════════════════════════════════ */
  const accountBar = document.getElementById('account-bar-btn');
  const accountPopup = document.getElementById('account-popup');

  if (accountBar) {
    accountBar.addEventListener('click', (e) => {
      e.stopPropagation();
      accountPopup.classList.toggle('hidden');
    });
  }
  document.addEventListener('click', () => {
    if (accountPopup) accountPopup.classList.add('hidden');
  });



  /* ══════════════════════════════════
     PERFORMANCE BAR CHART
  ══════════════════════════════════ */
  const chartDatasets = {
    weekly: [
      { date: 'Sn', h: 4.2 },
      { date: 'Sl', h: 6.5 },
      { date: 'Rb', h: 8.4 },
      { date: 'Km', h: 5.6 },
      { date: 'Jm', h: 9.2 },
      { date: 'Sb', h: 6.3 },
      { date: 'Mn', h: 4.0 },
    ],
    monthly: [
      { date: '2/5', h: 10.8 },
      { date: '3/5', h: 8.4 },
      { date: '4/5', h: 5.6 },
      { date: '5/5', h: 4.2 },
      { date: '6/5', h: 2.2 },
      { date: '7/5', h: 6.5 },
      { date: '8/5', h: 7.4 },
      { date: '9/5', h: 5.5 },
      { date: '10/5', h: 7.1 },
      { date: '11/5', h: 8.0 },
      { date: '12/5', h: 8.7 },
      { date: '13/5', h: 6.3 },
      { date: '14/5', h: 9.2 },
      { date: '15/5', h: 6.5 },
      { date: '16/5', h: 4.0 },
    ],
    all: [
      { date: 'Jan', h: 120 },
      { date: 'Feb', h: 145 },
      { date: 'Mar', h: 110 },
      { date: 'Apr', h: 160 },
      { date: 'Mei', h: 135 },
    ]
  };

  const tooltip = document.getElementById('chart-tooltip');
  const chartWrap = document.getElementById('chart-wrap');
  let currentPeriod = 'monthly';

  function renderChart(period = 'monthly') {
    const svg = document.getElementById('perf-chart');
    if (!svg) return;

    const data = chartDatasets[period];
    const W = 560, H = 155, padL = 24, padR = 10, padT = 14, padB = 24;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    // Calculate max value for scaling
    const maxVal = Math.max(...data.map(d => d.h));
    const scaleMax = maxVal > 12 ? Math.ceil(maxVal / 10) * 10 : 12;

    const n = data.length;
    const barW = (innerW / n) * 0.6;
    const gap = (innerW / n) * 0.4;

    let html = '';

    // Grid lines
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const v = (scaleMax / steps) * i;
      const y = padT + innerH - (v / scaleMax) * innerH;
      html += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
      if (v >= 0) {
        const displayVal = v >= 100 ? Math.round(v) : v.toFixed(v === 0 ? 0 : 1);
        html += `<text class="chart-label" x="${padL - 4}" y="${y + 3.5}" text-anchor="end">${displayVal}</text>`;
      }
    }

    data.forEach((d, i) => {
      const x = padL + i * (innerW / n) + gap / 2;
      const barH = (d.h / scaleMax) * innerH;
      const y = padT + innerH - barH;
      const isLatest = i === data.length - 1;
      const opacity = isLatest ? '1' : '0.72';

      const rectId = `bar-${period}-${i}`;
      html += `<rect class="chart-bar${isLatest ? ' today' : ''}" id="${rectId}"
          x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" ry="3"
          opacity="${opacity}"
          data-date="${d.date}" data-h="${d.h}j"
          />`;

      // Labels for dates (skip some if too many)
      const skipInterval = n > 15 ? 2 : 1;
      if (i % skipInterval === 0) {
        html += `<text class="chart-label" x="${x + barW / 2}" y="${H - 6}" text-anchor="middle">${d.date}</text>`;
      }
    });

    svg.innerHTML = html;

    // Add event listeners
    data.forEach((d, i) => {
      const rect = document.getElementById(`bar-${period}-${i}`);
      if (rect) {
        rect.addEventListener('mouseenter', (e) => showTooltip(e, d.date, d.h + 'j'));
        rect.addEventListener('mouseleave', hideTooltip);
      }
    });
  }

  function showTooltip(e, date, val) {
    if (!tooltip) return;
    tooltip.textContent = `${date} · ${val}`;
    tooltip.style.opacity = '1';
    const rect = chartWrap.getBoundingClientRect();
    const bar = e.target.getBoundingClientRect();
    tooltip.style.left = (bar.left - rect.left + bar.width / 2) + 'px';
    tooltip.style.top = (bar.top - rect.top - 4) + 'px';
  }
  function hideTooltip() { if (tooltip) tooltip.style.opacity = '0'; }

  /* ══════════════════════════════════
     CHART PERIOD SELECTOR
  ══════════════════════════════════ */
  const periodBtn = document.getElementById('period-btn');
  const periodDropdown = document.getElementById('period-dropdown');
  const periodText = document.getElementById('period-text');
  const periodItems = document.querySelectorAll('.period-item');

  if (periodBtn) {
    periodBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      periodDropdown.classList.toggle('show');
    });
  }

  periodItems.forEach(item => {
    item.addEventListener('click', () => {
      const period = item.dataset.period;
      const text = item.textContent;

      // Update UI
      periodText.textContent = text;
      periodItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      periodDropdown.classList.remove('show');

      // Update Chart
      renderChart(period);
    });
  });

  document.addEventListener('click', () => {
    if (periodDropdown) periodDropdown.classList.remove('show');
  });

  renderChart('monthly');

  /* ══════════════════════════════════
     LEADERBOARD DATA (Sync with leaderboard.js)
  ══════════════════════════════════ */
  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const lbDatasets = {
    weekly: [
      { rank: 1, name: "Sarah", time: 785 },
      { rank: 2, name: "Budi", time: 742 },
      { rank: 3, name: "Reza", time: 695 },
      { rank: 4, name: "Lloyd", time: 630, isCurrentUser: true },
      { rank: 5, name: "Alex", time: 580 },
      { rank: 6, name: "Dina", time: 540 },
      { rank: 7, name: "Ahmad", time: 510 },
      { rank: 8, name: "Rina", time: 480 },
      { rank: 9, name: "Jessica", time: 420 },
      { rank: 10, name: "Kevin", time: 380 }
    ],
    monthly: [
      { rank: 1, name: "Alex", time: 2850 },
      { rank: 2, name: "Sarah", time: 2740 },
      { rank: 3, name: "Budi", time: 2610 },
      { rank: 4, name: "Jessica", time: 2450 },
      { rank: 5, name: "Lloyd", time: 2310, isCurrentUser: true }, // Updated to match monthly rank
      { rank: 6, name: "Kevin", time: 2180 },
      { rank: 7, name: "Dina", time: 2050 },
      { rank: 8, name: "Rina", time: 1920 },
      { rank: 9, name: "Ahmad", time: 1840 },
      { rank: 10, name: "Reza", time: 1760 }
    ]
  };

  function formatTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}j ${m}m`;
  }

  function renderLeaderboard(datasetKey = 'weekly') {
    const list = document.getElementById('lb-list');
    if (!list) return;

    // Add fade out class
    list.style.opacity = '0';
    list.style.transform = 'translateY(5px)';

    setTimeout(() => {
      const data = lbDatasets[datasetKey];

      list.innerHTML = data.map(d => {
        let zone = 'safe';
        let zoneLabel = '● Aman';

        if (datasetKey === 'weekly') {
          if (d.rank <= 5) {
            zone = 'up';
            zoneLabel = '▲ Kenaikan';
          } else if (d.rank >= 16) {
            zone = 'down';
            zoneLabel = '▼ Penurunan';
          }
        }

        const rankDisplay = d.rank <= 3 ? ['🥇', '🥈', '🥉'][d.rank - 1] : d.rank;
        const avatarAlt = ['alt1', 'alt2', 'alt3'][d.rank % 3];

        return `
            <div class="lb-item ${d.isCurrentUser ? 'mine' : ''}">
              <div class="lb-rank ${d.rank <= 3 ? 'top' : ''}">${rankDisplay}</div>
              <div class="lb-avatar ${avatarAlt}">${getInitials(d.name)}</div>
              <div class="lb-info">
                <div class="lb-name">${d.name}</div>
                ${datasetKey === 'weekly' ? `<div class="lb-zone lb-zone--${zone}">${zoneLabel}</div>` : ''}
              </div>
              <div class="lb-time">${formatTime(d.time)}</div>
            </div>
          `;
      }).join('');

      // Fade back in
      list.style.opacity = '1';
      list.style.transform = 'translateY(0)';

      // Update My Rank Banner
      const currentUser = data.find(u => u.isCurrentUser);
      if (currentUser) {
        const rankLabel = document.getElementById('my-rank-period-label');
        const rankVal = document.getElementById('my-rank-val');
        const rankZone = document.getElementById('my-rank-zone');
        const rankTime = document.getElementById('my-rank-time');

        if (rankLabel) {
          rankLabel.textContent = datasetKey === 'weekly' ? 'Peringkat Mingguan' : 'Peringkat Bulanan';
        }
        if (rankVal) rankVal.textContent = `#${currentUser.rank}`;
        if (rankTime) rankTime.textContent = formatTime(currentUser.time);

        if (rankZone) {
          // Clear inline style overrides
          rankZone.style.background = '';
          rankZone.style.color = '';

          // Reset classes
          rankZone.className = 'my-rank-zone';

          if (datasetKey === 'weekly') {
            if (currentUser.rank <= 5) {
              rankZone.textContent = '▲ Kenaikan';
              rankZone.classList.add('zone--up');
            } else if (currentUser.rank >= 16) {
              rankZone.textContent = '▼ Penurunan';
              rankZone.classList.add('zone--down');
            } else {
              rankZone.textContent = '● Aman';
              rankZone.classList.add('zone--safe');
            }
          } else {
            // For monthly, no promotion titles
            rankZone.textContent = '● Aktif';
            rankZone.classList.add('zone--active');
          }
        }
      }
    }, 150);
  }

  // Initialize with transition property
  const listEl = document.getElementById('lb-list');
  if (listEl) {
    listEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  }

  renderLeaderboard();

  const tabMonthly = document.getElementById('tab-monthly');
  const tabWeekly = document.getElementById('tab-weekly');

  if (tabMonthly) {
    tabMonthly.addEventListener('click', () => {
      tabMonthly.classList.add('active');
      tabWeekly.classList.remove('active');
      renderLeaderboard('monthly');
    });
  }
  if (tabWeekly) {
    tabWeekly.addEventListener('click', () => {
      tabWeekly.classList.add('active');
      tabMonthly.classList.remove('active');
      renderLeaderboard('weekly');
    });
  }

  /* ══════════════════════════════════
     MONTHLY LEVEL GEMS
  ══════════════════════════════════ */
  function getGemstoneSVG(index) {
    const colors = [
      '#A78BFA', // 1: Purple
      '#818CF8', // 2: Indigo Blue
      '#3B82F6', // 3: Royal Blue
      '#60A5FA', // 4: Cyan
      '#22D3EE', // 5: Teal
      '#34D399', // 6: Light Green
      '#FBBF24', // 7: Yellow
      '#F97316', // 8: Orange
      '#EF4444', // 9: Red
      '#EC4899', // 10: Pink/Red Star
      '#F43F5E', // 11: Locked Outer
      '#B91C1C'  // 12: Locked Outer
    ];

    if (index === 0) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 22,12 12,22 2,12" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><polygon points="12,6 18,12 12,18 6,12" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.7"/></svg>`;
    }
    if (index === 1) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 22,9 18,21 6,21 2,9" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="22" y1="9" x2="12" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="18" y1="21" x2="12" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="6" y1="21" x2="12" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="2" y1="9" x2="12" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/></svg>`;
    }
    if (index === 2) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><polygon points="12,6 17,9 17,15 12,18 7,15 7,9" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/><line x1="12" y1="2" x2="12" y2="6" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="21" y1="7" x2="17" y2="9" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="21" y1="17" x2="17" y2="15" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="12" y1="22" x2="12" y2="18" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="3" y1="17" x2="7" y2="15" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="3" y1="7" x2="7" y2="9" stroke="#fff" stroke-width="1" opacity="0.6"/></svg>`;
    }
    if (index === 3) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 19,5 22,12 19,19 12,22 5,19 2,12 5,5" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/><line x1="12" y1="2" x2="12" y2="7" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="22" y1="12" x2="17" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="12" y1="22" x2="12" y2="17" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="2" y1="12" x2="7" y2="12" stroke="#fff" stroke-width="1" opacity="0.6"/></svg>`;
    }
    if (index === 4) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 20,4 22,11 17,20 7,20 2,11 4,4" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="11" r="4" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/><line x1="12" y1="2" x2="12" y2="7" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="20" y1="4" x2="15" y2="9" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="22" y1="11" x2="16" y2="11" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="17" y1="20" x2="14" y2="15" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="7" y1="20" x2="10" y2="15" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="2" y1="11" x2="8" y2="11" stroke="#fff" stroke-width="1" opacity="0.6"/><line x1="4" y1="4" x2="9" y2="9" stroke="#fff" stroke-width="1" opacity="0.6"/></svg>`;
    }
    if (index === 5) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/><line x1="12" y1="2" x2="12" y2="22" stroke="#fff" stroke-width="1" opacity="0.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="#fff" stroke-width="1" opacity="0.5"/><line x1="5" y1="5" x2="19" y2="19" stroke="#fff" stroke-width="1" opacity="0.5"/><line x1="5" y1="19" x2="19" y2="5" stroke="#fff" stroke-width="1" opacity="0.5"/></svg>`;
    }
    if (index === 6) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/><polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" fill="none" stroke="#fff" stroke-width="1" opacity="0.7"/></svg>`;
    }
    if (index === 7) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 15,6 20,6 18,10 22,13 18,16 20,20 15,20 12,24 9,20 4,20 6,16 2,13 6,10 4,6 9,6" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="13" r="5" fill="none" stroke="#fff" stroke-width="1" opacity="0.7"/></svg>`;
    }
    if (index === 8) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,2 16,8 22,9 17,14 18,20 12,17 6,20 7,14 2,9 8,8" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><polygon points="12,6 14,10 18,10 15,13 16,17 12,15 8,17 9,13 6,10 10,10" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.6"/></svg>`;
    }
    if (index === 9) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="12,4 16,10 22,11 17,16 18,22 12,19 6,22 7,16 2,11 8,10" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><polygon points="12,0 15,3 12,6 9,3" fill="${colors[index]}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="14" r="3" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.7"/></svg>`;
    }
    // Locked circles (11 and 12)
    return `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" fill="none" stroke="${colors[index]}" stroke-width="2"/></svg>`;
  }

  const levelGrid = document.getElementById('level-grid');
  if (levelGrid) {
    let html = '';
    for (let i = 0; i < 12; i++) {
      const svg = getGemstoneSVG(i);
      if (i >= 10) {
        html += `<div class="level-gem locked" title="Terkunci">${svg}</div>`;
      } else {
        html += `<div class="level-gem" title="Level ${i + 1}">${svg}</div>`;
      }
    }
    levelGrid.innerHTML = html;
  }

  /* ══════════════════════════════════
     STREAK DAYS
  ══════════════════════════════════ */
  const streakDays = document.getElementById('streak-days');
  const days = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mn'];
  if (streakDays) {
    streakDays.innerHTML = days.map((d, i) => {
      const active = i < 5; // Mon-Fri active
      return `<div class="streak-day ${active ? 'active' : ''}">
            <div class="fire">${active ? '🔥' : ''}</div>
            <div class="num">${d}</div>
          </div>`;
    }).join('');
  }

  /* ══════════════════════════════════
     WELCOME ANIMATION LOGIC
  ══════════════════════════════════ */
  // Flow orchestration is now handled by js/core/flow-manager.js

  /* ══════════════════════════════════
     UPLOAD MODAL LOGIC
  ══════════════════════════════════ */
  const openUploadBtn = document.getElementById('open-upload-btn');
  const uploadModal = document.getElementById('upload-modal-overlay');
  const closeUploadBtn = document.getElementById('close-upload-modal');
  const fileInput = document.getElementById('file-input');
  const dropzone = document.getElementById('dropzone');
  const pillUploadBtn = document.getElementById('pill-upload-file');

  function openUploadModal() {
    if (uploadModal) uploadModal.classList.add('open');
  }

  function closeUploadModal() {
    if (uploadModal) uploadModal.classList.remove('open');
  }

  if (openUploadBtn) openUploadBtn.addEventListener('click', openUploadModal);
  if (closeUploadBtn) closeUploadBtn.addEventListener('click', closeUploadModal);

  if (uploadModal) {
    uploadModal.addEventListener('click', (e) => {
      if (e.target === uploadModal) closeUploadModal();
    });
  }

  // Trigger file input
  if (dropzone) {
    dropzone.addEventListener('click', () => fileInput.click());
  }
  if (pillUploadBtn) {
    pillUploadBtn.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        console.log('Files selected:', files);
        // Here you would normally handle the upload
        closeUploadModal();
        // Optional: show a toast or notification
      }
    });
  }
  /* ══════════════════════════════════
     LEAGUE COUNTDOWN TIMER
  ══════════════════════════════════ */
  function updateLeagueCountdown() {
    const countdownEl = document.getElementById('league-reset-timer');
    if (!countdownEl) return;

    const now = new Date();
    const end = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000));

    function tick() {
      const diff = end - new Date();
      if (diff <= 0) {
        countdownEl.textContent = 'Liga Berakhir!';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      countdownEl.innerHTML = 'Reset: <b>' + d + 'h ' + h + 'j ' + m + 'm ' + s + 's</b>';
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ══════════════════════════════════
     LEVEL & BADGES MODAL INTERACTION
   ══════════════════════════════════ */
  const cardLevel = document.getElementById('card-level-bulanan');
  const cardBadges = document.getElementById('card-lencana');
  const levelOverlay = document.getElementById('level-modal-overlay');
  const badgesOverlay = document.getElementById('badges-modal-overlay');
  const closeLevelBtn = document.getElementById('close-level-modal');
  const closeBadgesBtn = document.getElementById('close-badges-modal');
  const levelGotItBtn = document.getElementById('btn-level-got-it');
  const badgesGotItBtn = document.getElementById('btn-badges-got-it');

  function openModal(modal) {
    if (modal) modal.classList.add('open');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('open');
  }

  if (cardLevel) cardLevel.addEventListener('click', () => openModal(levelOverlay));
  if (cardBadges) cardBadges.addEventListener('click', () => openModal(badgesOverlay));

  if (closeLevelBtn) closeLevelBtn.addEventListener('click', () => closeModal(levelOverlay));
  if (closeBadgesBtn) closeBadgesBtn.addEventListener('click', () => closeModal(badgesOverlay));

  if (levelGotItBtn) levelGotItBtn.addEventListener('click', () => closeModal(levelOverlay));
  if (badgesGotItBtn) badgesGotItBtn.addEventListener('click', () => closeModal(badgesOverlay));

  if (levelOverlay) {
    levelOverlay.addEventListener('click', (e) => {
      if (e.target === levelOverlay) closeModal(levelOverlay);
    });
  }
  if (badgesOverlay) {
    badgesOverlay.addEventListener('click', (e) => {
      if (e.target === badgesOverlay) closeModal(badgesOverlay);
    });
  }

  updateLeagueCountdown();
});
