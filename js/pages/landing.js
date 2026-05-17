// LANDING PAGE LOGIC

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('btn-back-to-top');
    
    window.addEventListener('scroll', () => {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 1.5 Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('.material-icons-round');
            icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.querySelector('.material-icons-round').textContent = 'menu';
            });
        });
    }

    // 2. Reveal on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        reveals.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

// 3. Typewriter Effect — Multi-line terminal
const termBody = document.getElementById('term-text');
if (termBody) {
    const steps = [
        { text: "Membaca dokumen PDF...",           status: "process" },
        { text: "Ekstraksi konsep kunci selesai.",  status: "success" },
        { text: "Membuat kartu belajar adaptif...", status: "process" },
        { text: "Kartu siap: 24 item dibuat.",      status: "success" },
        { text: "Menyiapkan kuis personal...",      status: "process" },
        { text: "Sistem siap. Mari belajar! 🚀",    status: "done"    },
    ];

    const prefix = "adaptiv@ai:~$ ";
    let stepIdx = 0;

    const colorMap = {
        process: "var(--term-text-process)",
        success: "var(--term-text-success)",
        done:    "var(--term-text-done)",
    };

    function typeStep(step, callback) {
        const line = document.createElement('div');
        line.style.cssText = `
            display: flex; gap: 8px; align-items: flex-start;
            margin-bottom: 6px; font-size: 1rem; line-height: 1.6;
        `;

        const prefixSpan = document.createElement('span');
        prefixSpan.textContent = prefix;
        prefixSpan.style.color = "var(--accent-primary)";
        prefixSpan.style.flexShrink = "0";

        const textSpan = document.createElement('span');
        textSpan.style.color = colorMap[step.status];

        const cursor = document.createElement('span');
        cursor.style.cssText = `
            display: inline-block; width: 8px; height: 1em;
            background: var(--accent-primary); margin-left: 3px;
            vertical-align: middle; animation: blink 1s step-end infinite;
        `;

        line.appendChild(prefixSpan);
        line.appendChild(textSpan);
        line.appendChild(cursor);
        termBody.appendChild(line);

        let i = 0;
        const interval = setInterval(() => {
            textSpan.textContent = step.text.substring(0, i + 1);
            i++;
            if (i === step.text.length) {
                clearInterval(interval);
                cursor.remove();

                if (step.status === "success") {
                    const badge = document.createElement('span');
                    badge.textContent = " ✓";
                    badge.style.color = "var(--term-text-success)";
                    badge.style.fontWeight = "700";
                    textSpan.appendChild(badge);
                } else if (step.status === "done") {
                    const badge = document.createElement('span');
                    badge.textContent = " ✓ DONE";
                    badge.style.cssText = "color: var(--term-text-done); font-weight:700; margin-left:8px;";
                    textSpan.appendChild(badge);

                    setTimeout(() => {
                        const barWrap = document.createElement('div');
                        barWrap.style.cssText = `
                            margin-top: 16px; 
                            background: var(--term-bg-bar); 
                            border-radius: 4px; height: 6px; overflow: hidden;
                        `;
                        const bar = document.createElement('div');
                        bar.style.cssText = `
                            height: 100%; width: 0%;
                            background: linear-gradient(90deg, var(--accent-primary), #a78bfa);
                            border-radius: 4px;
                            transition: width 1.8s cubic-bezier(0.4,0,0.2,1);
                        `;
                        barWrap.appendChild(bar);
                        termBody.appendChild(barWrap);
                        requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = "100%"));
                    }, 300);
                }

                setTimeout(callback, step.status === "process" ? 300 : 600);
            }
        }, 45);
    }

    function runTerminal() {
        termBody.innerHTML = "";
        stepIdx = 0;

        function next() {
            if (stepIdx < steps.length) {
                typeStep(steps[stepIdx], () => {
                    stepIdx++;
                    next();
                });
            } else {
                setTimeout(runTerminal, 4000);
            }
        }
        next();
    }

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runTerminal();
            observer.disconnect();
        }
    });
}, { threshold: 0.3 });

observer.observe(termBody);
}

    // 4. Hero Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    
    const animateSingleStat = (stat) => {
        const target = parseInt(stat.getAttribute('data-target'));
        const suffix = stat.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const count = () => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out expo
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(easedProgress * target);
            
            stat.textContent = currentValue.toLocaleString() + suffix;

            if (frame < totalFrames) {
                requestAnimationFrame(count);
            } else {
                stat.textContent = target.toLocaleString() + suffix;
            }
        };
        count();
    };

    const animateAllStats = () => {
        stats.forEach(stat => animateSingleStat(stat));
    };

    // Intersection Observer for stats
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateAllStats();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }
    // 5. Testimonial Carousel
    const testiGrid = document.getElementById('testiGrid');
    const dots = document.querySelectorAll('.dot');
    
    if (testiGrid && dots.length > 0) {
        let currentIndex = 0;
        let autoScrollTimer = null;

        // Drag-to-scroll variables
        let isDown = false;
        let startX = 0;
        let scrollLeftVal = 0;

        const getCardWidth = () => {
            const card = testiGrid.querySelector('.testi-card');
            return card ? card.offsetWidth + 32 : 412; // 380px card + 32px gap
        };

        const updateDots = (index) => {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Scroll listener to sync active dot during manual scrolls
        testiGrid.addEventListener('scroll', () => {
            if (isDown) return; // Ignore snap-calculations during active drag
            const cardWidth = getCardWidth();
            const index = Math.round(testiGrid.scrollLeft / cardWidth);
            if (index >= 0 && index < dots.length) {
                currentIndex = index;
                updateDots(currentIndex);
            }
        });

        const scrollToCard = (index) => {
            const cardWidth = getCardWidth();
            testiGrid.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        };

        // Manual dot clicks
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                scrollToCard(index);
                resetAutoScroll(); // Reset timer on user interaction
            });
        });

        // Automatic sliding loop
        const startAutoScroll = () => {
            if (isDown) return;
            autoScrollTimer = setInterval(() => {
                currentIndex = (currentIndex + 1) % dots.length;
                scrollToCard(currentIndex);
            }, 4000); // Shift every 4 seconds
        };

        const resetAutoScroll = () => {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
            }
            startAutoScroll();
        };

        // Mouse Drag to Scroll (Swap Kanan/Kiri via Cursor)
        testiGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            testiGrid.classList.add('grabbing');
            startX = e.pageX - testiGrid.offsetLeft;
            scrollLeftVal = testiGrid.scrollLeft;
            
            // Clear auto-scroll on active drag
            if (autoScrollTimer) clearInterval(autoScrollTimer);
        });

        const snapToNearestCard = () => {
            const cardWidth = getCardWidth();
            const index = Math.round(testiGrid.scrollLeft / cardWidth);
            scrollToCard(index);
        };

        testiGrid.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                testiGrid.classList.remove('grabbing');
                snapToNearestCard();
            }
            startAutoScroll();
        });

        testiGrid.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                testiGrid.classList.remove('grabbing');
                snapToNearestCard();
            }
            startAutoScroll();
        });

        testiGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testiGrid.offsetLeft;
            const walk = (x - startX) * 1.5; // Drag speed multiplier
            testiGrid.scrollLeft = scrollLeftVal - walk;
        });

        // Pause auto-scroll on hover/touch interactions to protect readability
        testiGrid.addEventListener('mouseenter', () => {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
        });
        testiGrid.addEventListener('touchstart', () => {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
        }, { passive: true });
        testiGrid.addEventListener('touchend', () => {
            startAutoScroll();
        }, { passive: true });

        // Start initial auto scroll
        startAutoScroll();
    }
});
