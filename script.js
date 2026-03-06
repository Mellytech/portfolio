// EmailJS Configuration - REPLACE THESE WITH YOUR ACTUAL KEYS FROM EMAILJS DASHBOARD
const EMAILJS_PUBLIC_KEY = "ebDmaBVR_hlyqUTKo";
const EMAILJS_SERVICE_ID = "service_m9tjdwc";
const EMAILJS_TEMPLATE_ID = "template_lxl9ack";
// Optional: Abstract API Key for checking if email exists (Get free key from https://www.abstractapi.com/api/email-validation-api)
const EMAIL_VERIFICATION_API_KEY = ""; 

function scrollToSection(sectionId){
    document.getElementById(sectionId).scrollIntoView({
        behavior:"smooth"
    });
}

async function sendMessage(e){
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button');

    const emailInput = form.querySelector('input[name="user_email"]');
    const email = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Disable button and show spinner
    submitBtn.disabled = true;
    submitBtn.classList.add('is-sending');

    // Verify email existence if API key is provided
    if (EMAIL_VERIFICATION_API_KEY) {
        try {
            const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_VERIFICATION_API_KEY}&email=${email}`);
            const data = await response.json();

            if (data.deliverability === "UNDELIVERABLE") {
                alert("Email could not be found");
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-sending');
                return;
            }
        } catch (error) {
            console.warn("Email verification skipped due to error:", error);
        }
    }

    const name = form.querySelector('input[name="user_name"]').value;
    const subject = form.querySelector('input[name="subject"]').value;
    const message = form.querySelector('textarea[name="message"]').value;
    const templateParams = {
        user_name: name,
        user_email: email,
        subject: subject,
        message: `Name: ${name}\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            const successMessage = document.getElementById('success-message');
            successMessage.classList.add('show');
            form.reset();

            // Hide the message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        }, (error) => {
            alert('Failed to send message: ' + JSON.stringify(error));
        })
        .finally(() => {
            // Re-enable button and hide spinner
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-sending');
        });
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Dynamic Year in Footer
    document.getElementById("year").textContent = new Date().getFullYear();

    // Attach form event listener
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", sendMessage);
    }

    // Navbar scroll effect
    const nav = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) { // Activates after 50px of scrolling
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // Typing Effect
    const typingElement = document.getElementById("typing-text");
    const phrases = ["Full-Stack Developer", "Problem Solver"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 75;
    const delayBetweenPhrases = 2000;

    function typeAnimate() {
        const currentPhrase = phrases[phraseIndex];
        let timeout = typingSpeed;

        if (isDeleting) {
            // Handle deleting
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            timeout = deletingSpeed;
        } else {
            // Handle typing
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause after typing is complete
            timeout = delayBetweenPhrases;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to the next phrase after deleting is complete
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            timeout = 500; // Pause before typing the new phrase
        }

        setTimeout(typeAnimate, timeout);
    }

    typeAnimate();

    // Scroll Animation for Project Cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Observe Projects, Timeline items, Education cards, and Skill categories
    const scrollElements = document.querySelectorAll('.about-text, .skill-category, .timeline-item, .education-card, .project-card, .contact form');
    scrollElements.forEach(el => {
        observer.observe(el);
    });

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Hamburger Menu Logic
    const menuIcon = document.getElementById("menu-icon");
    const navMenu = document.getElementById("nav-menu");

    if (menuIcon && navMenu) {
        const toggleMenu = () => {
            const isExpanded = menuIcon.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle("active");
            menuIcon.setAttribute('aria-expanded', !isExpanded);
        };

        menuIcon.addEventListener("click", toggleMenu);

        menuIcon.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent space from scrolling
                toggleMenu();
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll("nav ul li a").forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove("active");
                    menuIcon.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Modal Logic
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalTech = document.getElementById("modal-tech");
    const modalLinks = document.getElementById("modal-links");
    const closeModalBtn = document.querySelector(".close-modal");
    let lastFocusedElement;

    function openProjectModal(card) {
        lastFocusedElement = document.activeElement;

        const title = card.querySelector("h3").innerHTML;
        const tech = card.querySelector(".tech-stack").innerHTML;
        const details = card.getAttribute("data-details") || card.querySelector("p").innerText;
        const links = card.querySelector(".project-links").innerHTML;

        modalTitle.innerHTML = title;
        modalDescription.innerText = details;
        modalTech.innerHTML = tech;
        modalLinks.innerHTML = links;

        modal.classList.add("show");
        closeModalBtn.focus();
    }

    function closeModal() {
        modal.classList.remove("show");
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    function openPendingModal() {
        lastFocusedElement = document.activeElement;

        modalTitle.innerHTML = "Project Pending";
        modalDescription.innerText = "This project is currently under development and will be available soon. Please check back later!";
        modalTech.innerHTML = `<div class="modal-pending-spinner"><i class="fas fa-spinner fa-spin"></i></div>`;
        modalLinks.innerHTML = "";

        modal.classList.add("show");
        closeModalBtn.focus();

        setTimeout(closeModal, 15000);
    }

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", (e) => {
            const isPending = card.querySelector('.badge-pending');
            const clickedLink = e.target.closest('a');

            if (clickedLink) {
                // A link was clicked within the card
                if (isPending && clickedLink.innerText.trim() === 'Live Demo') {
                    e.preventDefault();
                    openPendingModal();
                }
                // For any other link, let the default browser behavior happen.
                return;
            }

            // If the click was on the card but not on a link, open the appropriate modal.
            if (isPending) {
                openPendingModal();
            } else {
                openProjectModal(card);
            }
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent space from scrolling
                if (card.querySelector('.badge-pending')) {
                    openPendingModal();
                } else {
                    openProjectModal(card);
                }
            }
        });
    });

    closeModalBtn.addEventListener("click", closeModal);

    window.addEventListener("keydown", (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Theme Toggler Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'green') {
            themeToggle.checked = true;
        } else {
            themeToggle.checked = false;
        }
    }

    if (currentTheme) {
        setTheme(currentTheme);
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            setTheme('green');
        } else {
            setTheme('blue');
        }
    });
});