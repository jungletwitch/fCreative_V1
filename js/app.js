document.addEventListener('DOMContentLoaded', () => {
    console.log('FCreative initialized.');

    // 1. Reveal on Scroll (Intersection Observer)
    const dynamicRevealElements = document.querySelectorAll('.hero-text, .manifesto, .section-label, .process-item, .project-item, .contact-col');

    // Add the class to elements that don't have it explicitly in HTML
    dynamicRevealElements.forEach(el => el.classList.add('reveal-on-scroll'));

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe ALL elements that now have the class (both hardcoded and dynamically added)
    const allRevealElements = document.querySelectorAll('.reveal-on-scroll');
    allRevealElements.forEach(el => observer.observe(el));


    // 2. Parallax Effect (Hero + Images)
    const heroImage = document.querySelector('.hero-image-container img');

    let currentScroll = 0;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updateParallax() {
        if (mediaQuery.matches) return; // Stop if reduced motion is preferred

        currentScroll = window.scrollY;

        // Hero Parallax
        if (heroImage) {
            // Move image half the speed of scroll
            const translateValue = currentScroll * 0.5;
            heroImage.style.transform = `translateY(${translateValue}px)`;
        }

        requestAnimationFrame(updateParallax);
    }

    if (!mediaQuery.matches) {
        requestAnimationFrame(updateParallax);
    }


    // 3. Smooth Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Focus management after navigation
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true }); // Prevent double scroll

                targetElement.scrollIntoView({
                    behavior: mediaQuery.matches ? 'auto' : 'smooth'
                });
            }
        });
    });

    // 4. Custom Cursor & Magnetic Logic
    const cursor = document.querySelector('.custom-cursor');
    const finePointer = window.matchMedia('(pointer: fine)');

    if (cursor && finePointer.matches && !mediaQuery.matches) {

        // Helper: Lerp for smooth cursor
        const lerp = (a, b, n) => (1 - n) * a + n * b;

        let cursorX = 0;
        let cursorY = 0;
        let delayedX = 0;
        let delayedY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        const loop = () => {
            delayedX = lerp(delayedX, cursorX, 0.4); // Faster smooth follow
            delayedY = lerp(delayedY, cursorY, 0.4);

            cursor.style.left = delayedX + 'px';
            cursor.style.top = delayedY + 'px';

            requestAnimationFrame(loop);
        };
        loop();

        // Magnetic Buttons
        const magnets = document.querySelectorAll('.btn-primary, .cta-button, .filter-btn, .modal-close');

        magnets.forEach(magnet => {
            magnet.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move button slightly towards cursor
                this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

                // Add magnet class to cursor for visual feedback
                cursor.classList.add('magnet');
            });

            magnet.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0px, 0px)';
                cursor.classList.remove('magnet');
            });
        });

        // Hover Effect Only
        const hoverables = document.querySelectorAll('a:not(.btn-primary):not(.cta-button):not(.filter-btn), .project-item, .process-item, .form-control, label, .hoverable');

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // 5. Stagger Animations for Process Grid
    if (!mediaQuery.matches) {
        const processItems = document.querySelectorAll('.process-item');
        processItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`;
        });
    }

    // 6. Project Data & Modal Logic
    const projects = [
    {
        "id": 1,
        "title": "Barbershop Pisterzi",
        "category": "COMMERCIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Barbershop Pisterzi, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/barbershop-pisterzi-1.jpg",
            "assets/images/portfolio/barbershop-pisterzi-2.jpg",
            "assets/images/portfolio/barbershop-pisterzi-3.jpg"
        ]
    },
    {
        "id": 2,
        "title": "Hotel B2 Milano",
        "category": "COMMERCIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Hotel B2 Milano, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/hotel-b2-milano-1.jpg",
            "assets/images/portfolio/hotel-b2-milano-2.jpg",
            "assets/images/portfolio/hotel-b2-milano-3.jpg"
        ]
    },
    {
        "id": 3,
        "title": "Maxxi Museum Roma",
        "category": "COMMERCIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Maxxi Museum Roma, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/maxxi-museum-roma-1.jpg"
        ]
    },
    {
        "id": 4,
        "title": "Vhernier",
        "category": "COMMERCIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Vhernier, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/vhernier-1.jpg",
            "assets/images/portfolio/vhernier-2.jpeg",
            "assets/images/portfolio/vhernier-3.jpeg",
            "assets/images/portfolio/vhernier-4.jpeg",
            "assets/images/portfolio/vhernier-5.jpeg",
            "assets/images/portfolio/vhernier-6.jpeg",
            "assets/images/portfolio/vhernier-7.jpeg",
            "assets/images/portfolio/vhernier-8.jpeg",
            "assets/images/portfolio/vhernier-9.jpeg",
            "assets/images/portfolio/vhernier-10.jpeg",
            "assets/images/portfolio/vhernier-11.jpeg"
        ]
    },
    {
        "id": 5,
        "title": "Fantini Booth Nyc",
        "category": "COMMERCIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Fantini Booth Nyc, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/fantini-booth-nyc-1.jpg",
            "assets/images/portfolio/fantini-booth-nyc-2.jpg",
            "assets/images/portfolio/fantini-booth-nyc-3.jpg"
        ]
    },
    {
        "id": 6,
        "title": "Scarpashangai",
        "category": "COMMERCIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Scarpashangai, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/scarpashangai-1.jpg"
        ]
    },
    {
        "id": 7,
        "title": "Bed",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Bed, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/bed-1.jpeg"
        ]
    },
    {
        "id": 8,
        "title": "Filadelfia Pa",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Filadelfia Pa, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/filadelfia-pa-1.jpg",
            "assets/images/portfolio/filadelfia-pa-2.jpg",
            "assets/images/portfolio/filadelfia-pa-3.jpg",
            "assets/images/portfolio/filadelfia-pa-4.jpg",
            "assets/images/portfolio/filadelfia-pa-5.jpg",
            "assets/images/portfolio/filadelfia-pa-6.jpg"
        ]
    },
    {
        "id": 9,
        "title": "Gold Leaf Chandelier",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Gold Leaf Chandelier, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/gold-leaf-chandelier-1.jpg"
        ]
    },
    {
        "id": 10,
        "title": "Lic Ny Media Unit",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Lic Ny Media Unit, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/lic-ny-media-unit-1.jpg",
            "assets/images/portfolio/lic-ny-media-unit-2.jpg",
            "assets/images/portfolio/lic-ny-media-unit-3.jpg"
        ]
    },
    {
        "id": 11,
        "title": "Leonard Street Master Bedroom",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Leonard Street Master Bedroom, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/leonard-street-master-bedroom-1.jpeg",
            "assets/images/portfolio/leonard-street-master-bedroom-2.jpeg",
            "assets/images/portfolio/leonard-street-master-bedroom-3.jpeg",
            "assets/images/portfolio/leonard-street-master-bedroom-4.jpeg",
            "assets/images/portfolio/leonard-street-master-bedroom-5.jpeg"
        ]
    },
    {
        "id": 12,
        "title": "Private Home 2 Milano",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Private Home 2 Milano, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/private-home-2-milano-1.jpg"
        ]
    },
    {
        "id": 13,
        "title": "Private Home Milano",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Private Home Milano, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/private-home-milano-1.jpg"
        ]
    },
    {
        "id": 14,
        "title": "Leonard Street Ny",
        "category": "RESIDENTIAL",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Leonard Street Ny, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/leonard-street-ny-1.jpeg",
            "assets/images/portfolio/leonard-street-ny-2.jpeg"
        ]
    }
];

    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.querySelector('.modal-title');
    const modalSubtitle = document.querySelector('.modal-subtitle');
    const modalDesc = document.querySelector('.modal-description');
    const modalGallery = document.querySelector('.modal-gallery');
    const projectItems = document.querySelectorAll('.project-item');

    function openModal(projectId) {
        const project = projects.find(p => p.id === parseInt(projectId));
        if (!project) return;

        // Populate Content
        modalTitle.textContent = project.title;
        modalSubtitle.textContent = project.type;
        modalDesc.textContent = project.description;

        // Clear and Populate Gallery
        modalGallery.innerHTML = '';
        project.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = project.title + ' Detail';
            modalGallery.appendChild(img);
        });

        // Show Modal
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock Scroll
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock Scroll
    }

    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-project-id');
            openModal(id);
        });
    });

    modalClose.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // 7. Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Add category data attribute to DOM elements for filtering
    projectItems.forEach(item => {
        const id = parseInt(item.getAttribute('data-project-id'));
        const project = projects.find(p => p.id === id);
        if (project) {
            item.setAttribute('data-category', project.category);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Re-trigger animation if needed, or simple show
                    setTimeout(() => item.classList.add('is-visible'), 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('is-visible');
                }
            });
        });
    });

    // Check URL for filter parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        const targetBtn = Array.from(filterBtns).find(btn => btn.getAttribute('data-filter') === filterParam.toUpperCase());
        if (targetBtn) {
            targetBtn.click();
        }
    }

});
