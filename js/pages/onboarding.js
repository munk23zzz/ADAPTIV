document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step-card');
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const btnSubmit = document.getElementById('btn-submit');
    const btnSkip = document.getElementById('btn-skip');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');


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

        // Logika Radio button biasa untuk semua step
        const radioGroup = currentActiveCard.querySelectorAll('input[type="radio"]');
        let isChecked = false;
        radioGroup.forEach(radio => {
            if (radio.checked) isChecked = true;
        });

        if (currentStep === totalSteps) {
            btnSubmit.disabled = !isChecked;
        } else {
            btnNext.disabled = !isChecked;
        }
    }

    // Event Listener untuk semua input (tombol next hanya aktif jika sudah memilih)
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
            validateCurrentStep();
        });
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

    // Tombol Skip (Redirect ke dashboard dengan parameter newuser=true)
    btnSkip.addEventListener('click', () => {
        // Sembunyikan UI utama
        document.getElementById('onboarding-form').style.display = 'none';
        document.querySelector('.onboarding-header').style.display = 'none';
        
        // Tampilkan loading state sebentar biar premium
        document.getElementById('loading-state').style.display = 'block';
        
        setTimeout(() => {
            window.location.href = '../app/dashboard.html?newuser=true';
        }, 1500);
    });

    // Tombol Submit Form (Langkah Terakhir)
    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Sembunyikan form, tampilkan animasi loading
        document.getElementById('onboarding-form').style.display = 'none';
        document.querySelector('.onboarding-header').style.display = 'none';
        document.getElementById('loading-state').style.display = 'block';

        // Simulasi AI memproses profil
        setTimeout(() => {
            window.location.href = '../app/dashboard.html?newuser=true';
        }, 3000);
    });

    // Inisialisasi awal
    updateUI();
});