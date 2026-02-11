// planet.ar - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeContent = document.querySelector('.marquee-content');

    if (marqueeContainer && marqueeContent) {

        // Shuffle items randomly
        function shuffleItems() {
            // Get all items (assuming HTML only contains unique items now)
            const originalItems = Array.from(marqueeContent.querySelectorAll('span'));

            // Fisher-Yates shuffle
            for (let i = originalItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [originalItems[i], originalItems[j]] = [originalItems[j], originalItems[i]];
            }

            // Clear content and add shuffled items
            marqueeContent.innerHTML = '';
            originalItems.forEach(item => {
                marqueeContent.appendChild(item);
            });

            // Duplicate for seamless loop
            originalItems.forEach(item => {
                marqueeContent.appendChild(item.cloneNode(true));
            });
        }

        shuffleItems();

        let isDragging = false;
        let startX = 0;
        let currentPos = 0;
        let dragStartPos = 0;
        let animationId = null;
        let lastTime = 0;
        const speed = 50; // pixels per second

        // Get content width (half because content is duplicated)
        function getContentWidth() {
            return marqueeContent.scrollWidth / 2;
        }

        // Normalize position to always be within the loop range
        function normalizePosition(pos) {
            const contentWidth = getContentWidth();
            pos = pos % contentWidth;
            if (pos > 0) pos -= contentWidth;
            if (pos < -contentWidth) pos += contentWidth;
            return pos;
        }

        // Animation loop
        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const delta = timestamp - lastTime;
            lastTime = timestamp;

            if (!isDragging) {
                currentPos -= (speed * delta) / 1000;
                currentPos = normalizePosition(currentPos);
                marqueeContent.style.transform = `translateX(${currentPos}px)`;
            }

            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        animationId = requestAnimationFrame(animate);

        // Pause on hover (but still allow dragging)
        let isPaused = false;
        marqueeContainer.addEventListener('mouseenter', function () {
            isPaused = true;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });

        marqueeContainer.addEventListener('mouseleave', function () {
            isPaused = false;
            if (!animationId && !isDragging) {
                lastTime = 0;
                animationId = requestAnimationFrame(animate);
            }
        });

        // Mouse down - start drag
        marqueeContainer.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.clientX;
            dragStartPos = currentPos;
            marqueeContainer.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // Mouse move - drag with cyclic behavior
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            currentPos = normalizePosition(dragStartPos + deltaX);
            marqueeContent.style.transform = `translateX(${currentPos}px)`;
        });

        // Mouse up - end drag
        document.addEventListener('mouseup', function () {
            if (!isDragging) return;
            isDragging = false;
            marqueeContainer.style.cursor = 'grab';

            // Resume animation if not hovered
            if (!isPaused && !animationId) {
                lastTime = 0;
                animationId = requestAnimationFrame(animate);
            }
        });

        // Set grab cursor
        marqueeContainer.style.cursor = 'grab';

        // Touch support
        marqueeContainer.addEventListener('touchstart', function (e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            dragStartPos = currentPos;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            const deltaX = e.touches[0].clientX - startX;
            currentPos = normalizePosition(dragStartPos + deltaX);
            marqueeContent.style.transform = `translateX(${currentPos}px)`;
        }, { passive: true });

        document.addEventListener('touchend', function () {
            if (!isDragging) return;
            isDragging = false;

            // Resume animation
            if (!animationId) {
                lastTime = 0;
                animationId = requestAnimationFrame(animate);
            }
        });
    }


    // Language Switcher Logic
    const availableLanguages = ['es', 'en', 'pt'];
    const flags = {
        'es': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="w-6 h-auto shadow-sm rounded-sm transition-transform hover:scale-110 cursor-pointer" data-lang="es"><path fill="#75aadb" d="M0 0h900v600H0z"/><path fill="#fff" d="M0 200h900v200H0z"/><path fill="#f6b40e" d="M450 245c33.1 0 60 26.9 60 60s-26.9 60-60 60-60-26.9-60-60 26.9-60 60-60z"/></svg>`,
        'en': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1235 650" class="w-6 h-auto shadow-sm rounded-sm transition-transform hover:scale-110 cursor-pointer" data-lang="en"><path fill="#b22234" d="M0 0h1235v650H0z"/><path fill="#fff" d="M0 50h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0z"/><path fill="#3c3b6e" d="M0 0h494v350H0z"/></svg>`,
        'pt': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 500" class="w-6 h-auto shadow-sm rounded-sm transition-transform hover:scale-110 cursor-pointer" data-lang="pt"><path fill="#009c3b" d="M0 0h720v500H0z"/><path fill="#fdf409" d="M360 48L688 250 360 452 32 250z"/><circle cx="360" cy="250" r="88" fill="#002776"/><path fill="#fff" d="M360 250h720v30H0z" clip-path="circle(88px at 360px 250px)" transform="rotate(-15 360 250)"/></svg>`
    };

    let currentLang = localStorage.getItem('preferredLanguage') || 'es';

    function setLanguage(lang) {
        if (!translations) return;

        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key][lang];
                } else {
                    element.innerHTML = translations[key][lang];
                }
            }
        });

        renderLanguageSwitcher();
    }

    function renderLanguageSwitcher() {
        const container = document.getElementById('language-switcher');
        if (!container) return;

        container.innerHTML = '';

        availableLanguages.forEach(lang => {
            if (lang !== currentLang) {
                const button = document.createElement('button');
                button.className = 'focus:outline-none';
                button.innerHTML = flags[lang];
                button.setAttribute('title', `Switch to ${lang.toUpperCase()}`);
                button.onclick = () => setLanguage(lang);
                container.appendChild(button);
            }
        });
    }

    // Initialize
    setLanguage(currentLang);

    // Contact Modal Logic
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');
    const contactForm = document.getElementById('contact-form');

    function openModal() {
        contactModal.classList.remove('hidden');
        // Small timeout to allow display:block to apply before transition
        setTimeout(() => {
            modalBackdrop.classList.remove('opacity-0');
            modalPanel.classList.remove('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
            modalPanel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
        }, 10);
    }

    function closeModal() {
        modalBackdrop.classList.add('opacity-0');
        modalPanel.classList.remove('opacity-100', 'translate-y-0', 'sm:scale-100');
        modalPanel.classList.add('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            contactModal.classList.add('hidden');
        }, 300);
    }

    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !contactModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('¡Gracias por tu mensaje! Te responderé a la brevedad.');
                    contactForm.reset();
                    closeModal();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Hubo un error al enviar el mensaje. Intentalo de nuevo.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error de conexión. Por favor, intentalo de nuevo más tarde.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }

});
