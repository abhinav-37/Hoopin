// Google Sheets Integration Configuration
// Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbws6i49qUEdYV_KGi_X1z1ei2YOGY6u52YGU8Uk31AN5kcXzkwGNQ2Ni0fhv6sTIEIAgQ/exec';

// DOM Elements
const form = document.getElementById('waitlist-form');
const submitButton = form.querySelector('.submit-button');
const successMessage = document.getElementById('success-message');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const societyInput = document.getElementById('society');
const cityInput = document.getElementById('city');
const workplaceInput = document.getElementById('workplace');

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards for animation
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateCity(city) {
    return city.trim().length >= 2;
}

function validateSociety(society) {
    return society.trim().length >= 2;
}

function validateWorkplace(workplace) {
    return workplace.trim().length >= 2;
}

function showError(input, message) {
    // Remove existing error
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error styling
    input.style.borderColor = '#ef4444';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '#e5e7eb';
}

// Real-time validation
nameInput.addEventListener('blur', function() {
    if (this.value && !validateName(this.value)) {
        showError(this, 'Please enter your full name');
    } else {
        clearError(this);
    }
});

emailInput.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        showError(this, 'Please enter a valid email address');
    } else {
        clearError(this);
    }
});

societyInput.addEventListener('blur', function() {
    if (this.value && !validateSociety(this.value)) {
        showError(this, 'Please enter your society/apartment name');
    } else {
        clearError(this);
    }
});

cityInput.addEventListener('blur', function() {
    if (this.value && !validateCity(this.value)) {
        showError(this, 'Please enter a valid city name');
    } else {
        clearError(this);
    }
});

workplaceInput.addEventListener('blur', function() {
    if (this.value && !validateWorkplace(this.value)) {
        showError(this, 'Please enter your workplace');
    } else {
        clearError(this);
    }
});

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const society = societyInput.value.trim();
    const city = cityInput.value.trim();
    const workplace = workplaceInput.value.trim();

    // Clear previous errors
    clearError(nameInput);
    clearError(emailInput);
    clearError(societyInput);
    clearError(cityInput);
    clearError(workplaceInput);

    // Validate inputs
    let hasErrors = false;

    if (!name) {
        showError(nameInput, 'Full name is required');
        hasErrors = true;
    } else if (!validateName(name)) {
        showError(nameInput, 'Please enter your full name');
        hasErrors = true;
    }

    if (!email) {
        showError(emailInput, 'Email address is required');
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Please enter a valid email address');
        hasErrors = true;
    }

    if (!society) {
        showError(societyInput, 'Society/apartment name is required');
        hasErrors = true;
    } else if (!validateSociety(society)) {
        showError(societyInput, 'Please enter your society/apartment name');
        hasErrors = true;
    }

    if (!city) {
        showError(cityInput, 'City is required');
        hasErrors = true;
    } else if (!validateCity(city)) {
        showError(cityInput, 'Please enter a valid city name');
        hasErrors = true;
    }

    if (!workplace) {
        showError(workplaceInput, 'Workplace is required');
        hasErrors = true;
    } else if (!validateWorkplace(workplace)) {
        showError(workplaceInput, 'Please enter your workplace');
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Prepare data for Google Sheets
        const formData = {
            name: name,
            email: email,
            society: society,
            city: city,
            workplace: workplace,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        };
        
        // Submit to Google Sheets
        const response = await submitToGoogleSheets(formData);
        
        if (response.success) {
            // Show success message
            form.style.display = 'none';
            successMessage.classList.add('show');
            
            // Track conversion (you can add analytics here)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                    'value': 1.0,
                    'currency': 'USD'
                });
            }
            
            // Optional: Reset form after delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.classList.remove('show');
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }, 10000);
            
        } else {
            throw new Error(response.error || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        showError(emailInput, 'Something went wrong. Please try again.');
        
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});

// Google Sheets submission function
async function submitToGoogleSheets(data) {
    try {
        console.log('Submitting to:', GOOGLE_SHEETS_URL);
        console.log('Data:', data);

        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Response result:', result);
        return result;

    } catch (error) {
        console.error('Google Sheets submission error:', error);

        // Fallback: Try alternative submission method
        return await submitToGoogleSheetsAlternative(data);
    }
}

// Alternative submission method (fallback)
async function submitToGoogleSheetsAlternative(data) {
    try {
        // Use the same Google Apps Script URL as fallback
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Alternative submission error:', error);
        return { success: false, error: error.message };
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .floating-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click tracking for analytics
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('click', function() {
            const elementText = this.textContent.trim();
            const elementClass = this.className;
            
            // Track clicks (you can send this to your analytics)
            console.log('Element clicked:', {
                text: elementText,
                class: elementClass,
                timestamp: new Date().toISOString()
            });
        });
    });
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateName,
        validateEmail,
        validateSociety,
        validateCity,
        validateWorkplace,
        submitToGoogleSheets
    };
}
