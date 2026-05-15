/* ═══════════════ PODCAST LOGIC ═══════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('play-btn');
    const playIcon = playBtn.querySelector('.material-icons-round');
    const coverArt = document.getElementById('cover-art');
    const visualizer = document.getElementById('visualizer');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const speedBtn = document.getElementById('speed-btn');
    const utterances = document.querySelectorAll('.utterance');
    const transcriptContent = document.getElementById('transcript-content');

    let isPlaying = false;
    let currentTime = 0;
    const duration = 522; // 8:42 in seconds
    let playbackSpeed = 1;
    let progressInterval;

    // ── Play/Pause ──
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playIcon.textContent = 'pause';
            coverArt.classList.add('playing');
            visualizer.classList.add('active');
            startProgress();
        } else {
            playIcon.textContent = 'play_arrow';
            coverArt.classList.remove('playing');
            visualizer.classList.remove('active');
            stopProgress();
        }
    }

    playBtn.addEventListener('click', togglePlay);

    // ── Progress Logic ──
    function startProgress() {
        progressInterval = setInterval(() => {
            currentTime += playbackSpeed;
            if (currentTime >= duration) {
                currentTime = duration;
                togglePlay();
                clearInterval(progressInterval);
            }
            updateUI();
        }, 1000);
    }

    function stopProgress() {
        clearInterval(progressInterval);
    }

    function updateUI() {
        const percent = (currentTime / duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        syncTranscript();
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ── Transcript Sync ──
    function syncTranscript() {
        let activeIndex = -1;
        utterances.forEach((u, i) => {
            const startTime = parseInt(u.dataset.time);
            if (currentTime >= startTime) {
                activeIndex = i;
            }
        });

        if (activeIndex !== -1) {
            utterances.forEach((u, i) => {
                if (i === activeIndex) {
                    u.classList.add('active');
                    // Scroll to active utterance smoothly
                    if (!isElementInViewport(u, transcriptContent)) {
                        u.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    u.classList.remove('active');
                }
            });
        }
    }

    function isElementInViewport(el, parent) {
        const rect = el.getBoundingClientRect();
        const pRect = parent.getBoundingClientRect();
        return (
            rect.top >= pRect.top &&
            rect.bottom <= pRect.bottom
        );
    }

    // ── Seek ──
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentTime = percent * duration;
        updateUI();
    });

    // ── Speed Control ──
    speedBtn.addEventListener('click', () => {
        const speeds = [1, 1.2, 1.5, 2];
        let idx = speeds.indexOf(playbackSpeed);
        idx = (idx + 1) % speeds.length;
        playbackSpeed = speeds[idx];
        speedBtn.textContent = `${playbackSpeed}x`;
    });

    // ── Controls ──
    document.getElementById('rewind-btn').addEventListener('click', () => {
        currentTime = Math.max(0, currentTime - 15);
        updateUI();
    });

    document.getElementById('forward-btn').addEventListener('click', () => {
        currentTime = Math.min(duration, currentTime + 15);
        updateUI();
    });

    // Handle URL params for document title and view modes
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('doc');
    const view = params.get('view');

    if (docId) {
        // In a real app, we'd fetch the doc name. Here we simulate.
        const titles = {
            'doc-001': 'Modul Sistem Operasi.pdf',
            'doc-002': 'Bab3 Kimia Organik.pdf',
            'doc-003': 'Slide Algoritma Sorting.pptx'
        };
        if (titles[docId]) {
            document.getElementById('doc-title').textContent = titles[docId];
        }
    }

    if (view) {
        const typeEl = document.getElementById('doc-type');
        if (view === 'customizer') {
            typeEl.textContent = 'Podcast Studio — Customizing...';
        } else if (view === 'library') {
            typeEl.textContent = 'Podcast Library — Recent Sessions';
        } else if (view === 'transcript') {
            typeEl.textContent = 'Audio Transcript — Detailed View';
        }
    }
});
