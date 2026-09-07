/**
 * ReactionEngine
 *
 * Modul pure-logic untuk manajemen Reaction_Pool dan pemilihan reaksi acak.
 * Diekspor sebagai objek global `ReactionEngine` agar kompatibel dengan
 * pemuatan via <script> tag tanpa ES modules.
 *
 * Public API:
 *   pick()         → string | null
 *   size()         → number
 *   getPool()      → string[]
 *   _setPool(arr)  → void  (test helper — jangan digunakan di production)
 */
const ReactionEngine = (() => {
  /**
   * Reaction_Pool: array string reaksi default.
   * Invariant: 5–50 elemen, setiap elemen unik, panjang 1–100 karakter.
   */
  let pool = [
    "Purrr...",
    "Meow!",
    "Zzz...",
    "*ngintip*",
    "Hiss!",
    "Nom nom nom",
    "Mrrrow?",
    "*geleng-geleng*",
    "Blink blink",
    "Chirp!",
  ];

  /**
   * Mengembalikan satu reaksi acak seragam dari pool.
   * Jika pool kosong, mencatat error ke konsol dan mengembalikan null.
   *
   * @returns {string|null}
   */
  function pick() {
    if (pool.length === 0) {
      console.error(
        "[ReactionEngine] Reaction_Pool is empty — cannot pick a reaction."
      );
      return null;
    }
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  /**
   * Mengembalikan jumlah reaksi yang tersedia di pool.
   *
   * @returns {number}
   */
  function size() {
    return pool.length;
  }

  /**
   * Mengembalikan salinan dangkal dari pool (aman untuk dibaca oleh caller).
   *
   * @returns {string[]}
   */
  function getPool() {
    return [...pool];
  }

  /**
   * TEST HELPER — Mengganti isi pool dengan array yang diberikan.
   * Digunakan oleh property tests untuk menyuntikkan pool kustom.
   * Jangan digunakan di production.
   *
   * @param {string[]} arr
   */
  function _setPool(arr) {
    pool = arr;
  }

  return { pick, size, getPool, _setPool };
})();
