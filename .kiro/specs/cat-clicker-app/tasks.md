# Implementation Plan: Cat Clicker App

## Overview

Implementasi Cat Clicker App sebagai Single Page Application berbasis HTML5, Vanilla JavaScript (ES6+), dan Tailwind CSS via CDN. Terdiri dari tiga file utama: `index.html` (struktur DOM dan CDN), `reaction-engine.js` (logika acak dan pool management), dan `app.js` (event handling dan UI update). Semua state hidup di memori — tidak ada penyimpanan persisten.

## Tasks

- [~] 1. Setup project structure dan konfigurasi testing
  - Buat file `package.json` dengan dependency `fast-check` dan `vitest` sebagai devDependencies
  - Buat file `vitest.config.js` dengan konfigurasi environment `jsdom`
  - Buat direktori `tests/` untuk menampung file unit test dan property test
  - _Requirements: 5.1, 5.2_

- [ ] 2. Implementasi `reaction-engine.js`
  - [-] 2.1 Buat modul `ReactionEngine` sebagai IIFE yang mengekspos `pick()`, `size()`, dan `getPool()`
    - Definisikan `pool` sebagai array berisi 10 string reaksi default (panjang 1–100 karakter, unik): `["Purrr...", "Meow!", "Zzz...", "*ngintip*", "Hiss!", "Nom nom nom", "Mrrrow?", "*geleng-geleng*", "Blink blink", "Chirp!"]`
    - Implementasikan `pick()`: kembalikan elemen acak dengan `Math.floor(Math.random() * pool.length)`, atau `null` + `console.error` bila pool kosong
    - Implementasikan `size()`: kembalikan `pool.length`
    - Implementasikan `getPool()`: kembalikan salinan pool dengan `[...pool]`
    - Ekspor sebagai `const ReactionEngine` di scope global (tidak menggunakan ES modules agar kompatibel dengan `<script>` tag)
    - _Requirements: 2.3, 2.6, 3.1, 3.2, 3.4, 3.6, 5.4_

  - [ ]* 2.2 Tulis property test untuk Property 3: Reaksi selalu berasal dari pool
    - **Property 3: Reaksi yang dikembalikan selalu berasal dari pool**
    - Generator: `fc.uniqueArray(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 50 })`
    - Set pool via test helper, panggil `pick()`, assert hasilnya adalah elemen dari pool — tidak pernah `undefined` atau di luar pool
    - Minimal 100 iterasi
    - **Validates: Requirements 2.3, 3.1**

  - [ ]* 2.3 Tulis property test untuk Property 4: Distribusi pemilihan mendekati seragam
    - **Property 4: Distribusi pemilihan reaksi mendekati seragam**
    - Generator: `fc.integer({ min: 5, max: 50 })` untuk ukuran pool
    - Panggil `pick()` 10.000 kali, hitung frekuensi relatif tiap elemen, assert `|freq(i) - freq(j)| < 0.01` untuk semua pasangan
    - Minimal 100 iterasi
    - **Validates: Requirements 2.3, 3.2**

  - [ ]* 2.4 Tulis property test untuk Property 5: Pool kosong dikembalikan sebagai null tanpa exception
    - **Property 5: Pool kosong dikembalikan sebagai null tanpa exception**
    - Set pool ke `[]`, panggil `pick()`, assert tidak throw, return value adalah `null`, dan `console.error` dipanggil
    - **Validates: Requirements 2.6, 3.6**

  - [ ]* 2.5 Tulis property test untuk Property 6: Invariant elemen pool — panjang dan keunikan
    - **Property 6: Invariant elemen pool — panjang dan keunikan**
    - Generator: `fc.uniqueArray(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 5, maxLength: 50 })`
    - Assert setiap elemen: panjang `[1, 100]` karakter, semua elemen unik (`Set(pool).size === pool.length`)
    - Minimal 100 iterasi
    - **Validates: Requirements 3.1, 3.4**

- [~] 3. Checkpoint — Verifikasi ReactionEngine
  - Pastikan semua test untuk `reaction-engine.js` lulus dengan `vitest --run`
  - Pastikan `pick()`, `size()`, dan `getPool()` bekerja sesuai kontrak
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan.

- [ ] 4. Implementasi `index.html`
  - [-] 4.1 Buat struktur HTML5 dengan semua elemen DOM yang dibutuhkan
    - Tambahkan `<!DOCTYPE html>`, `<html lang="id">`, meta charset, viewport
    - Tambahkan CDN Tailwind CSS via `<script src="https://cdn.tailwindcss.com"></script>`
    - Buat `<div id="cat-display">` sebagai wrapper utama Cat_Display
    - Tambahkan `<h1 id="cat-name">Whiskers</h1>` untuk Cat_Name (≤50 karakter)
    - Tambahkan `<img id="cat-image" src="..." alt="Whiskers" />` dengan `cursor-pointer` class Tailwind; tambahkan `onerror` handler untuk fallback placeholder
    - Tambahkan `<p id="reaction-text" aria-live="polite" hidden></p>` untuk overlay reaksi (tersembunyi secara default)
    - Tambahkan `<p id="score-display">Klik: <span id="click-count">0</span></p>` untuk Score_Display
    - Tambahkan `<noscript>` dengan pesan fallback browser tidak didukung
    - Load `<script src="reaction-engine.js"></script>` lalu `<script src="app.js"></script>` sebelum `</body>`
    - Gunakan Tailwind classes untuk responsivitas: layout tidak overflow horizontal pada 320px–1920px
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 5.2, 5.3, 5.5_

  - [~] 4.2 Tambahkan styling Tailwind untuk Cat_Display dan elemen anak
    - Gunakan flexbox/grid Tailwind untuk memusatkan Cat_Display secara vertikal dan horizontal
    - Pastikan `#cat-image` memiliki min-width/height 100px dan `object-contain` agar rasio aspek terjaga
    - Pastikan `#score-display` selalu terlihat tanpa scroll pada viewport ≥320px tinggi
    - Tambahkan class animasi CSS (misalnya `animate-bounce` atau custom keyframe) pada `#cat-image` yang ditoggle saat reaksi aktif
    - Pastikan `#reaction-text` memiliki kontras warna minimal 4.5:1 WCAG AA terhadap background-nya
    - _Requirements: 1.2, 4.2, 4.3, 4.4, 4.5, 3.5_

- [ ] 5. Implementasi `app.js`
  - [~] 5.1 Buat modul `App` sebagai IIFE dengan state `clickCount` dan `reactionTimer`
    - Definisikan `let clickCount = 0` dan `let reactionTimer = null`
    - Implementasikan `init()`: query semua elemen DOM yang dibutuhkan, pasang event listener `click` pada `#cat-image`, panggil `updateScore(0)` untuk render state awal
    - Tambahkan `document.addEventListener('DOMContentLoaded', App.init)` di bawah definisi App
    - _Requirements: 1.1, 1.4, 1.5, 5.1_

  - [~] 5.2 Implementasikan `handleCatClick()` — increment counter dan trigger reaksi
    - Increment `clickCount` dengan `Math.min(clickCount + 1, 999999)` (tidak pernah melampaui batas)
    - Panggil `updateScore(clickCount)` untuk memperbarui DOM Score_Display
    - Panggil `ReactionEngine.pick()`; jika hasilnya bukan `null`, panggil `showReaction(text)`; jika `null`, skip tampilan reaksi (counter tetap bertambah)
    - _Requirements: 1.4, 2.1, 2.2, 2.6_

  - [~] 5.3 Implementasikan `updateScore(count)` — perbarui Score_Display di DOM
    - Query `#click-count` dan set `textContent = count`
    - Pastikan update terjadi sinkron (dalam satu call stack) sehingga tampil dalam <100ms
    - _Requirements: 2.2_

  - [~] 5.4 Implementasikan `showReaction(text)` — tampilkan reaksi dengan timer
    - Jika `reactionTimer` tidak null, panggil `clearTimeout(reactionTimer)` terlebih dahulu (klik baru menggantikan reaksi aktif)
    - Set `textContent` pada `#reaction-text` ke `text` dan hapus atribut `hidden`
    - Toggle class animasi CSS pada `#cat-image` (remove lalu add untuk restart animasi)
    - Set `reactionTimer = setTimeout(restoreDefault, 1500)`
    - _Requirements: 2.4, 2.5, 3.5_

  - [~] 5.5 Implementasikan `restoreDefault()` — kembalikan Cat_Display ke tampilan default
    - Set atribut `hidden` kembali pada `#reaction-text`
    - Hapus class animasi CSS dari `#cat-image`
    - Set `reactionTimer = null`
    - _Requirements: 2.4_

  - [ ]* 5.6 Tulis property test untuk Property 1: Klik meningkatkan counter tepat satu
    - **Property 1: Klik meningkatkan counter tepat satu**
    - Generator: `fc.integer({ min: 0, max: 999998 })`
    - Simulasi `clickCount` awal = n, jalankan logika increment, assert `clickCount === n + 1`
    - Minimal 100 iterasi
    - **Validates: Requirements 2.1**

  - [ ]* 5.7 Tulis property test untuk Property 2: Counter selalu berada dalam batas yang valid
    - **Property 2: Counter selalu berada dalam batas yang valid**
    - Generator: `fc.integer({ min: 0, max: 999999 })`
    - Simulasi increment dari setiap nilai awal, assert `0 ≤ clickCount ≤ 999999`
    - Minimal 100 iterasi
    - **Validates: Requirements 1.4**

  - [ ]* 5.8 Tulis property test untuk Property 7: Klik saat reaksi aktif mereset durasi ke 1500ms
    - **Property 7: Klik saat reaksi aktif mereset durasi tampil ke 1500ms**
    - Generator: `fc.integer({ min: 0, max: 1499 })` sebagai elapsed time
    - Gunakan fake timers Vitest (`vi.useFakeTimers`); simulasi `showReaction`, advance timer sebesar `elapsed`, simulasi klik baru, assert timer baru dijadwalkan ≥ 1500ms dari klik terakhir
    - Minimal 100 iterasi
    - **Validates: Requirements 2.5**

  - [ ]* 5.9 Tulis unit tests untuk App Controller
    - Test: `Score_Display` diperbarui segera setelah klik (nilai DOM sesuai `clickCount`)
    - Test: `showReaction()` menyembunyikan teks setelah 1500ms menggunakan fake timers
    - Test: klik saat reaksi aktif memanggil `clearTimeout` sebelum membuat timer baru
    - Test: `clickCount` tidak melampaui 999999 saat mulai dari 999999
    - _Requirements: 1.4, 2.1, 2.2, 2.4, 2.5_

- [~] 6. Checkpoint — Verifikasi integrasi App Controller
  - Pastikan semua test untuk `app.js` lulus dengan `vitest --run`
  - Verifikasi bahwa `handleCatClick`, `updateScore`, `showReaction`, dan `restoreDefault` bekerja bersama
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan.

- [ ] 7. Integrasi akhir dan wiring
  - [~] 7.1 Pastikan urutan script load di `index.html` sudah benar
    - `reaction-engine.js` harus di-load sebelum `app.js` agar `ReactionEngine` tersedia di scope global saat `App` diinisialisasi
    - Verifikasi tidak ada `import`/`export` ES module (pakai IIFE global agar kompatibel dengan `<script>` tanpa `type="module"`)
    - _Requirements: 5.1, 5.2, 5.4_

  - [~] 7.2 Tambahkan gambar kucing dan pastikan fallback berfungsi
    - Gunakan URL gambar publik (mis. `https://placekitten.com/400/400`) sebagai `src` default `#cat-image`
    - Tambahkan `onerror="this.src='https://placehold.co/400x400?text=Cat'"` sebagai fallback bila gambar gagal dimuat
    - Verifikasi gambar tampil dengan dimensi minimal 100×100px dan rasio aspek terjaga
    - _Requirements: 1.2_

  - [ ]* 7.3 Tulis integration test DOM — alur klik end-to-end
    - Gunakan `jsdom` via Vitest untuk merender `index.html`
    - Simulasi klik pada `#cat-image`, assert: `#click-count` bertambah 1, `#reaction-text` tidak lagi `hidden`, teks reaksi berasal dari `ReactionEngine.getPool()`
    - Advance fake timer 1500ms, assert `#reaction-text` kembali `hidden`
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_

- [~] 8. Final checkpoint — Semua test lulus
  - Jalankan `vitest --run` dan pastikan semua test lulus tanpa error
  - Buka `index.html` langsung di browser (Chrome/Firefox/Edge/Safari) tanpa server — pastikan klik berfungsi, score bertambah, dan reaksi tampil
  - Tanyakan kepada user jika ada pertanyaan sebelum dianggap selesai.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk traceabilitas
- Property tests menggunakan `fast-check` dengan minimal 100 iterasi per property
- Unit tests menggunakan `vitest` dengan `jsdom` environment untuk simulasi DOM
- Urutan load script (`reaction-engine.js` → `app.js`) wajib dijaga agar `ReactionEngine` tersedia secara global
- Durasi reaksi di design menggunakan 1500ms sebagai nilai tetap (bukan 1500–3000ms random) untuk menyederhanakan logic timer dan property test

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "4.2"] },
    { "id": 3, "tasks": ["5.1", "7.2"] },
    { "id": 4, "tasks": ["5.2", "5.3", "5.4", "5.5"] },
    { "id": 5, "tasks": ["5.6", "5.7", "5.8", "5.9", "7.1"] },
    { "id": 6, "tasks": ["7.3"] }
  ]
}
```
