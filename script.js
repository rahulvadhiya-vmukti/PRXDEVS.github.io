// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // const cursor = document.querySelector('#cursor');
    const mm = gsap.matchMedia(); // Create a media query listener

    // 1. RESPONSIVE SETUP FOR ALL DEVICES
    mm.add({
        // Desktop / Laptop
        isDesktop: "(min-width: 1025px)",
        // Tablet / Mobile
        isMobile: "(max-width: 1024px)"
    }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        // --- CUSTOM CURSOR (Only for Desktop) ---
        // if (isDesktop && cursor) {
        //     cursor.style.display = "block";
        //     document.addEventListener('mousemove', (e) => {
        //         gsap.to(cursor, {
        //             x: e.clientX,
        //             y: e.clientY,
        //             duration: 0.1,
        //             ease: "power2.out"
        //         });
        //     });

        //     const hoverElements = document.querySelectorAll('a, button, .video-box, .bento-item');
        //     hoverElements.forEach(el => {
        //         el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 4, duration: 0.3 }));
        //         el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.3 }));
        //     });
        // } else {
        //     // Hide cursor on touch devices to avoid floating dots
        //     if (cursor) cursor.style.display = "none";
        // }


        //         if (isDesktop && cursor) {

        //     let hasMoved = false;

        //     document.addEventListener('mousemove', (e) => {

        //         // Show cursor only after first movement
        //         if (!hasMoved) {
        //             cursor.style.opacity = "1";
        //             hasMoved = true;
        //         }

        //         gsap.to(cursor, {
        //             x: e.clientX,
        //             y: e.clientY,
        //             duration: 0.1,
        //             ease: "power2.out"
        //         });
        //     });

        //     const hoverElements = document.querySelectorAll('a, button, .video-box, .bento-item');
        //     hoverElements.forEach(el => {
        //         el.addEventListener('mouseenter', () =>
        //             gsap.to(cursor, { scale: 4, duration: 0.3 })
        //         );
        //         el.addEventListener('mouseleave', () =>
        //             gsap.to(cursor, { scale: 1, duration: 0.3 })
        //         );
        //     });

        // } else {
        //     if (cursor) cursor.style.display = "none";
        // }

        // --- ABOUT SECTION MARGIN (Responsive) ---
        gsap.to(".about-brief", {
            scrollTrigger: {
                trigger: ".about-brief",
                start: "top bottom",
                end: "top center",
                scrub: 1
            },
            // On mobile, we use smaller margins (e.g., 2% instead of 5%)
            marginLeft: isDesktop ? "5%" : "2%",
            marginRight: isDesktop ? "5%" : "2%",
            marginTop: isDesktop ? "5%" : "30px",
            marginBottom: isDesktop ? "5%" : "30px",
            borderRadius: isDesktop ? "60px" : "30px",
            ease: "power1.inOut"
        });

        return () => {
            // Optional cleanup when switching breakpoints
        };
    });

    // 2. HERO REVEAL & PARALLAX (Works on all)
    gsap.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out"
    });

    // gsap.to(".hero-content", {
    //     scrollTrigger: {
    //         trigger: ".hero",
    //         start: "top top",
    //         end: "bottom top",
    //         scrub: true
    //     },
    //     y: 100,
    //     opacity: 0,
    //     ease: "none"
    // });
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: window.innerWidth > 1024, // disable scrub on mobile
        },
        y: 100,
        opacity: 0,
        ease: "none"
    });

    // 3. CONTENT REVEALS
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 100%", // Trigger slightly later for better mobile feel
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // 4. ABOUT CONTENT STAGGER
    gsap.from(".about-content > div", {
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    });
});

// 7. CREATIVE LAB PHYSICS ENGINE
// const initPhysicsLab = () => {

//     // Disable physics for screens below 1000px
//     if (window.innerWidth < 1000) {
//         console.log("Creative Lab disabled on small screens for performance.");
//         return;
//     }

//     const container = document.querySelector('#physics-container');
//     if (!container) return;

//     // Pull Matter.js modules
//     const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

//     // Create Engine
//     const engine = Engine.create();
//     const world = engine.world;

//     // Start with NO gravity so cards stay in place initially
//     engine.gravity.y = 0;

//     // Define responsive card sizes
//     const isMobile = window.innerWidth < 1024;
//     const cardWidth = isMobile ? 90 : 230;
//     const cardHeight = isMobile ? 40 : 170;

//     // Create invisible boundaries (Walls)
//     const wallThickness = 50;
//     const wallOptions = { isStatic: true, render: { visible: false } };

//     const ground = Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + wallThickness / 2, container.offsetWidth, wallThickness, wallOptions);
//     const ceiling = Bodies.rectangle(container.offsetWidth / 2, -wallThickness / 2, container.offsetWidth, wallThickness, wallOptions);
//     const leftWall = Bodies.rectangle(-wallThickness / 2, container.offsetHeight / 2, wallThickness, container.offsetHeight, wallOptions);
//     const rightWall = Bodies.rectangle(container.offsetWidth + wallThickness / 2, container.offsetHeight / 2, wallThickness, container.offsetHeight, wallOptions);

//     // Placeholder project images (You can replace these with your actual image paths)
//     const cardImages = [
//         'https://picsum.photos/400/300?random=1',
//         'https://picsum.photos/400/300?random=2',
//         'https://picsum.photos/400/300?random=3',
//         'https://picsum.photos/400/300?random=4',
//         'https://picsum.photos/400/300?random=5',
//         'https://picsum.photos/400/300?random=6'
//     ];

//     // const cards = cardImages.map((imgSrc, index) => {
//     //     // Spread cards across the width and slightly stagger them vertically
//     //     const columns = isMobile ? 2 : 3;
//     //     const col = index % columns;
//     //     const row = Math.floor(index / columns);

//     //     // Calculate positions to spread them out like a messy grid initially
//     //     const x = (container.offsetWidth / columns) * (col + 0.5) + (Math.random() - 0.5) * 100;
//     //     const y = 100 + (row * 150) + (Math.random() - 0.5) * 50;

//     //     // Create Physics Body
//     //     const body = Bodies.rectangle(x, y, cardWidth, cardHeight, {
//     //         restitution: 0.6,
//     //         friction: 0.1,
//     //         chamfer: { radius: 20 },
//     //         render: { visible: false }
//     //     });

//     const cards = cardImages.map((imgSrc, index) => {
//         // 1. Calculate random X across full width (minus card width to stay in bounds)
//         const x = Math.random() * (container.offsetWidth - cardWidth) + cardWidth / 2;

//         // 2. Calculate random Y in the top 50% of the container
//         // We add an offset so they don't spawn directly on the "Explore Now" button
//         const y = Math.random() * (container.offsetHeight * 0.5) + 50;

//         // 3. Apply a random initial rotation to make it look more organic
//         const initialRotation = (Math.random() - 0.5) * 1; // Between -0.5 and 0.5 radians

//         const body = Bodies.rectangle(x, y, cardWidth, cardHeight, {
//             restitution: 0.6,
//             friction: 0.1,
//             angle: initialRotation, // Set the initial tilt
//             chamfer: { radius: 20 },
//             render: { visible: false }
//         });

//         // Create HTML Element
//         const element = document.createElement('div');
//         element.className = 'lab-card';
//         element.style.width = `${cardWidth}px`;
//         element.style.height = `${cardHeight}px`;
//         element.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;">`;
//         container.appendChild(element);

//         return { body, element };
//     });

//     // Add everything to the world
//     Composite.add(world, [ground, ceiling, leftWall, rightWall, ...cards.map(c => c.body)]);

//     // Mouse / Touch Interaction for Draggable Physics
//     const mouse = Mouse.create(container);
//     const mouseConstraint = MouseConstraint.create(engine, {
//         mouse: mouse,
//         constraint: {
//             stiffness: 0.2,
//             render: { visible: false }
//         }
//     });

//     // FIX: Allow page scrolling even when mouse is over the physics container
//     mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
//     mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

//     Composite.add(world, mouseConstraint);

//     // Sync HTML with Physics Bodies
//     Events.on(engine, 'afterUpdate', () => {
//         cards.forEach(card => {
//             const { position, angle } = card.body;
//             // translate offsets the element so the center of the div matches the center of the body
//             card.element.style.transform = `translate(${position.x - cardWidth / 2}px, ${position.y - cardHeight / 2}px) rotate(${angle}rad)`;
//         });
//     });

//     // GSAP Scroll Trigger: Gravity "Drops" the cards
//     gsap.to(engine.gravity, {
//         y: 1, // Activate normal gravity
//         scrollTrigger: {
//             trigger: ".creative-lab",
//             start: "top 20%", // Cards fall when section is near middle of screen
//             onEnter: () => {
//                 // Optional: Give them a tiny initial random push
//                 cards.forEach(card => {
//                     Matter.Body.applyForce(card.body, card.body.position, {
//                         x: (Math.random() - 0.5) * 0.05,
//                         y: 0.05
//                     });
//                 });
//             }
//         }
//     });

//     // Run the engine
//     const runner = Runner.create();
//     Runner.run(runner, engine);
// };

let physicsInitialized = false;

const initPhysicsLab = () => {

    // Disable physics for screens below 1000px
    if (window.innerWidth < 1000) return;

    const container = document.querySelector('#physics-container');
    if (!container || physicsInitialized) return;

    physicsInitialized = true; // Prevent double init

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const engine = Engine.create();
    const world = engine.world;

    engine.gravity.y = 0;

    const cardWidth = 230;
    const cardHeight = 170;

    const wallThickness = 50;
    const wallOptions = { isStatic: true, render: { visible: false } };

    const ground = Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + wallThickness / 2, container.offsetWidth, wallThickness, wallOptions);
    const ceiling = Bodies.rectangle(container.offsetWidth / 2, -wallThickness / 2, container.offsetWidth, wallThickness, wallOptions);
    const leftWall = Bodies.rectangle(-wallThickness / 2, container.offsetHeight / 2, wallThickness, container.offsetHeight, wallOptions);
    const rightWall = Bodies.rectangle(container.offsetWidth + wallThickness / 2, container.offsetHeight / 2, wallThickness, container.offsetHeight, wallOptions);

    const cardImages = [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
        'https://picsum.photos/400/300?random=4',
        'https://picsum.photos/400/300?random=5',
        'https://picsum.photos/400/300?random=6'
    ];

    const cards = cardImages.map((imgSrc) => {

        const x = Math.random() * (container.offsetWidth - cardWidth) + cardWidth / 2;
        const y = Math.random() * (container.offsetHeight * 0.5) + 50;
        const initialRotation = (Math.random() - 0.5) * 1;

        const body = Bodies.rectangle(x, y, cardWidth, cardHeight, {
            restitution: 0.6,
            friction: 0.1,
            angle: initialRotation,
            chamfer: { radius: 20 },
            render: { visible: false }
        });

        const element = document.createElement('div');
        element.className = 'lab-card';
        element.style.width = `${cardWidth}px`;
        element.style.height = `${cardHeight}px`;
        element.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;">`;

        container.appendChild(element);

        return { body, element };
    });

    Composite.add(world, [ground, ceiling, leftWall, rightWall, ...cards.map(c => c.body)]);

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });

    // Allow scrolling
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

    Composite.add(world, mouseConstraint);

    Events.on(engine, 'afterUpdate', () => {
        cards.forEach(card => {
            const { position, angle } = card.body;
            card.element.style.transform =
                `translate3d(${position.x - cardWidth / 2}px, ${position.y - cardHeight / 2}px, 0) rotate(${angle}rad)`;
        });
    });

    const runner = Runner.create();

    // Start engine only when visible
    ScrollTrigger.create({
        trigger: ".creative-lab",
        start: "top 70%",
        onEnter: () => {
            Runner.run(runner, engine);
            engine.gravity.y = 1;
        },
        onLeave: () => {
            Runner.stop(runner);
        },
        onLeaveBack: () => {
            Runner.stop(runner);
        }
    });
};

// Initialize the lab
// initPhysicsLab();
document.addEventListener('DOMContentLoaded', () => {
    initPhysicsLab();
});

// 8. TESTIMONIAL SLIDER LOGIC (With Drag & Swipe)
const initTestimonials = () => {
    const container = document.querySelector('.testimonial-container');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const progressFill = document.querySelector('.progress-bar-fill');

    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // A. Drag and Swipe Logic
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        container.scrollLeft = scrollLeft - walk;
        updateProgress();
    });

    // B. Button Logic
    const scrollAmount = 480;
    nextBtn.addEventListener('click', () => {
        container.scrollTo({
            left: container.scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
        updateProgress();
    });

    prevBtn.addEventListener('click', () => {
        container.scrollTo({
            left: container.scrollLeft - scrollAmount,
            behavior: 'smooth'
        });
        updateProgress();
    });

    // C. Progress Bar Update
    const updateProgress = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const percentage = (container.scrollLeft / maxScroll) * 100;
        if (progressFill) progressFill.style.width = `${Math.max(percentage, 10)}%`;
    };

    container.addEventListener('scroll', updateProgress);
};

initTestimonials();

// 9. FOOTER REVEAL ANIMATION
gsap.from(".footer-cta h2", {
    scrollTrigger: {
        trigger: ".main-footer",
        start: "top 80%",
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
});

// 10. HERO INTERACTION: WORD ROTATOR
const rotateWords = () => {
    const target = document.querySelector('.txt-rotate');
    // Updated list as per your new design request
    const words = ["Softwares", "Graphic Designs", "LOGO DESIGNS"];
    let i = 0;

    setInterval(() => {
        gsap.to(target, {
            opacity: 0,
            y: -10,
            duration: 0.4,
            onComplete: () => {
                i = (i + 1) % words.length;
                target.innerText = words[i];
                gsap.to(target, { opacity: 1, y: 0, duration: 0.4 });
            }
        });
    }, 3500);
};

// New Function for Scroll Arrow
const scrollToAbout = () => {
    const nextSection = document.querySelector('.about-brief');
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// 11. HERO INTERACTION: ORB FOLLOW
const initHeroOrb = () => {
    const orb = document.querySelector('.hero-orb');
    if (!orb) return;

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        gsap.to(orb, {
            x: clientX - window.innerWidth / 2,
            y: clientY - window.innerHeight / 2,
            duration: 2,
            ease: "power2.out"
        });
    });
};

// Initialize inside DOMContentLoaded
rotateWords();
initHeroOrb();

// 12. 3D EARTH COMPONENT
// const init3DEarth = () => {
//     const container = document.getElementById('canvas-container');
//     if (!container) return;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

//     renderer.setSize(container.offsetWidth, container.offsetHeight);
//     container.appendChild(renderer.domElement);

//     // Create a Sphere (Earth)
//     // We use a wireframe for a "Tech/Developer" aesthetic
//     const geometry = new THREE.SphereGeometry(5, 64, 64);
//     const material = new THREE.MeshBasicMaterial({
//         color: 0xffffff,
//         wireframe: true,
//         transparent: true,
//         opacity: 0.1
//     });
//     const earth = new THREE.Mesh(geometry, material);
//     scene.add(earth);

//     camera.position.z = 10;

//     // Animation Loop
//     const animate = () => {
//         requestAnimationFrame(animate);
//         earth.rotation.y += 0.002; // Slow, elegant rotation
//         earth.rotation.x += 0.001;
//         renderer.render(scene, camera);
//     };

//     animate();

//     // Handle Resize
//     window.addEventListener('resize', () => {
//         renderer.setSize(container.offsetWidth, container.offsetHeight);
//         camera.aspect = 1;
//         camera.updateProjectionMatrix();
//     });
// };

// init3DEarth();

// header file call in html script
// Load Header
// Load Header
fetch('/header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        initNavbar(); // initialize AFTER injection
    });

function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const closeBtn = document.querySelector('.drawer-close');
    const dropdownToggle = document.querySelector('.drawer-dropdown-toggle');
    const dropdown = document.querySelector('.drawer-dropdown');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = "hidden";
    });

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = "";
    }

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Dropdown toggle
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', () => {
            dropdown.classList.toggle('open');
        });
    }
}

// mail script for contact form
/* ---------------- CONTACT FORM SUBMIT ---------------- */

/* ================= CONTACT FORMS ================= */

document.addEventListener("DOMContentLoaded", function () {

    const baseURL = "https://mail.prxdevs.com:2011";

    // Shared function to send form
    function sendForm(name, email, message, formElement, buttonElement, originalText) {

        fetch(`${baseURL}/submitForm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-site-key": "prxdev_secure_2026"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Email sent successfully") {
                    alert("Inquiry sent successfully!");
                    formElement.reset();
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Something went wrong. Please try again.");
            })
            .finally(() => {
                buttonElement.innerText = originalText;
                buttonElement.disabled = false;
            });
    }

    /* ------------ CONTACT PAGE FORM ------------ */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const submitBtn = contactForm.querySelector(".cta-btn");
            const originalText = submitBtn.innerText;

            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const company = document.getElementById("company").value;
            const service = document.getElementById("service").value;
            const timeline = document.getElementById("timeline").value;
            const message = document.getElementById("message").value;

            const finalMessage = `
Company: ${company}
Service: ${service}
Timeline: ${timeline}

Project Details:
${message}
            `;

            sendForm(name, email, finalMessage, contactForm, submitBtn, originalText);
        });
    }

    /* ------------ FOOTER FORM ------------ */

    const footerForm = document.getElementById("footerContactForm");

    if (footerForm) {

        footerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const submitBtn = footerForm.querySelector(".cta-btn");
            const originalText = submitBtn.innerText;

            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            const name = document.getElementById("footerName").value;
            const email = document.getElementById("footerEmail").value;
            const service = document.getElementById("footerService").value;
            const message = document.getElementById("footerMessage").value;

            const finalMessage = `
Service: ${service}

Project Details:
${message}
            `;

            sendForm(name, email, finalMessage, footerForm, submitBtn, originalText);
        });
    }

});

window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});