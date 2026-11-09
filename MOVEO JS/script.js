
/* =========================================
   1. MOBILE NAVIGATION MENU
========================================= */

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Open and close the mobile menu
menuButton?.addEventListener('click', () => {

    const open = navLinks.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(open));

    menuButton.textContent = open ? '✕' : '☰';

});

// Close the menu when a navigation link is clicked
navLinks?.querySelectorAll('a').forEach(a => {

    a.addEventListener('click', () => {

        navLinks.classList.remove('open');

        menuButton.setAttribute('aria-expanded', 'false');

        menuButton.textContent = '☰';

    });

});


/* =========================================
   2. REDUCED MOTION SETTINGS
========================================= */

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;


/* =========================================
   3. SCROLL REVEAL ANIMATIONS
========================================= */

if (!reducedMotion && 'IntersectionObserver' in window) {

    const observer = new IntersectionObserver(

        entries => entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);

            }

        }),

        {
            threshold: .08
        }

    );

    document.querySelectorAll(
        '.section h2, .section-description, .card, .team-member, .dashboard, .contact-form'
    ).forEach(el => {

        el.classList.add('reveal');

        observer.observe(el);

    });

}


/* =========================================
   4. INTERACTIVE 3D HOVER EFFECT
========================================= */

if (
    !reducedMotion &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
) {

    document.querySelectorAll('.tilt').forEach(el => {

        // Rotate element based on mouse position
        el.addEventListener('pointermove', e => {

            const r = el.getBoundingClientRect();

            const x = (e.clientX - r.left) / r.width - .5;

            const y = (e.clientY - r.top) / r.height - .5;

            el.style.transform = `
                perspective(900px)
                rotateY(${x * 6}deg)
                rotateX(${-y * 6}deg)
                translateY(-3px)
            `;

        });

        // Reset element when mouse leaves
        el.addEventListener('pointerleave', () => {

            el.style.transform = '';

        });

    });

}


/* =========================================
   5. INTERACTIVE FITNESS DASHBOARD
========================================= */

let running = false;

document.querySelector('#demo-toggle')?.addEventListener('click', () => {

    // Switch between walking and running
    running = !running;

    // Update distance
    document.querySelector('#distance').innerHTML = running
        ? '5.0 <em>km</em>'
        : '3.2 <em>km</em>';

    // Update duration
    document.querySelector('#duration').innerHTML = running
        ? '32 <em>min</em>'
        : '28 <em>min</em>';

    // Update pace
    document.querySelector('#pace').innerHTML = running
        ? '6:24 <em>/km</em>'
        : '8:45 <em>/km</em>';

    // Update dashboard description
    document.querySelector('#demo-label').textContent = running
        ? 'Showing running sample'
        : 'Showing walking sample';

    // Update button text
    document.querySelector('#demo-toggle').textContent = running
        ? 'Switch to walking'
        : 'Switch to running';

});


/* =========================================
   6. CONTACT FORM
========================================= */

document.querySelector('#contact-form')?.addEventListener('submit', e => {

    // Prevent the form from refreshing the page
    e.preventDefault();

    // Display demo message
    document.querySelector('.form-feedback').textContent =
        'This is a demo form. No message was sent. Please connect a backend to enable inquiries.';

});
/* Interactive hero glow */

const hero = document.querySelector(".hero");
const heroGlow = document.querySelector(".hero-glow");

if (
    hero &&
    heroGlow &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches
) {
    hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroGlow.style.marginLeft = `${x * 35}px`;
        heroGlow.style.marginTop = `${y * 35}px`;
    });

    hero.addEventListener("pointerleave", () => {
        heroGlow.style.marginLeft = "0px";
        heroGlow.style.marginTop = "0px";
    });
}

/* =========================================
   MOVEO ANIMATED GRAPH
========================================= */

const activityChart = document.querySelector("#activity-chart");
const chartLine = document.querySelector("#chart-line");
const chartGlow = document.querySelector("#chart-glow");
const chartFill = document.querySelector("#chart-fill");
const chartDot = document.querySelector("#chart-dot");

const walkingPath =
    "M0 130 C75 135 100 45 170 85 S280 150 340 95 " +
    "S450 30 510 75 S620 135 690 65 S790 110 900 25";

const runningPath =
    "M0 145 C80 110 110 25 180 65 S290 125 350 45 " +
    "S460 100 520 35 S630 115 700 40 S810 75 900 15";

let graphFrame = null;

const graphReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function animateActivityChart(mode = "walking") {

    if (!activityChart || !chartLine || !chartGlow ||
        !chartFill || !chartDot) {
        return;
    }

    if (graphFrame !== null) {
        cancelAnimationFrame(graphFrame);
        graphFrame = null;
    }

    const path = mode === "running" ? runningPath : walkingPath;

    chartLine.setAttribute("d", path);
    chartGlow.setAttribute("d", path);
    chartFill.setAttribute("d", path + " L900 180 L0 180 Z");

    const length = chartLine.getTotalLength();

    [chartLine, chartGlow].forEach(element => {
        element.classList.remove("animate");
        element.style.strokeDasharray = length;
        element.style.strokeDashoffset = length;
    });

    chartFill.classList.remove("animate");
    chartFill.style.opacity = "";
    chartDot.style.opacity = "0";

    if (graphReducedMotion) {
        chartLine.style.strokeDashoffset = "0";
        chartGlow.style.strokeDashoffset = "0";
        chartFill.style.opacity = "1";

        const endPoint = chartLine.getPointAtLength(length);
        chartDot.setAttribute("cx", endPoint.x);
        chartDot.setAttribute("cy", endPoint.y);
        chartDot.style.opacity = "1";
        return;
    }

    void chartLine.getBoundingClientRect();

    chartLine.classList.add("animate");
    chartGlow.classList.add("animate");
    chartFill.classList.add("animate");

    const duration = 3000;
    const start = performance.now();

    function moveDot(now) {

        const progress = Math.min((now - start) / duration, 1);

        const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const point = chartLine.getPointAtLength(length * eased);

        chartDot.setAttribute("cx", point.x);
        chartDot.setAttribute("cy", point.y);
        chartDot.style.opacity = "1";

        if (progress < 1) {
            graphFrame = requestAnimationFrame(moveDot);
        } else {
            graphFrame = null;
        }
    }

    graphFrame = requestAnimationFrame(moveDot);
}

/* Animate when the graph enters the screen */

if (activityChart && "IntersectionObserver" in window) {

    const graphObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                animateActivityChart("walking");
                graphObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.3 });

    graphObserver.observe(activityChart);

} else if (activityChart) {
    animateActivityChart("walking");
}

/* Replay animation when switching activity */

document.querySelector("#demo-toggle")?.addEventListener(
    "click",
    () => {

        const label = document.querySelector("#demo-label");
        const mode = label?.textContent.includes("running")
            ? "running"
            : "walking";

        animateActivityChart(mode);
    }
);
