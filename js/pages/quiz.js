/* ============================================================
   ADAPTIV — Kuis Interaktif JS Logic
   Handles quiz data rendering, dynamic state tracking,
   explanations, XSS protection, and theme integration.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- DATA KUIS DEFAULT ---
  let quizData = [
    {
      question: "Properti CSS apa yang digunakan untuk mengubah warna latar belakang sebuah elemen?",
      options: [
        { text: "color", isCorrect: false, rationale: "Properti 'color' digunakan untuk mengubah warna teks, bukan warna latar belakang." },
        { text: "background-style", isCorrect: false, rationale: "Tidak ada properti CSS yang bernama 'background-style'." },
        { text: "background-color", isCorrect: true, rationale: "Tepat sekali! Properti 'background-color' mengatur warna latar belakang suatu elemen dalam CSS." },
        { text: "bgcolor", isCorrect: false, rationale: "'bgcolor' adalah atribut HTML usang, bukan properti CSS standar." }
      ]
    },
    {
      question: "Bagaimana cara memilih elemen HTML dengan ID \"app\" menggunakan JavaScript murni?",
      options: [
        { text: "document.querySelector(\".app\")", isCorrect: false, rationale: "Penggunaan titik (.) pada querySelector digunakan untuk mencari class, bukan ID." },
        { text: "document.getElementById(\"app\")", isCorrect: true, rationale: "Benar! Ini adalah metode bawaan DOM yang paling umum untuk mengambil elemen berdasarkan ID-nya." },
        { text: "document.getElement(\"app\")", isCorrect: false, rationale: "Metode ini tidak ada dalam spesifikasi JavaScript DOM standar." }
      ]
    },
    {
      question: "Untuk mencegah serangan XSS saat menampilkan teks inputan user ke layar, properti DOM apa yang paling aman digunakan?",
      options: [
        { text: "innerHTML", isCorrect: false, rationale: "Penggunaan 'innerHTML' sangat berbahaya karena akan mengeksekusi tag HTML dan script jahat yang disisipkan oleh pengguna." },
        { text: "outerHTML", isCorrect: false, rationale: "Sama seperti innerHTML, properti ini mem-parsing HTML sehingga rentan terhadap serangan XSS." },
        { text: "textContent", isCorrect: true, rationale: "Tepat! Properti 'textContent' secara otomatis melakukan escape karakter sehingga teks aman dari injeksi script HTML." }
      ]
    }
  ];

  // --- INISIALISASI DOM ---
  let currentQuestionIndex = 0;
  let score = 0;

  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const questionCounter = document.getElementById('question-counter');
  const progressFill = document.getElementById('progress-fill');
  
  const feedbackBox = document.getElementById('feedback-box');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackRationale = document.getElementById('feedback-rationale');
  
  const btnNext = document.getElementById('btn-next');

  // --- LOGIKA APLIKASI ---

  function loadQuestion() {
    if (!quizData || quizData.length === 0) {
      questionText.textContent = "Tidak ada soal tersedia.";
      return;
    }
    const currentQuiz = quizData[currentQuestionIndex];
    
    // Update Header Text & Progress
    questionCounter.textContent = `Soal ${currentQuestionIndex + 1}/${quizData.length}`;
    progressFill.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    
    // Keamanan: Gunakan textContent agar kebal XSS
    questionText.textContent = currentQuiz.question;
    
    // Reset area opsi dan feedback
    optionsContainer.innerHTML = '';
    feedbackBox.hidden = true;
    btnNext.hidden = true;
    feedbackBox.className = 'feedback-box'; // Reset class

    // Render tombol jawaban
    currentQuiz.options.forEach((option) => {
      const button = document.createElement('button');
      button.classList.add('option-btn');
      
      // Bungkus text ke dalam span untuk struktur yang rapi
      const textSpan = document.createElement('span');
      textSpan.textContent = option.text;
      button.appendChild(textSpan);

      button.addEventListener('click', () => selectAnswer(option, button));
      optionsContainer.appendChild(button);
    });
  }

  function selectAnswer(selectedOption, selectedButton) {
    // 1. Disable semua tombol biar user cuma bisa klik 1 kali
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    // 2. Tandai tombol yang diklik
    if (selectedOption.isCorrect) {
      selectedButton.classList.add('correct');
      score++;
      
      feedbackBox.classList.add('correct-feedback');
      feedbackIcon.textContent = '✅';
      feedbackTitle.textContent = 'Jawaban Benar!';
      feedbackTitle.style.color = 'var(--color-success)';
    } else {
      selectedButton.classList.add('incorrect');
      
      feedbackBox.classList.add('incorrect-feedback');
      feedbackIcon.textContent = '❌';
      feedbackTitle.textContent = 'Jawaban Kurang Tepat';
      feedbackTitle.style.color = 'var(--color-error)';
      
      // Beri highlight jawaban yang bener (Opsional, fitur ramah pengguna)
      const correctIndex = quizData[currentQuestionIndex].options.findIndex(opt => opt.isCorrect);
      if (correctIndex !== -1 && allButtons[correctIndex]) {
        allButtons[correctIndex].classList.add('correct');
      }
    }

    // 3. Tampilkan Rasional / Penjelasan
    feedbackRationale.textContent = selectedOption.rationale;
    feedbackBox.hidden = false;
    
    // 4. Munculkan tombol Lanjut
    btnNext.hidden = false;
  }

  // Event Lanjut ke soal berikutnya
  btnNext.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
      loadQuestion();
    } else {
      // Akhir dari kuis
      showResults();
    }
  });

  function showResults() {
    questionText.textContent = "Kuis Selesai! 🎉";
    
    optionsContainer.innerHTML = `
      <div style="text-align: center; padding: 24px; background: var(--bg-surface-2); border-radius: var(--radius-md); border: 1px solid var(--accent-primary);">
        <h3 style="color: var(--accent-primary); margin-bottom: 12px; font-family: var(--font-display);">Skor Akhir Kamu:</h3>
        <p style="font-size: 2.25rem; font-weight: bold; color: var(--text-primary); font-family: var(--font-display);">${score} / ${quizData.length}</p>
      </div>
    `;
    
    feedbackBox.hidden = true;
    btnNext.textContent = "Kembali ke Dashboard";
    btnNext.hidden = false;
    
    // Ganti fungsi tombol next untuk redirect ke dashboard
    btnNext.onclick = () => {
      // Redirect to correct dashboard path pages/app/dashboard.html
      window.location.href = '../app/dashboard.html';
    };
  }

  // Global Initialization function to receive custom quiz data dynamically
  window.initQuiz = function(customQuizData) {
    if (customQuizData && Array.isArray(customQuizData)) {
      quizData = customQuizData;
    }
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
  };

  // Mulai Kuis
  loadQuestion();
});
