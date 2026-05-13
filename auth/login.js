document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    // Fitur: Toggle untuk memunculkan/menyembunyikan password
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Ubah warna ikon mata berdasarkan statenya
            if (type === 'text') {
                togglePasswordBtn.style.color = 'var(--text-link)';
            } else {
                togglePasswordBtn.style.color = 'var(--text-muted)';
            }
        });
    }

    // Fitur: Validasi Form Real-time
    function validateForm() {
        const emailVal = emailInput.value.trim();
        const passVal = passwordInput.value;

        // Tombol Sign In hanya aktif kalau email dan password tidak kosong
        if (emailVal.length > 0 && passVal.length > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Listen to input changes
    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    // Fitur: Handle Submit (Simulasi Login)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable tombol biar user gak klik dua kali
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        // Simulasi proses API call (misalnya cek ke backend)
        setTimeout(() => {
            // Kalau sukses, lempar user ke Dashboard
            window.location.href = '../app/dashboard.html';

            // Kode di bawah jalan kalau redirect gagal/dihapus
            submitBtn.textContent = 'Sign In';
            submitBtn.disabled = false;
        }, 1200);
    });
});