// LANDING PAGE LOGIC

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
            "Membuat flashcard...",
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
        testiGrid.addEventListener('scroll', () => {
            const index = Math.round(testiGrid.scrollLeft / (testiGrid.offsetWidth / 2));
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                const cardWidth = testiGrid.querySelector('.testi-card').offsetWidth + 32; // card + gap
                testiGrid.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
            });
        });
    }
});