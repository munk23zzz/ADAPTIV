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
    const chartData = [
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
    ];

    const tooltip = document.getElementById('chart-tooltip');
    const chartWrap = document.getElementById('chart-wrap');

    function renderChart() {
      const svg = document.getElementById('perf-chart');
      if (!svg) return;

      const W = 560, H = 155, padL = 24, padR = 10, padT = 14, padB = 24;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;
      const maxH = 12;
      const n = chartData.length;
      const barW = (innerW / n) * 0.55;
      const gap = (innerW / n) * 0.45;

      let html = '';

      // Grid lines
      [0, 3, 6, 9, 12].forEach(v => {
        const y = padT + innerH - (v / maxH) * innerH;
        html += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
        if (v > 0) html += `<text class="chart-label" x="${padL - 4}" y="${y + 3.5}" text-anchor="end">${v}</text>`;
      });

      chartData.forEach((d, i) => {
        const x = padL + i * (innerW / n) + gap / 2;
        const barH = (d.h / maxH) * innerH;
        const y = padT + innerH - barH;
        const isToday = i === chartData.length - 1;
        const opacity = isToday ? '1' : '0.72';

        const rectId = `bar-${i}`;
        html += `<rect class="chart-bar${isToday ? ' today' : ''}" id="${rectId}"
          x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" ry="3"
          opacity="${opacity}"
          data-date="${d.date}" data-h="${d.h}j"
          />`;

        if (i % 2 === 0) {
          html += `<text class="chart-label" x="${x + barW / 2}" y="${H - 6}" text-anchor="middle">${d.date}</text>`;
        }
      });

      svg.innerHTML = html;

      // Add event listeners after innerHTML set
      chartData.forEach((d, i) => {
          const rect = document.getElementById(`bar-${i}`);
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

    renderChart();

    /* ══════════════════════════════════
       LEADERBOARD DATA
    ══════════════════════════════════ */
    const lbData = [
      { rank: 1, name: 'RizkyAlfaz', time: '52j 10m', zone: 'up', initials: 'RA', alt: 'alt2' },
      { rank: 2, name: 'SariWulandari', time: '48j 30m', zone: 'up', initials: 'SW', alt: 'alt3' },
      { rank: 3, name: 'FaisalHakim', time: '41j 55m', zone: 'up', initials: 'FH', alt: 'alt1' },
      { rank: 4, name: 'NabilK', time: '30j 45m', zone: 'up', initials: 'NK', alt: '', mine: true },
      { rank: 5, name: 'AyuPratiwi', time: '29j 20m', zone: 'safe', initials: 'AP', alt: 'alt2' },
      { rank: 6, name: 'BimaNugraha', time: '24j 10m', zone: 'safe', initials: 'BN', alt: 'alt3' },
      { rank: 7, name: 'CindySirait', time: '21j 45m', zone: 'safe', initials: 'CS', alt: 'alt1' },
      { rank: 8, name: 'DewiRahayu', time: '18j 30m', zone: 'down', initials: 'DR', alt: '' },
      { rank: 9, name: 'EkoSantoso', time: '15j 20m', zone: 'down', initials: 'ES', alt: 'alt2' },
      { rank: 10, name: 'FitriAndini', time: '12j 05m', zone: 'down', initials: 'FA', alt: 'alt3' },
    ];

    function renderLeaderboard() {
      const zoneLabel = { up: '▲ Promosi', safe: '● Aman', down: '▼ Degradasi' };
      const list = document.getElementById('lb-list');
      if (!list) return;

      list.innerHTML = lbData.map(d => `
        <div class="lb-item${d.mine ? ' mine' : ''}">
          <div class="lb-rank${d.rank <= 3 ? ' top' : ''}">${d.rank <= 3 ? ['🥇', '🥈', '🥉'][d.rank - 1] : d.rank}</div>
          <div class="lb-avatar ${d.alt}">${d.initials}</div>
          <div class="lb-name">${d.name}</div>
          <div class="lb-time">${d.time}</div>
          <div class="lb-zone lb-zone--${d.zone}">${zoneLabel[d.zone]}</div>
        </div>
      `).join('');
    }

    renderLeaderboard();

    const tabMonthly = document.getElementById('tab-monthly');
    const tabWeekly = document.getElementById('tab-weekly');

    if (tabMonthly) {
        tabMonthly.addEventListener('click', () => {
          tabMonthly.classList.add('active');
          tabWeekly.classList.remove('active');
        });
    }
    if (tabWeekly) {
        tabWeekly.addEventListener('click', () => {
          tabWeekly.classList.add('active');
          tabMonthly.classList.remove('active');
        });
    }

    /* ══════════════════════════════════
       MONTHLY LEVEL GEMS
    ══════════════════════════════════ */
    const gems = ['💜', '💙', '💎', '🩵', '💚', '💛', '🧡', '🔥', '✨', '💫', '○', '○'];
    const levelGrid = document.getElementById('level-grid');
    if (levelGrid) {
        levelGrid.innerHTML = gems.map((g, i) =>
          g === '○'
            ? `<div class="level-gem locked" title="Terkunci">🔒</div>`
            : `<div class="level-gem" title="Level ${i + 1}">${g}</div>`
        ).join('');
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
});