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
            delayedX = lerp(delayedX, cursorX, 0.15); // Smooth follow
            delayedY = lerp(delayedY, cursorY, 0.15);

            cursor.style.left = delayedX + 'px';
            cursor.style.top = delayedY + 'px';

            requestAnimationFrame(loop);
        };
        loop();

        // Magnetic Buttons
        const magnets = document.querySelectorAll('.btn-primary, .cta-button, .filter-btn');

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
        const hoverables = document.querySelectorAll('a:not(.btn-primary):not(.cta-button):not(.filter-btn), .project-item, .process-item');

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
        "title": "B2 Milano",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of B2 Milano, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/b2-milano-1.jpg",
            "assets/images/portfolio/b2-milano-2.jpg",
            "assets/images/portfolio/b2-milano-3.jpg",
            "assets/images/portfolio/b2-milano-4.jpg"
        ]
    },
    {
        "id": 2,
        "title": "Vhernier",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Vhernier, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/vhernier-1.jpeg",
            "assets/images/portfolio/vhernier-2.jpeg",
            "assets/images/portfolio/vhernier-3.jpeg",
            "assets/images/portfolio/vhernier-4.jpeg",
            "assets/images/portfolio/vhernier-5.jpeg",
            "assets/images/portfolio/vhernier-6.jpeg",
            "assets/images/portfolio/vhernier-7.jpg",
            "assets/images/portfolio/vhernier-8.jpeg",
            "assets/images/portfolio/vhernier-9.jpeg",
            "assets/images/portfolio/vhernier-10.jpeg",
            "assets/images/portfolio/vhernier-11.jpeg"
        ]
    },
    {
        "id": 3,
        "title": "Acne Studio Nyc",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Acne Studio Nyc, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/acne-studio-nyc-1.jpg",
            "assets/images/portfolio/acne-studio-nyc-2.jpg"
        ]
    },
    {
        "id": 4,
        "title": "Fantini Stand",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Fantini Stand, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/fantini-stand-1.jpg",
            "assets/images/portfolio/fantini-stand-2.jpg",
            "assets/images/portfolio/fantini-stand-3.jpg"
        ]
    },
    {
        "id": 5,
        "title": "Montesacro",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Montesacro, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/montesacro-1.jpeg",
            "assets/images/portfolio/montesacro-2.jpeg"
        ]
    },
    {
        "id": 6,
        "title": "Pisterzi",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Pisterzi, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/pisterzi-1.jpg",
            "assets/images/portfolio/pisterzi-2.jpg",
            "assets/images/portfolio/pisterzi-3.jpg"
        ]
    },
    {
        "id": 7,
        "title": "Missoni Office",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Missoni Office, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/missoni-office-1.jpeg"
        ]
    },
    {
        "id": 8,
        "title": "Parmacotto",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Parmacotto, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/parmacotto-1.jpeg"
        ]
    },
    {
        "id": 9,
        "title": "Parmacotto Panoramic",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Parmacotto Panoramic, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/parmacotto-panoramic-1.jpeg"
        ]
    },
    {
        "id": 10,
        "title": "Sneeker Shop",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Sneeker Shop, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/sneeker-shop-1.jpeg"
        ]
    },
    {
        "id": 11,
        "title": "Sneeker Shop2",
        "category": "WORK",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Sneeker Shop2, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/sneeker-shop2-1.jpeg"
        ]
    },
    {
        "id": 12,
        "title": "Bagni",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Bagni, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/bagni-1.jpg",
            "assets/images/portfolio/bagni-2.jpg",
            "assets/images/portfolio/bagni-3.jpg"
        ]
    },
    {
        "id": 13,
        "title": "Amid Libreria",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Amid Libreria, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/amid-libreria-1.jpg",
            "assets/images/portfolio/amid-libreria-2.jpg",
            "assets/images/portfolio/amid-libreria-3.jpg"
        ]
    },
    {
        "id": 14,
        "title": "Ariella Bedroom Master",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Ariella Bedroom Master, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/ariella-bedroom-master-1.jpeg",
            "assets/images/portfolio/ariella-bedroom-master-2.jpeg",
            "assets/images/portfolio/ariella-bedroom-master-3.jpeg",
            "assets/images/portfolio/ariella-bedroom-master-4.jpeg",
            "assets/images/portfolio/ariella-bedroom-master-5.jpeg"
        ]
    },
    {
        "id": 15,
        "title": "Ariella Cucina Pu",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Ariella Cucina Pu, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/ariella-cucina-pu-1.jpg",
            "assets/images/portfolio/ariella-cucina-pu-2.jpg",
            "assets/images/portfolio/ariella-cucina-pu-3.jpg",
            "assets/images/portfolio/ariella-cucina-pu-4.jpg",
            "assets/images/portfolio/ariella-cucina-pu-5.jpg",
            "assets/images/portfolio/ariella-cucina-pu-6.jpg"
        ]
    },
    {
        "id": 16,
        "title": "Ariella Leonard Cucina",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Ariella Leonard Cucina, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/ariella-leonard-cucina-1.jpeg",
            "assets/images/portfolio/ariella-leonard-cucina-2.jpeg",
            "assets/images/portfolio/ariella-leonard-cucina-3.jpeg"
        ]
    },
    {
        "id": 17,
        "title": "Ariella Master Closet",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Ariella Master Closet, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/ariella-master-closet-1.jpg",
            "assets/images/portfolio/ariella-master-closet-2.jpg",
            "assets/images/portfolio/ariella-master-closet-3.jpg"
        ]
    },
    {
        "id": 18,
        "title": "Ariella Wall",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Ariella Wall, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/ariella-wall-1.jpeg",
            "assets/images/portfolio/ariella-wall-2.jpeg",
            "assets/images/portfolio/ariella-wall-3.jpeg",
            "assets/images/portfolio/ariella-wall-4.jpeg",
            "assets/images/portfolio/ariella-wall-5.jpeg"
        ]
    },
    {
        "id": 19,
        "title": "Cucinetta",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Cucinetta, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/cucinetta-1.jpeg",
            "assets/images/portfolio/cucinetta-2.jpeg"
        ]
    },
    {
        "id": 20,
        "title": "Serrandina",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Serrandina, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/serrandina-1.jpeg",
            "assets/images/portfolio/serrandina-2.jpg"
        ]
    },
    {
        "id": 21,
        "title": "45 Detail",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of 45 Detail, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/45-detail-1.jpeg"
        ]
    },
    {
        "id": 22,
        "title": "Arilella Kids Room",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Arilella Kids Room, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/arilella-kids-room-1.jpeg"
        ]
    },
    {
        "id": 23,
        "title": "Nutella Picture",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Nutella Picture, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/nutella-picture-1.jpeg"
        ]
    },
    {
        "id": 24,
        "title": "Cristiana Picture",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Cristiana Picture, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/cristiana-picture-1.jpg"
        ]
    },
    {
        "id": 25,
        "title": "Dell'anna Lampadario",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Dell'anna Lampadario, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/dell-anna-lampadario-1.jpg"
        ]
    },
    {
        "id": 26,
        "title": "Madia Simon 2",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Madia Simon 2, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/madia-simon-2-1.jpg"
        ]
    },
    {
        "id": 27,
        "title": "Madia Simon",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Madia Simon, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/madia-simon-1.jpg"
        ]
    },
    {
        "id": 28,
        "title": "Maura Cucona",
        "category": "LIVING",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Maura Cucona, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/maura-cucona-1.jpg"
        ]
    },
    {
        "id": 29,
        "title": "Casco",
        "category": "BESPOKE",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Casco, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/casco-1.jpg"
        ]
    },
    {
        "id": 30,
        "title": "Fiorucci",
        "category": "BESPOKE",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Fiorucci, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/fiorucci-1.jpg"
        ]
    },
    {
        "id": 31,
        "title": "Hag",
        "category": "BESPOKE",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Hag, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/hag-1.jpg"
        ]
    },
    {
        "id": 32,
        "title": "Manichini",
        "category": "BESPOKE",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Manichini, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/manichini-1.jpg"
        ]
    },
    {
        "id": 33,
        "title": "Maxxi",
        "category": "BESPOKE",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Maxxi, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/maxxi-1.jpg"
        ]
    },
    {
        "id": 34,
        "title": "Scarpashangai",
        "category": "BESPOKE",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Scarpashangai, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/scarpashangai-1.jpg"
        ]
    },
    {
        "id": 35,
        "title": "Cement Table",
        "category": "COLLECTION",
        "type": "Custom Fabrication",
        "description": "Selected documentation of Cement Table, reflecting rigorous fabrication methods and detailed finish work.",
        "images": [
            "assets/images/portfolio/cement-table-1.jpeg"
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

});
