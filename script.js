// NEXUS Neumorphism Login JavaScript
class NeumorphismLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.neu-social');
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupNeumorphicEffects();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => this.addSoftPress(e));
            input.addEventListener('blur', (e) => this.removeSoftPress(e));
        });
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            this.passwordToggle.classList.toggle('show-password', type === 'text');
            this.animateSoftPress(this.passwordToggle);
        });
    }
    
    setupSocialButtons() {
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.animateSoftPress(button);
                let provider = 'Social';
                const svgPath = button.querySelector('svg path').getAttribute('d');
                if (svgPath.includes('22.56')) provider = 'Google';
                else if (svgPath.includes('github')) provider = 'GitHub';
                else if (svgPath.includes('23.953')) provider = 'Twitter';
                this.handleSocialLogin(provider, button);
            });
        });
    }
    
    setupNeumorphicEffects() {
        const neuElements = document.querySelectorAll('.neu-icon, .neu-checkbox, .neu-social');
        neuElements.forEach(el => {
            el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.05)');
            el.addEventListener('mouseleave', () => el.style.transform = 'scale(1)');
        });
        document.addEventListener('mousemove', (e) => this.updateAmbientLight(e));
    }
    
    updateAmbientLight(e) {
        const card = document.querySelector('.login-card');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (x - centerX) / centerX;
        const angleY = (y - centerY) / centerY;
        const shadowX = angleX * 30;
        const shadowY = angleY * 30;
        card.style.boxShadow = `
            ${shadowX}px ${shadowY}px 60px #d4af37,
            ${-shadowX}px ${-shadowY}px 60px #ffffff
        `;
    }
    
    addSoftPress(e) {
        const inputGroup = e.target.closest('.neu-input');
        inputGroup.style.transform = 'scale(0.98)';
    }
    
    removeSoftPress(e) {
        const inputGroup = e.target.closest('.neu-input');
        inputGroup.style.transform = 'scale(1)';
    }
    
    animateSoftPress(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => element.style.transform = 'scale(1)', 150);
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) { this.showError('email', 'Email is required'); return false; }
        if (!emailRegex.test(email)) { this.showError('email', 'Please enter a valid email'); return false; }
        this.clearError('email'); return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        if (!password) { this.showError('password', 'Password is required'); return false; }
        if (password.length < 6) { this.showError('password', 'Password must be at least 6 characters'); return false; }
        this.clearError('password'); return true;
    }
    
    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        const input = document.getElementById(field);
        input.style.animation = 'gentleShake 0.5s ease-in-out';
        setTimeout(() => input.style.animation = '', 500);
    }
    
    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => errorElement.textContent = '', 300);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        if (!isEmailValid || !isPasswordValid) {
            this.animateSoftPress(this.submitButton);
            return;
        }
        this.setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showNeumorphicSuccess();
        } catch (error) {
            this.showError('password', 'Login failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSocialLogin(provider, button) {
        console.log(`Initiating ${provider} login...`);
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Redirecting to ${provider}...`);
        } catch (error) {
            console.error(`${provider} failed: ${error.message}`);
        } finally {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        }
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        this.socialButtons.forEach(btn => {
            btn.style.pointerEvents = loading ? 'none' : 'auto';
            btn.style.opacity = loading ? '0.6' : '1';
        });
    }
    
    showNeumorphicSuccess() {
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.social-login').style.display = 'none';
            document.querySelector('.signup-link').style.display = 'none';
            this.successMessage.classList.add('show');
            const successIcon = this.successMessage.querySelector('.neu-icon');
            successIcon.style.animation = 'successPulse 0.6s ease-out';
        }, 300);
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
        }, 2500);
    }
}

if (!document.querySelector('#neu-keyframes')) {
    const style = document.createElement('style');
    style.id = 'neu-keyframes';
    style.textContent = `
        @keyframes gentleShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
        @keyframes successPulse{0%{transform:scale(0.8);opacity:0}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => new NeumorphismLoginForm());


/* --------------------------------------------------------------
   MOUSE-TRACKING & HOVER RESPONSIVE BLOBS
   -------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const abstract = document.querySelector('.bg-abstract');
    const blobs    = document.querySelectorAll('.bg-blob');
    const PROXIMITY = 220;               // radius in px where blob reacts
    const LAG       = 0.12;               // 0 = instant, 0.2 = nice delay

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    // Update CSS variables for the lag effect
    const updateVars = () => {
        abstract.style.setProperty('--mouse-x', `${mouseX}px`);
        abstract.style.setProperty('--mouse-y', `${mouseY}px`);
        requestAnimationFrame(updateVars);
    };
    updateVars();

    // Mouse move → update target
    document.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // RAF loop for smooth lag
    let raf;
    const loop = () => {
        const dx = targetX - mouseX;
        const dy = targetY - mouseY;
        mouseX += dx * LAG;
        mouseY += dy * LAG;

        // Check proximity for each blob
        blobs.forEach(blob => {
            const rect = blob.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dist = Math.hypot(cx - mouseX, cy - mouseY);

            blob.classList.toggle('hover', dist < PROXIMITY);
        });

        raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Cleanup
    window.addEventListener('blur', () => cancelAnimationFrame(raf));
});