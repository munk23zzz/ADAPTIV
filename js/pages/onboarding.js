document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step-card');
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const btnSubmit = document.getElementById('btn-submit');
    const btnSkip = document.getElementById('btn-skip');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');
    const toolsCheckboxes = document.querySelectorAll('input[name="tools"]');
    const toolsError = document.getElementById('tools-error');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Fungsi untuk memperbarui UI
    function updateUI() {
        // Tampilkan step yang sesuai
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });

        // Update Progress Bar
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        currentStepText.textContent = currentStep;

        // Atur tombol Back
        btnBack.style.display = currentStep > 1 ? 'block' : 'none';

        // Atur tombol Next vs Submit
        if (currentStep === totalSteps) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'block';
        } else {
            btnNext.style.display = 'block';
            btnSubmit.style.display = 'none';
        }

        validateCurrentStep();
    }

    // Fungsi Validasi: Tombol Next hanya aktif jika ada jawaban yang dipilih
    function validateCurrentStep() {
        const currentActiveCard = document.querySelector(`.step-card[data-step="${currentStep}"]`);

        if (currentStep === 7) {
            // Logika khusus step 7 (Checkbox max 3)
            const checkedCount = document.querySelectorAll('input[name="tools"]:checked').length;
            btnSubmit.disabled = checkedCount === 0 || checkedCount > 3;
            toolsError.style.display = checkedCount > 3 ? 'block' : 'none';
        } else {
            // Logika Radio button biasa
            const radioGroup = currentActiveCard.querySelectorAll('input[type="radio"]');
            let isChecked = false;
            radioGroup.forEach(radio => {
                if (radio.checked) isChecked = true;
            });
            btnNext.disabled = !isChecked;
        }
    }

    // Event Listener untuk semua input (tombol next hanya aktif jika sudah memilih)
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
            validateCurrentStep();
        });
    });

    // Event Listener khusus Checkbox di Step 7
    toolsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateCurrentStep);
    });

    // Tombol Navigasi
    btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    // Tombol Skip (Langsung lompat ke dashboard pakai settingan default)
    btnSkip.addEventListener('click', () => {
        window.location.href = '../app/dashboard.html';
    });

    // Tombol Submit Form (Langkah Terakhir)
    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Sembunyikan form, tampilkan animasi loading
        document.getElementById('onboarding-form').style.display = 'none';
        document.querySelector('.onboarding-header').style.display = 'none';
        document.getElementById('loading-state').style.display = 'block';

        // Di sini lu bisa kumpulin datanya pakai FormData untuk dikirim ke Backend
        // const formData = new FormData(e.target);
        // console.log(Object.fromEntries(formData));

        // Simulasi AI memproses profil
        setTimeout(() => {
            // Setelah analisis selesai, lempar ke dashboard dengan parameter newuser=true
            // Parameter ini akan memicu animasi welcome di halaman dashboard
            window.location.href = '../app/dashboard.html?newuser=true';
        }, 3000);
    });

    // Inisialisasi awal
    updateUI();
});