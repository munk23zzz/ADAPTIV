document.addEventListener('DOMContentLoaded', function() {
            
            // 1. Navbar Scroll Effect
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 80) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // 2. Mobile Menu Toggle
            const mobileBtn = document.getElementById('mobileMenuBtn');
            const navLinks = document.getElementById('navLinks');
            const body = document.body;
            
            function toggleMenu() {
                const isActive = navLinks.classList.contains('active');
                if (isActive) {
                    navLinks.classList.remove('active');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                } else {
                    navLinks.classList.add('active');
                    mobileBtn.setAttribute('aria-expanded', 'true');
                    body.style.overflow = 'hidden';
                }
            }
            
            mobileBtn.addEventListener('click', toggleMenu);
            
            // Close mobile menu when a link is clicked
            const links = navLinks.querySelectorAll('a');
            links.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (navLinks.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            });

            // 3. Smooth Scroll for Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                });
            });

            // 4. Reveal Animations & Number Counters (Intersection Observer)
            const revealElements = document.querySelectorAll('.reveal');
            const statNumbers = document.querySelectorAll('.stat-number');
            
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15
            };

            const observer = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Trigger number counter if it's a stat block
                        if (entry.target.classList.contains('hero-text')) {
                            statNumbers.forEach(function(stat) {
                                animateValue(stat);
                            });
                        }
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(function(el) {
                observer.observe(el);
            });

            function animateValue(obj) {
                const target = parseInt(obj.getAttribute('data-target'));
                const suffix = obj.getAttribute('data-suffix') || '';
                const duration = 2000;
                let startTimestamp = null;
                const step = function(timestamp) {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const current = Math.floor(progress * target);
                    
                    // Format number with commas
                    obj.textContent = current.toLocaleString('en-US') + (target === 10000 || target === 500000 ? '+' : '') + suffix;
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        obj.textContent = target.toLocaleString('en-US') + (target === 10000 || target === 500000 ? '+' : '') + suffix;
                    }
                };
                window.requestAnimationFrame(step);
            }

            // 5. Testimonial Mobile Carousel
            const testiCards = document.querySelectorAll('.testi-card');
            const dots = document.querySelectorAll('.carousel-dots .dot');
            let currentTesti = 0;
            let testiInterval;

            function showTestimonial(index) {
                if (window.innerWidth > 768) return; // Only apply on mobile
                
                testiCards.forEach(c => c.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                
                testiCards[index].classList.add('active');
                dots[index].classList.add('active');
            }

            dots.forEach(function(dot) {
                dot.addEventListener('click', function() {
                    clearInterval(testiInterval);
                    currentTesti = parseInt(this.getAttribute('data-index'));
                    showTestimonial(currentTesti);
                    startTestiAutoPlay();
                });
            });

            function startTestiAutoPlay() {
                if (window.innerWidth <= 768) {
                    testiInterval = setInterval(function() {
                        currentTesti = (currentTesti + 1) % testiCards.length;
                        showTestimonial(currentTesti);
                    }, 4000);
                }
            }

            // Handle window resize for carousel
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    clearInterval(testiInterval);
                    testiCards.forEach(c => c.classList.remove('active')); // Reset display logic
                } else {
                    showTestimonial(currentTesti);
                    startTestiAutoPlay();
                }
            });

            startTestiAutoPlay();

            // 6. Terminal Typewriter Effect
            const terminalOutput = document.getElementById('typewriter-output');
            const terminalLines = [
                '> ADAPTIV RAG ENGINE v2.1',
                '> Source locked: "Modul_Sistem_Operasi.pdf" ✓',
                '> Hallucination risk: 0.00%',
                '> Generating flashcards... [████████] 100%',
                '> 47 cards created. Ready.'
            ];
            
            let lineIndex = 0;
            let charIndex = 0;
            let isTyping = false;

            const terminalObserver = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting && !isTyping) {
                    isTyping = true;
                    typeLine();
                }
            }, { threshold: 0.5 });

            const terminalBlock = document.querySelector('.terminal-block');
            if (terminalBlock) {
                terminalObserver.observe(terminalBlock);
            }

            function typeLine() {
                if (lineIndex < terminalLines.length) {
                    if (charIndex < terminalLines[lineIndex].length) {
                        terminalOutput.innerHTML += terminalLines[lineIndex].charAt(charIndex);
                        charIndex++;
                        setTimeout(typeLine, 30); // Speed of typing
                    } else {
                        terminalOutput.innerHTML += '<br><br>';
                        lineIndex++;
                        charIndex = 0;
                        setTimeout(typeLine, 500); // Pause between lines
                    }
                }
            }
        });