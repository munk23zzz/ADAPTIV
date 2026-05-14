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

  // Helper untuk generate mock data lebih banyak
  function generateMockData(count, userRank = 3, timeRange = [500, 2000]) {
    const names = [
      "Sarah Wijaya", "Budi Santoso", "Nabil Kurniawan", "Alex Chen", "Dina Fitri",
      "Kevin Julio", "Rina Kusuma", "Ahmad Fauzi", "Jessica Lin", "Reza Rahadian",
      "Putri Andini", "Doni Pratama", "Siska Saraswati", "Galih Purnama", "Toni Stark",
      "Bruce Wayne", "Clark Kent", "Diana Prince", "Peter Parker", "Barry Allen"
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: names[i] || `User ${i + 1}`,
      timeInMinutes: Math.floor(Math.random() * (timeRange[1] - timeRange[0])) + timeRange[0],
      isCurrentUser: (i + 1) === userRank
    })).sort((a, b) => b.timeInMinutes - a.timeInMinutes);
  }

  // Data Mocking
  const datasets = {
    weekly: generateMockData(20, 12, [300, 800]), // 20 Orang untuk Minggu Ini
    monthly: generateMockData(15, 5, [1000, 3000]),
    all: generateMockData(15, 8, [5000, 15000])
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
        <div class="podium-item">
          ${rank === 1 ? '<span class="crown-badge">👑</span>' : ''}
          <div class="podium-avatar-wrap">
            <div class="podium-avatar">${getInitials(user.name)}</div>
          </div>
          <div class="podium-name">${user.name}</div>
          <div class="podium-time">${formatTime(user.timeInMinutes)}</div>
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
      if (isWeekly) {
        if (rank <= PROMOTION_ZONE_LIMIT) zoneClass = 'zone-up';
        else if (rank >= DEMOTION_ZONE_START) zoneClass = 'zone-down';
        else zoneClass = 'zone-stay';
      }

      const userClass = user.isCurrentUser ? 'is-current-user' : '';
      const nameHighlight = user.isCurrentUser ? 'highlight' : '';

      return `
        <li class="board-item ${zoneClass} ${userClass}" id="${user.isCurrentUser ? 'current-user-row' : ''}">
          <div class="rank-number">${rank}</div>
          <div class="avatar">${getInitials(user.name)}</div>
          <div class="user-progress-container">
            <div class="user-main-info">
              <div class="user-name ${nameHighlight}">${user.name}</div>
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

      countdownEl.innerHTML = `Berakhir dalam: <span>${d}h ${h}j ${m}m ${s}s</span>`;
    }

    tick();
    setInterval(tick, 1000);
  }

  // Initial Render (Default: weekly)
  renderLeaderboard('weekly');
  updateCountdown();
});
