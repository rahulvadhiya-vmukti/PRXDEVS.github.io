// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {

    const isMobile = window.innerWidth <= 1024;

    // 🚫 If Mobile → NO ANIMATIONS
    if (isMobile) {
        console.log("Mobile detected — Animations disabled.");

        // Make sure everything is visible
        document.querySelectorAll('.hero-content, .reveal, .about-content > div')
            .forEach(el => {
                el.style.opacity = "1";
                el.style.transform = "none";
            });

        return; // STOP HERE
    }

    // ✅ DESKTOP ONLY ANIMATIONS BELOW

    // HERO REVEAL
    gsap.fromTo(".hero-content",
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        }
    );

    // HERO SCRUB
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 100,
        ease: "none"
    });

    // ABOUT SECTION
    gsap.to(".about-brief", {
        scrollTrigger: {
            trigger: ".about-brief",
            start: "top bottom",
            end: "top center",
            scrub: 1
        },
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "5%",
        marginBottom: "5%",
        borderRadius: "60px",
        ease: "power1.inOut"
    });

    // REVEALS
    document.querySelectorAll('.reveal').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // ABOUT STAGGER
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

    ScrollTrigger.refresh();
});

// 7. CREATIVE LAB PHYSICS ENGINE
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
    if (!target) return;

    const words = ["WEBSITES", "Softwares", "Graphic Designs", "Logo Designs"];
    let i = 0;

    setInterval(() => {
        i = (i + 1) % words.length;
        target.textContent = words[i];
    }, 2500);
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

    if (window.innerWidth <= 1024) return;

    const orb = document.querySelector('.hero-orb');
    if (!orb) return;

    window.addEventListener('mousemove', (e) => {
        gsap.to(orb, {
            x: e.clientX - window.innerWidth / 2,
            y: e.clientY - window.innerHeight / 2,
            duration: 2,
            ease: "power2.out"
        });
    });
};

// Initialize hero interactions
rotateWords();
initHeroOrb();

// Load Header & Footer
fetch('/header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        initNavbar();

        // Delay refresh slightly to allow layout paint
        setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 200);
    });

fetch('/footer.html')
    .then(res => res.text())
    .then(data => {
        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) {
            placeholder.innerHTML = data;
        }
        // In case some pages use .main-footer as a class directly
        const mainFooter = document.querySelector('.main-footer');
        if (mainFooter && !mainFooter.innerHTML.trim()) {
            mainFooter.innerHTML = data;
        }
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

    const WEB3FORMS_ACCESS_KEY = "2d3dbf16-9006-4e72-86b1-d5977ca9ce9d";

    // Shared function to send form
    function sendForm(name, email, message, formElement, buttonElement, originalText) {

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: "New Inquiry from PRXDEVS Website",
                name: name,
                email: email,
                message: message
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
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

    // The footer is injected later via fetch('/footer.html'), so the form doesn't
    // exist yet at DOMContentLoaded. Listen on document instead — submit events
    // bubble, so this catches the footer form whenever it gets added.
    document.addEventListener("submit", function (event) {
        const footerForm = event.target;
        if (footerForm.id !== "footerContactForm") return;

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

});
