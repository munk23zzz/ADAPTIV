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

            // Change icon color
            btn.style.color = type === 'text' ? 'var(--accent-primary)' : 'var(--text-muted)';
        });
    });

    // 2. Form Validation (Login)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = loginForm.querySelector('#email');
        const passwordInput = loginForm.querySelector('#password');
        const submitBtn = loginForm.querySelector('#submitBtn');

        const validateLogin = () => {
            submitBtn.disabled = !(emailInput.value.trim() && passwordInput.value);
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
        const passwordError = document.getElementById('password-error');

        const validateRegister = () => {
            const isMatch = passwordInput.value === confirmInput.value;
            const isFilled = nameInput.value.trim() && emailInput.value.trim() && passwordInput.value && confirmInput.value;
            
            if (confirmInput.value.length > 0) {
                passwordError.style.display = isMatch ? 'none' : 'block';
                confirmInput.style.borderColor = isMatch ? 'var(--border-strong)' : 'var(--error-color)';
            } else {
                passwordError.style.display = 'none';
            }

            submitBtn.disabled = !(isFilled && isMatch);
        };

        [nameInput, emailInput, passwordInput, confirmInput].forEach(inp => inp.addEventListener('input', validateRegister));

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            
            // Simpan nama ke localStorage untuk animasi welcome
            const fullName = nameInput.value.trim();
            localStorage.setItem('adaptiv_user_name', fullName);

            setTimeout(() => {
                // Redirect ke onboarding untuk user baru
                window.location.href = 'onboarding.html';
            }, 1500);
        });
    }
});
