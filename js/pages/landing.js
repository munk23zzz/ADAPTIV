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

    // 3. Typewriter Effect
    const typeTarget = document.getElementById('typewriter-output');
    if (typeTarget) {
        const texts = [
            "Analisis dokumen...",
            "Ekstraksi konsep kunci...",
            "Membuat kartu belajar...",
            "Menyiapkan kuis personal...",
            "Sistem siap. Mari belajar!"
        ];
        let textIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        const prefix = "adaptiv@ai:~$ ";
        const type = () => {
            const current = texts[textIdx];
            if (isDeleting) {
                typeTarget.textContent = prefix + current.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typeTarget.textContent = prefix + current.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 50 : 100;
            if (!isDeleting && charIdx === current.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                textIdx = (textIdx + 1) % texts.length;
                speed = 500;
            }
            setTimeout(type, speed);
        };
        type();
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
            const cardWidth = getCardWidth();
            // Calculate active index based on scroll position
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

        // Pause auto-scroll on hover/touch interactions to protect readability
        testiGrid.addEventListener('mouseenter', () => {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
        });
        testiGrid.addEventListener('mouseleave', () => {
            startAutoScroll();
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