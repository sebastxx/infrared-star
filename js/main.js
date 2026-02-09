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

});
