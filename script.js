gsap.registerPlugin(ScrollTrigger);

// --- 1. PRELOADER TIMELINE & RESPONSIVE LOGIC ---
window.addEventListener('DOMContentLoaded', () => {

    if (!document.getElementById("spline-container")) return;

    // Setup GSAP Responsive Media Queries
    let mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
    }, (context) => {
        let { isDesktop } = context.conditions;

        // Check if the user refreshed the page while already scrolled down
        const isScrolledDown = window.scrollY > 100;

        // Set initial state for the 3D asset loader
        gsap.set("#spline-container", {
            top: "-5%",
            left: isDesktop ? "0%" : "50%", 
            xPercent: isDesktop ? 0 : -56, // -56 pulls it perfectly to the center
            width: "100vw",
            height: "100vh"
        });

        // Initialize timeline and refresh ScrollTrigger when done
        const tl = gsap.timeline({
            onComplete: () => {
                ScrollTrigger.refresh(); // Syncs all scroll animations perfectly after loading finishes
            }
        });

        tl.to(".loading-bar", {
            width: "100%",
            duration: 4, // Slightly faster load feels snappier
            ease: "power1.inOut"
        })
        .to(".loading-bar-wrapper", {
            opacity: 0,
            duration: 0.5,
            onComplete: () => document.querySelector(".loading-bar-wrapper").style.display = "none"
        }, "-=0.5")
        
        // Fade out the 3D asset quickly to hide the WebGL stretch
        .to("#spline-container", { opacity: 0, duration: 0.3 })
        
        // Instantly snap it to its final, responsive size while invisible
        .set("#spline-container", {
            top: isDesktop ? "10%" : "30%",  
            left: isDesktop ? "57%" : "70%",
            xPercent: isDesktop ? 0 : -50, 
            yPercent: isDesktop ? 0 : -50,  
            width: isDesktop ? "55vw" : "150vw", 
            height: isDesktop ? "80vh" : "85vh", 
            zIndex: 0 // Forces it behind your text (which has z-index: 10)
        })
        .to("#loader-bg", {
            opacity: 0,
            duration: 1.5, 
            ease: "power2.inOut",
            onComplete: () => document.querySelector("#loader-bg").style.display = "none"
        });

        if (!isScrolledDown) {
            // FIX: Changed "finishTl" to "tl" so it doesn't crash the script!
            // Opacity is correctly set to 0.08 for mobile here.
            tl.to("#spline-container", { opacity: isDesktop ? 1 : 0.1, duration: 1.5 }, "<"); 
        } else {
            gsap.set("#spline-container", { display: "none" });
        }
        
        // Trigger Hero text reveal
        tl.add(() => playHeroAnimation(), "-=1"); 
    });
});

// --- 2. HERO ANIMATION CONTROLLER ---
function playHeroAnimation() {
    const heroContent = document.querySelectorAll("#hero h1, #hero .subtitle, #hero .hero-btns");
    gsap.from(heroContent, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    });
}

// --- 3. TEXT REVEALS (Rest of panels) ---
const panels = gsap.utils.toArray(".panel").slice(1);

panels.forEach(panel => {
    const content = panel.querySelectorAll("h2, h3, p, .feature, .stat, .product-card");
    
    gsap.from(content, {
        scrollTrigger: {
            trigger: panel,
            start: "top 80%", 
            toggleActions: "play none none reverse" // Reverses smoothly if you scroll up
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1, 
        ease: "power3.out"
    });
});

// --- 4. SMOOTH DUCK AND HIDE (3D Asset Scroll logic) ---
gsap.to("#spline-container", { 
    scrollTrigger: {
        trigger: "#hero",
        start: "bottom 90%", // Triggers as the bottom of the hero starts to leave the screen
        end: "bottom 20%",   // Ends as the hero gets near the top
        scrub: true,         // Smooth fade tied perfectly to your scroll wheel
    },
    y: "20vh",     // Drops down slightly
    opacity: 0,    // Fades out completely
    ease: "none"
});

// --- 5. MOBILE MENU LOGIC ---
const burger = document.getElementById('burger-menu');
const mobileNav = document.getElementById('mobile-nav');
const closeBtn = document.getElementById('close-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    mobileNav.classList.toggle('active');
}

if (burger) {
    burger.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    // Close menu when a link is clicked
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
}