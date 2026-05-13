document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitBtn = document.getElementById('submitBtn');
    const passwordError = document.getElementById('password-error');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    // Toggle Password Visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Simple logic to change icon based on state
            if (type === 'text') {
                togglePasswordBtn.style.color = 'var(--text-link)';
            } else {
                togglePasswordBtn.style.color = 'var(--text-muted)';
            }
        });
    }

    // Validation Logic
    function validateForm() {
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const passVal = passwordInput.value;
        const confirmPassVal = confirmPasswordInput.value;

        let isValid = true;

        // Check if required fields are filled
        if (!nameVal || !emailVal || !passVal || !confirmPassVal) {
            isValid = false;
        }

        // Check if passwords match (only if confirm password is typed)
        if (confirmPassVal.length > 0) {
            if (passVal !== confirmPassVal) {
                passwordError.style.display = 'block';
                confirmPasswordInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            } else {
                passwordError.style.display = 'none';
                confirmPasswordInput.style.borderColor = 'var(--border-focus)';
            }
        } else {
            passwordError.style.display = 'none';
            confirmPasswordInput.style.borderColor = 'var(--border-color)';
        }

        // Enable or Disable button
        submitBtn.disabled = !isValid;
    }

    // Listen to input changes
    const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Handle Submit
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable button to prevent double submit
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        // Simulate API Call
        setTimeout(() => {
            alert('Account created successfully!');
            // window.location.href = 'dashboard.html'; // Redirect

            submitBtn.textContent = 'Sign Up';
            submitBtn.disabled = false;
        }, 1500);
    });
});