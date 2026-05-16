// AUTH PAGE LOGIC (Login & Registration)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Toggle Password Visibility
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.password-wrapper');
            const input = wrapper.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Change icon content and color
            if (type === 'text') {
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
                btn.style.color = 'var(--accent-primary)';
            } else {
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
                btn.style.color = 'var(--text-muted)';
            }
        });
    });

    // 1.5 Password Strength Validator Helper
    const validatePasswordStrength = (password) => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasLower = /[a-z]/.test(password);
        
        return {
            isValid: minLength && hasUpper && (hasNumber && (hasLower || hasUpper)),
            errors: {
                length: !minLength,
                upper: !hasUpper,
                alphanumeric: !(hasNumber && (hasLower || hasUpper))
            }
        };
    };

    const updatePasswordErrorUI = (errorElement, strength) => {
        if (!errorElement) return;
        
        if (strength.isValid) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        } else {
            errorElement.style.display = 'block';
            if (strength.errors.length) {
                errorElement.textContent = 'Minimal 8 karakter';
            } else if (strength.errors.alphanumeric) {
                errorElement.textContent = 'Harus alfanumerik (huruf & angka)';
            } else if (strength.errors.upper) {
                errorElement.textContent = 'Minimal 1 huruf kapital';
            }
        }
    };

    // 2. Form Validation (Login)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = loginForm.querySelector('#email');
        const passwordInput = loginForm.querySelector('#password');
        const submitBtn = loginForm.querySelector('#submitBtn');
        
        // Add error element for login password if not exists
        let loginPassError = loginForm.querySelector('#password-error');
        if (!loginPassError) {
            loginPassError = document.createElement('span');
            loginPassError.id = 'password-error';
            loginPassError.className = 'error-text';
            passwordInput.closest('.form-group').appendChild(loginPassError);
        }

        const validateLogin = () => {
            const password = passwordInput.value;
            const strength = validatePasswordStrength(password);
            
            if (password.length > 0) {
                updatePasswordErrorUI(loginPassError, strength);
            } else {
                loginPassError.style.display = 'none';
            }

            submitBtn.disabled = !(emailInput.value.trim() && strength.isValid);
        };

        [emailInput, passwordInput].forEach(inp => inp.addEventListener('input', validateLogin));

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            setTimeout(() => {
                window.location.href = '../app/dashboard.html';
            }, 1200);
        });
    }

    // 3. Form Validation (Registration)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const nameInput = registerForm.querySelector('#name');
        const emailInput = registerForm.querySelector('#email');
        const passwordInput = registerForm.querySelector('#password');
        const confirmInput = registerForm.querySelector('#confirm-password');
        const submitBtn = registerForm.querySelector('#submitBtn');
        
        // Ensure error elements exist
        let strengthError = registerForm.querySelector('#strength-error');
        if (!strengthError) {
            strengthError = document.createElement('span');
            strengthError.id = 'strength-error';
            strengthError.className = 'error-text';
            passwordInput.closest('.form-group').appendChild(strengthError);
        }
        const matchError = document.getElementById('password-error');

        const validateRegister = () => {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            const strength = validatePasswordStrength(password);
            const isMatch = password === confirm;
            
            const isFilled = nameInput.value.trim() && emailInput.value.trim() && password && confirm;
            
            // Validate Strength
            if (password.length > 0) {
                updatePasswordErrorUI(strengthError, strength);
            } else {
                strengthError.style.display = 'none';
            }

            // Validate Match
            if (confirm.length > 0) {
                matchError.style.display = isMatch ? 'none' : 'block';
                matchError.textContent = 'Password tidak cocok';
            } else {
                matchError.style.display = 'none';
            }

            submitBtn.disabled = !(isFilled && isMatch && strength.isValid);
        };

        [nameInput, emailInput, passwordInput, confirmInput].forEach(inp => inp.addEventListener('input', validateRegister));

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            
            const fullName = nameInput.value.trim();
            localStorage.setItem('adaptiv_user_name', fullName);

            setTimeout(() => {
                window.location.href = 'onboarding.html';
            }, 1500);
        });
    }
});
