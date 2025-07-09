document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navUl = document.querySelector('.main-nav ul'); // Selects the <ul> inside .main-nav

    if (hamburger && navUl) { // Ensure elements exist before adding event listeners
        hamburger.addEventListener('click', function() {
            navUl.classList.toggle('active'); // Toggles the 'active' class on the <ul>
            hamburger.classList.toggle('active'); // Optional: Add active class to hamburger for animation
        });

        // Optional: Close menu when a navigation link is clicked (useful for single-page sites)
        const navLinks = document.querySelectorAll('.main-nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Check if the nav menu is active before trying to close it
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    } else {
        console.warn("Hamburger menu or navigation UL not found. Check selectors.");
    }

    // --- Tab Switching Logic ---
    const tabLinks = document.querySelectorAll('.nav-tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and content
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to the clicked link
            link.classList.add('active');

            // Show the corresponding tab content
            const targetTabId = link.dataset.tab;
            const targetTabContent = document.getElementById(targetTabId);
            if (targetTabContent) { // Ensure the target content exists
                targetTabContent.classList.add('active');

                // Scroll to the top of the newly activated tab content, or just scroll to top of viewport
                targetTabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.warn(`Target tab content with ID '${targetTabId}' not found.`);
            }

            // Close hamburger menu if open after clicking a tab link (useful for mobile)
            if (navUl && hamburger && navUl.classList.contains('active')) {
                navUl.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Optional: Activate the home tab on initial load if not already handled
    // This ensures one tab is always active when the page loads
    const initialActiveTabLink = document.querySelector('.nav-tab-link.active');
    if (!initialActiveTabLink && tabLinks.length > 0) {
        // If no active link is explicitly set in HTML, default to the first one (e.g., Home)
        tabLinks[0].classList.add('active');
        const firstTabContentId = tabLinks[0].dataset.tab;
        const firstTabContent = document.getElementById(firstTabContentId);
        if (firstTabContent) {
            firstTabContent.classList.add('active');
        }
    }

    // --- Testimonial Persistence Logic ---
    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialGrid = document.getElementById('testimonialGrid');

    let testimonials = JSON.parse(localStorage.getItem('doaliTestimonials')) || [];

    function renderTestimonials() {
        if (!testimonialGrid) { // Check if testimonialGrid exists before trying to render
            console.warn("Testimonial grid not found, cannot render testimonials.");
            return;
        }
        testimonialGrid.innerHTML = ''; // Clear existing testimonials to prevent duplicates on re-render

        testimonials.forEach(testimonial => {
            const newTestimonial = document.createElement('div');
            newTestimonial.classList.add('testimonial-item');

            let starHtml = '';
            for (let i = 0; i < testimonial.rating; i++) {
                starHtml += '<img src="https://img.icons8.com/emoji/24/star-emoji.png" alt="Star">';
            }

            newTestimonial.innerHTML = `
                <p class="quote">"${testimonial.quote}"</p>
                <div class="rating">
                    ${starHtml}
                </div>
                <p class="author">- ${testimonial.name}</p>
            `;

            testimonialGrid.prepend(newTestimonial); // Prepend to show newest first
        });
    }

    renderTestimonials(); // Call when the page loads

    if (testimonialForm) { // Ensure the form exists before adding listener
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('testimonialName').value.trim();
            const rating = parseInt(document.getElementById('testimonialRating').value);
            const quote = document.getElementById('testimonialQuote').value.trim();

            if (name && quote && rating && !isNaN(rating)) { // Added !isNaN(rating) for robust validation
                const newTestimonialData = {
                    name: name,
                    rating: rating,
                    quote: quote
                };

                testimonials.unshift(newTestimonialData);
                localStorage.setItem('doaliTestimonials', JSON.stringify(testimonials));

                renderTestimonials();
                testimonialForm.reset();
                alert('Thank you for your testimonial! It has been added.');
            } else {
                alert('Please fill in all fields correctly to submit your testimonial.');
            }
        });
    } else {
        console.warn("Testimonial form not found.");
    }

    // --- Tidio Chat Button Logic ---
    const tidioButton = document.getElementById('openTidioChat');
    if (tidioButton) {
        tidioButton.addEventListener('click', function() {
            if (window.tidioChatApi) {
                window.tidioChatApi.open();
            } else {
                console.warn("Tidio chat API not yet loaded. Ensure Tidio script is correctly integrated.");
                // Optionally, add a fallback here, like a direct link to WhatsApp or a contact form
            }
        });
    } else {
        console.log("Tidio chat open button not found. If Tidio is meant to open automatically, check Tidio's own script configuration.");
    }

    // --- FAQ Accordion Logic ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = question.querySelector('.icon');

            // IMPORTANT: Ensure answer and icon exist before proceeding
            if (!answer || !icon) {
                console.error("FAQ answer or icon element not found within the clicked .faq-item. Check your HTML structure for .faq-answer and .icon classes.");
                return; // Exit if critical elements are missing
            }

            // Close other open FAQs first
            // This ensures only one FAQ is open at a time (accordion behavior)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    const otherAnswer = otherQuestion.closest('.faq-item').querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('.icon');

                    if (otherAnswer && otherIcon) { // Ensure elements exist for other questions too
                        otherQuestion.classList.remove('active');
                        otherAnswer.classList.remove('active');
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });

            // Toggle active class on the clicked question
            question.classList.toggle('active');
            // Toggle active class on the answer to control max-height and padding
            answer.classList.toggle('active');

            // Toggle icon (Font Awesome classes)
            // Ensure Font Awesome's 'fas' class is present for the icon
            if (icon.classList.contains('fas')) {
                if (question.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            } else {
                 console.warn("Font Awesome 'fas' class not found on icon. Icon might not change as expected.");
            }
        });
    });
}); // End of DOMContentLoaded// Get references to your elements
const hamburger = document.querySelector('.hamburger-icon'); // Or whatever your icon's class/ID is
const navMenu = document.querySelector('.nav-menu');       // Or whatever your menu's class/ID is

// Add a click event listener to the hamburger icon
hamburger.addEventListener('click', () => {
    // Toggle a class on the navigation menu
    // This class (e.g., 'active') will be used in CSS to show/hide the menu
    navMenu.classList.toggle('active');

    // Optional: Add/remove a class to the hamburger icon itself to animate it
    hamburger.classList.toggle('open');
});