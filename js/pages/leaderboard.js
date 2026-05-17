/**
 * ADAPTIV AI - Leaderboard Logic (User Version)
 */

document.addEventListener('DOMContentLoaded', () => {
  const leaderboardList = document.getElementById('leaderboardList');
  const podiumSection = document.getElementById('podiumSection');
  const leagueTabs = document.getElementById('leagueTabs');
  const stickyUserBar = document.getElementById('stickyUserBar');
  const countdownEl = document.getElementById('league-countdown');
  const promotionBanner = document.querySelector('.zone-promotion-banner');
  const demotionBanner = document.querySelector('.zone-demotion-banner');

  // Konfigurasi Zona (Sesuai Permintaan: Top 5 & Bottom 5)
  const PROMOTION_ZONE_LIMIT = 5;
  const DEMOTION_ZONE_START = 16; // Untuk 20 orang, 16-20 adalah Bottom 5

  // Data Papan Peringkat Statis (Sinkron dengan Halaman Dashboard)
  const datasets = {
    weekly: [
      { rank: 1, name: "Sarah", timeInMinutes: 785 },
      { rank: 2, name: "Budi", timeInMinutes: 742 },
      { rank: 3, name: "Reza", timeInMinutes: 695 },
      { rank: 4, name: "Loid", timeInMinutes: 630, isCurrentUser: true },
      { rank: 5, name: "Alex", timeInMinutes: 580 },
      { rank: 6, name: "Dina", timeInMinutes: 540 },
      { rank: 7, name: "Ahmad", timeInMinutes: 510 },
      { rank: 8, name: "Rina", timeInMinutes: 480 },
      { rank: 9, name: "Jessica", timeInMinutes: 420 },
      { rank: 10, name: "Kevin", timeInMinutes: 380 },
      { rank: 11, name: "Putri", timeInMinutes: 350 },
      { rank: 12, name: "Doni", timeInMinutes: 320 },
      { rank: 13, name: "Siska", timeInMinutes: 300 },
      { rank: 14, name: "Galih", timeInMinutes: 280 },
      { rank: 15, name: "Toni", timeInMinutes: 250 },
      { rank: 16, name: "Bruce", timeInMinutes: 220 },
      { rank: 17, name: "Clark", timeInMinutes: 200 },
      { rank: 18, name: "Diana", timeInMinutes: 180 },
      { rank: 19, name: "Peter", timeInMinutes: 150 },
      { rank: 20, name: "Barry", timeInMinutes: 120 }
    ],
    monthly: [
      { rank: 1, name: "Alex", timeInMinutes: 2850 },
      { rank: 2, name: "Sarah", timeInMinutes: 2740 },
      { rank: 3, name: "Budi", timeInMinutes: 2610 },
      { rank: 4, name: "Jessica", timeInMinutes: 2450 },
      { rank: 5, name: "Loid", timeInMinutes: 2310, isCurrentUser: true },
      { rank: 6, name: "Kevin", timeInMinutes: 2180 },
      { rank: 7, name: "Dina", timeInMinutes: 2050 },
      { rank: 8, name: "Rina", timeInMinutes: 1920 },
      { rank: 9, name: "Ahmad", timeInMinutes: 1840 },
      { rank: 10, name: "Reza", timeInMinutes: 1760 },
      { rank: 11, name: "Putri", timeInMinutes: 1650 },
      { rank: 12, name: "Doni", timeInMinutes: 1540 },
      { rank: 13, name: "Siska", timeInMinutes: 1430 },
      { rank: 14, name: "Galih", timeInMinutes: 1320 },
      { rank: 15, name: "Toni", timeInMinutes: 1210 }
    ],
    all: [
      { rank: 1, name: "Budi", timeInMinutes: 14200 },
      { rank: 2, name: "Sarah", timeInMinutes: 13800 },
      { rank: 3, name: "Alex", timeInMinutes: 12900 },
      { rank: 4, name: "Reza", timeInMinutes: 11500 },
      { rank: 5, name: "Jessica", timeInMinutes: 10800 },
      { rank: 6, name: "Dina", timeInMinutes: 9800 },
      { rank: 7, name: "Loid", timeInMinutes: 9240, isCurrentUser: true },
      { rank: 8, name: "Kevin", timeInMinutes: 8700 },
      { rank: 9, name: "Ahmad", timeInMinutes: 8100 },
      { rank: 10, name: "Rina", timeInMinutes: 7500 },
      { rank: 11, name: "Putri", timeInMinutes: 6900 },
      { rank: 12, name: "Doni", timeInMinutes: 6300 },
      { rank: 13, name: "Siska", timeInMinutes: 5700 },
      { rank: 14, name: "Galih", timeInMinutes: 5100 },
      { rank: 15, name: "Toni", timeInMinutes: 4500 }
    ]
  };

  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}j <span>${minutes}m</span>`;
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  function renderLeaderboard(datasetKey) {
    const data = datasets[datasetKey];
    const sortedData = [...data].sort((a, b) => b.timeInMinutes - a.timeInMinutes);
    const maxTime = sortedData[0].timeInMinutes;
    const isWeekly = datasetKey === 'weekly';

    // Tampilkan/Sembunyikan Banner Zona (Hanya di Minggu Ini)
    if (promotionBanner && demotionBanner) {
      promotionBanner.style.display = isWeekly ? 'flex' : 'none';
      demotionBanner.style.display = isWeekly ? 'flex' : 'none';
    }

    // 1. Render Podium (Top 3)
    const top3 = sortedData.slice(0, 3);
    podiumSection.innerHTML = top3.map((user, index) => {
      const rank = index + 1;
      return `
        <div class="podium-item rank-${rank}">
          ${rank === 1 ? '<span class="crown-badge">👑</span>' : ''}
          <div class="podium-avatar-wrap">
            <div class="podium-avatar">${getInitials(user.name)}</div>
            <span class="podium-badge">${rank}</span>
          </div>
          <div class="podium-name">${user.name}</div>
          <div class="podium-time">${formatTime(user.timeInMinutes)}</div>
          <div class="podium-column">
            <span class="podium-number">${rank}</span>
          </div>
        </div>
      `;
    }).join('');

    // 2. Render List (Remaining)
    const remaining = sortedData.slice(3);
    leaderboardList.innerHTML = remaining.map((user, index) => {
      const rank = index + 4;
      const progress = (user.timeInMinutes / maxTime) * 100;
      
      // Zona hanya aktif di Minggu Ini
      let zoneClass = '';
      let zoneIndicator = '';
      if (isWeekly) {
        if (rank <= PROMOTION_ZONE_LIMIT) {
          zoneClass = 'zone-up';
          zoneIndicator = '<span class="zone-badge badge-up"><span class="material-icons-round">arrow_upward</span></span>';
        } else if (rank >= DEMOTION_ZONE_START) {
          zoneClass = 'zone-down';
          zoneIndicator = '<span class="zone-badge badge-down"><span class="material-icons-round">arrow_downward</span></span>';
        } else {
          zoneClass = 'zone-stay';
          zoneIndicator = '<span class="zone-badge badge-stay"><span class="material-icons-round">remove</span></span>';
        }
      }

      const userClass = user.isCurrentUser ? 'is-current-user' : '';
      const nameHighlight = user.isCurrentUser ? 'highlight' : '';

      return `
        <li class="board-item ${zoneClass} ${userClass}" id="${user.isCurrentUser ? 'current-user-row' : ''}">
          <div class="rank-container">
            <div class="rank-number">${rank}</div>
            ${zoneIndicator}
          </div>
          <div class="avatar">${getInitials(user.name)}</div>
          <div class="user-progress-container">
            <div class="user-main-info">
              <div class="user-name ${nameHighlight}">${user.name}</div>
              ${user.isCurrentUser ? '<span class="user-you-tag">Kamu</span>' : ''}
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>
          <div class="metric-time">
            ${formatTime(user.timeInMinutes)}
          </div>
        </li>
      `;
    }).join('');

    // Update Sticky Bar Data
    const currentUser = sortedData.find(u => u.isCurrentUser);
    if (currentUser) {
      const rank = sortedData.indexOf(currentUser) + 1;
      stickyUserBar.querySelector('.sticky-rank').textContent = `#${rank}`;
      stickyUserBar.querySelector('.sticky-name').textContent = currentUser.name;
      stickyUserBar.querySelector('.sticky-time').innerHTML = formatTime(currentUser.timeInMinutes);
      stickyUserBar.querySelector('.sticky-avatar').textContent = getInitials(currentUser.name);
    }

    setupIntersectionObserver();
  }

  // Tab Switching
  leagueTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
      leagueTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderLeaderboard(e.target.dataset.tab);
    }
  });

  // Sticky Bar Logic
  function setupIntersectionObserver() {
    const userRow = document.getElementById('current-user-row');
    if (!userRow) return;

    // Bersihkan observer lama jika ada
    if (window.leaderboardObserver) window.leaderboardObserver.disconnect();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyUserBar.classList.remove('visible');
        } else {
          if (entry.boundingClientRect.top < 0) {
            stickyUserBar.classList.add('visible');
          } else {
             stickyUserBar.classList.remove('visible');
          }
        }
      });
    }, { threshold: 0 });

    observer.observe(userRow);
    window.leaderboardObserver = observer;
  }

  // Countdown Timer
  function updateCountdown() {
    const now = new Date();
    const end = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000));
    
    function tick() {
      const diff = end - new Date();
      if (diff <= 0) {
        countdownEl.innerHTML = "Liga Berakhir!";
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      countdownEl.innerHTML = `Berakhir dalam: <span>${d}h ${h}j ${m}m ${s}d</span>`;
    }

    tick();
    setInterval(tick, 1000);
  }

  // Initial Render (Default: weekly)
  renderLeaderboard('weekly');
  updateCountdown();
});
