document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.getElementById('uploadTriggerBtn');
    const uploadMenu = document.getElementById('uploadMenu');

    // 1. Fungsi Toggle Menu (Buka/Tutup saat tombol ditekan)
    triggerBtn.addEventListener('click', (event) => {
        // Mencegah event bubbling ke document
        event.stopPropagation();

        const isExpanded = triggerBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // 2. Fungsi Klik di Luar Menu (Biar menu tertutup otomatis kalau user klik sembarang tempat)
    document.addEventListener('click', (event) => {
        // Jika klik bukan di dalam menu dan bukan di tombol trigger, tutup menu
        if (!uploadMenu.contains(event.target) && event.target !== triggerBtn) {
            closeMenu();
        }
    });

    // 3. Tangani Klik pada Item Menu
    const menuItems = document.querySelectorAll('.upload-menu__item');
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const action = event.currentTarget.getAttribute('data-action');

            // Simulasi Aksi (Nantinya di sini lu panggil Modal/Fungsi Backend)
            console.log(`Action selected: ${action}`);

            // Khusus untuk simulasi, kita pakai alert sementara
            // alert(`Membuka menu: ${action}`);

            // Tutup menu setelah item dipilih
            closeMenu();
        });
    });

    // Fungsi Helper
    function openMenu() {
        uploadMenu.removeAttribute('hidden');
        // Sedikit delay agar transisi CSS jalan
        setTimeout(() => {
            uploadMenu.classList.add('show');
        }, 10);
        triggerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        uploadMenu.classList.remove('show');
        triggerBtn.setAttribute('aria-expanded', 'false');
        // Tunggu animasi selesai baru pasang atribut hidden
        setTimeout(() => {
            uploadMenu.setAttribute('hidden', 'true');
        }, 200);
    }
});