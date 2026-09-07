# Requirements Document

## Introduction

Cat Clicker App adalah aplikasi web single page (SPA) berbasis HTML5, Vanilla JavaScript, dan Tailwind CSS. Pengguna dapat melihat gambar kucing dan berinteraksi dengan kucing tersebut melalui klik. Setiap klik menghasilkan reaksi acak dari kucing, menciptakan pengalaman yang menyenangkan dan bervariasi. Aplikasi ini berjalan sepenuhnya di sisi klien tanpa memerlukan backend.

## Glossary

- **App**: Aplikasi web Cat Clicker secara keseluruhan
- **Cat_Display**: Komponen UI yang menampilkan gambar kucing aktif beserta informasi terkait
- **Cat_Image**: Gambar kucing yang ditampilkan kepada pengguna
- **Click_Counter**: Komponen yang mencatat dan menampilkan jumlah klik pada kucing aktif
- **Reaction_Engine**: Modul JavaScript yang memilih dan menampilkan reaksi acak kucing
- **Reaction**: Respons teks dan/atau visual yang muncul setelah kucing diklik
- **Reaction_Pool**: Kumpulan reaksi yang tersedia untuk dipilih secara acak
- **Cat_Name**: Nama unik yang dimiliki setiap kucing
- **Score_Display**: Komponen UI yang menampilkan jumlah klik saat ini

---

## Requirements

### Requirement 1: Tampilan Kucing

**User Story:** Sebagai pengguna, saya ingin melihat gambar kucing di halaman utama, sehingga saya dapat berinteraksi dengan kucing tersebut.

#### Acceptance Criteria

1. WHEN halaman pertama kali dimuat, THE **App** SHALL menampilkan tepat satu **Cat_Display** yang berisi **Cat_Image**, **Cat_Name**, dan **Score_Display**.
2. THE **Cat_Display** SHALL memuat **Cat_Image** dengan lebar dan tinggi masing-masing minimal 100px dan rasio aspek dipertahankan.
3. THE **Cat_Display** SHALL memuat **Cat_Name** berupa teks tidak kosong dengan panjang maksimal 50 karakter, yang ditampilkan di atas atau di bawah **Cat_Image**.
4. THE **Cat_Display** SHALL memuat **Score_Display** yang menampilkan bilangan bulat non-negatif dengan nilai awal `0` dan maksimum `999999`.
5. WHEN halaman di-refresh, THE **App** SHALL mereset **Click_Counter** ke nilai `0` sebelum **Cat_Display** ditampilkan.

---

### Requirement 2: Interaksi Klik

**User Story:** Sebagai pengguna, saya ingin dapat mengklik gambar kucing, sehingga saya dapat berinteraksi dan mendapatkan respons dari kucing tersebut.

#### Acceptance Criteria

1. WHEN pengguna mengklik **Cat_Image**, THE **Click_Counter** SHALL menambah nilai klik sebesar `1` dari nilai sebelumnya.
2. WHEN pengguna mengklik **Cat_Image**, THE **Score_Display** SHALL memperbarui tampilan angka klik dalam waktu kurang dari `100` milidetik tanpa reload halaman.
3. WHEN pengguna mengklik **Cat_Image**, THE **Reaction_Engine** SHALL memilih satu **Reaction** secara acak dari **Reaction_Pool** dengan distribusi peluang yang merata di antara semua **Reaction** yang tersedia.
4. WHEN pengguna mengklik **Cat_Image**, THE **Cat_Display** SHALL menampilkan **Reaction** yang dipilih selama minimal `1500` milidetik dan maksimal `3000` milidetik sebelum kembali ke tampilan default **Cat_Image**.
5. WHILE **Reaction** sedang ditampilkan, THE **App** SHALL tetap menerima klik baru dari pengguna, di mana setiap klik baru akan menggantikan **Reaction** yang sedang tampil dan memulai ulang durasi tampilan `1500` milidetik.
6. IF **Reaction_Pool** tidak memiliki **Reaction** yang tersedia, THEN THE **Reaction_Engine** SHALL tetap menambah nilai **Click_Counter** tanpa menampilkan **Reaction** apapun.

---

### Requirement 3: Reaksi Acak Kucing

**User Story:** Sebagai pengguna, saya ingin kucing memberikan reaksi yang bervariasi setiap kali saya mengklik, sehingga pengalaman bermain terasa lebih menarik dan tidak monoton.

#### Acceptance Criteria

1. THE **Reaction_Pool** SHALL berisi minimal `5` (lima) dan maksimal `50` (lima puluh) **Reaction** yang unik secara string satu sama lain.
2. WHEN **Reaction_Engine** memilih **Reaction**, THE **Reaction_Engine** SHALL menggunakan metode seleksi acak seragam sehingga perbedaan peluang antar **Reaction** tidak melebihi `1%`.
3. WHEN **Reaction** yang sama terpilih dua kali berturut-turut, THE **Reaction_Engine** SHALL tetap menampilkan **Reaction** tersebut tanpa memaksakan pergantian.
4. THE **Reaction** SHALL berupa teks deskriptif yang menggambarkan ekspresi atau perilaku kucing, dengan panjang antara `1` hingga `100` karakter (contoh: "Purrr...", "Meow!", "Zzz...").
5. WHERE animasi CSS didukung oleh browser, THE **Cat_Display** SHALL menampilkan animasi singkat pada **Cat_Image** saat **Reaction** ditampilkan, dengan durasi animasi antara `200` hingga `1000` milidetik.
6. IF **Reaction_Pool** kosong atau tidak tersedia, THEN THE **Reaction_Engine** SHALL mencatat error ke konsol browser dan tidak menampilkan **Reaction** apapun.

---

### Requirement 4: Antarmuka Pengguna (UI)

**User Story:** Sebagai pengguna, saya ingin antarmuka yang bersih dan responsif, sehingga saya dapat menikmati aplikasi di berbagai ukuran layar.

#### Acceptance Criteria

1. THE **App** SHALL dirender menggunakan HTML5 dan di-styling menggunakan Tailwind CSS tanpa framework CSS lainnya.
2. THE **App** SHALL menampilkan layout tanpa horizontal overflow atau horizontal scroll pada lebar viewport apapun dalam rentang `320px` hingga `1920px`.
3. THE **Cat_Image** SHALL menampilkan kursor `pointer` saat di-hover, menandakan elemen tersebut dapat diklik.
4. THE **Score_Display** SHALL selalu terlihat tanpa perlu scroll pada viewport berukuran minimal `320px` tinggi.
5. WHEN **Reaction** ditampilkan, THE **Cat_Display** SHALL menampilkan teks **Reaction** dengan rasio kontras warna minimal `4.5:1` (WCAG AA) terhadap latar belakangnya.

---

### Requirement 5: Implementasi Teknis

**User Story:** Sebagai developer, saya ingin aplikasi dibangun dengan tech stack yang telah ditentukan, sehingga kodenya mudah dipahami, dijalankan, dan dikembangkan lebih lanjut.

#### Acceptance Criteria

1. THE **App** SHALL diimplementasikan menggunakan Vanilla JavaScript tanpa library atau framework JavaScript eksternal.
2. THE **App** SHALL dapat dijalankan langsung di Chrome 80+, Firefox 75+, Edge 80+, dan Safari 13+ dengan membuka file `index.html` tanpa memerlukan server backend.
3. THE **App** SHALL memuat Tailwind CSS melalui CDN link di dalam file `index.html`.
4. THE **Reaction_Engine** SHALL diimplementasikan dalam file JavaScript terpisah dari file HTML, sehingga logika pemilihan reaksi tidak tercampur dengan logika tampilan.
5. IF browser tidak mendukung fitur JavaScript modern (ES6+), THEN THE **App** SHALL menampilkan pesan fallback yang terlihat di layar, menyatakan bahwa browser tidak didukung dan merekomendasikan pengguna untuk menggunakan browser yang lebih baru.
