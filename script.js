document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.toggle('dark-mode', prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    
    themeToggle?.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuToggle?.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = this.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu?.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            mobileMenu.classList.remove('active');
            
            // Reset hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Auth Page Functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs?.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetForm = this.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons?.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const eyeIcon = this.querySelector('.eye-icon');
            const eyeOffIcon = this.querySelector('.eye-off-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        });
    });
    
    // OTP Input Handling
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs?.forEach((input, index) => {
        input.addEventListener('keyup', function(e) {
            // Move to next input if current is filled
            if (this.value.length === this.maxLength && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Handle backspace
            if (e.key === 'Backspace' && index > 0 && this.value.length === 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        // Prevent non-numeric input
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
    
    // Signup Form OTP Verification
    const signupForm = document.getElementById('signup-form');
    const otpForm = document.getElementById('otp-form');
    const phoneDisplay = document.getElementById('phone-display');
    
    signupForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Display phone number in OTP form
        const phoneInput = document.getElementById('signup-phone');
        if (phoneInput) {
            phoneDisplay.textContent = phoneInput.value;
        }
        
        // Show OTP form
        authForms.forEach(form => form.classList.remove('active'));
        otpForm.classList.add('active');
        
        // Focus first OTP input
        if (otpInputs.length > 0) {
            otpInputs[0].focus();
        }
        
        // Start countdown
        startCountdown();
    });
    
    // OTP Countdown Timer
    let countdownInterval;
    const countdownElement = document.getElementById('countdown');
    const resendButton = document.getElementById('resend-otp');
    
    function startCountdown() {
        if (!countdownElement) return;
        
        let seconds = 60;
        countdownElement.textContent = seconds;
        
        if (resendButton) {
            resendButton.disabled = true;
            resendButton.style.opacity = '0.5';
        }
        
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            seconds--;
            countdownElement.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                if (resendButton) {
                    resendButton.disabled = false;
                    resendButton.style.opacity = '1';
                }
            }
        }, 1000);
    }
    
    // Resend OTP
    resendButton?.addEventListener('click', function() {
        if (!this.disabled) {
            // Clear OTP inputs
            otpInputs.forEach(input => {
                input.value = '';
            });
            
            // Focus first input
            if (otpInputs.length > 0) {
                otpInputs[0].focus();
            }
            
            // Restart countdown
            startCountdown();
        }
    });
    
    // OTP Form Submission
    otpForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate OTP (in a real app, this would verify with backend)
        let isValid = true;
        otpInputs.forEach(input => {
            if (input.value.length !== 1) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Redirect to home page or dashboard
            window.location.href = 'index.html';
        } else {
            // Show error (simplified for demo)
            alert('Please enter a valid OTP code');
        }
    });
    
    // Check URL parameters for mode (find or offer)
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'find' || mode === 'offer') {
        // Switch to signup tab if mode is specified
        authTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === 'signup') {
                tab.click();
            }
        });
    }
});