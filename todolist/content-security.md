# Rencana Keamanan Konten (Content Security)

## 1. Tujuan

Memastikan integritas, ketersediaan, dan keamanan konten yang disajikan kepada pengguna serta melindungi aplikasi dari berbagai jenis serangan berbasis input. Tujuannya adalah untuk membangun kepercayaan pengguna dan menjaga aplikasi tetap stabil dan aman.

## 2. Rencana Implementasi Teknis

### a. Sanitasi Input (Input Sanitization)

- **Ancaman:** Serangan Cross-Site Scripting (XSS) di mana penyerang menyuntikkan skrip berbahaya melalui kolom input (pencarian, formulir masukan, catatan bookmark).
- **Area Terdampak:**
  - Fungsi Pencarian.
  - Fitur "Catatan Pribadi" pada Bookmark.
  - Formulir Umpan Balik Pengguna.
  - Input pertanyaan untuk fitur AI Insight.
- **Implementasi:**
  1.  **Frontend:**
      - Saat menampilkan konten yang dibuat pengguna (misalnya, catatan bookmark), **jangan pernah** menggunakan `dangerouslySetInnerHTML` di React.
      - React secara default melakukan *escaping* terhadap konten yang di-render, yang sudah merupakan lapisan pertahanan yang baik.
  2.  **Backend (Lapisan Pertahanan Terpenting):**
      - Sebelum menyimpan input apa pun ke database, lakukan sanitasi.
      - **Library:** Gunakan *library* yang teruji seperti `dompurify` (jika perlu menyimpan HTML) atau `xss-clean`/`sanitize-html` di lingkungan Node.js/Deno (misalnya, di dalam Supabase Edge Functions).
      - **Aturan:** Hapus semua tag HTML dan JavaScript yang tidak diinginkan dari input. Untuk kolom pencarian atau catatan, kemungkinan besar Anda hanya perlu menyimpan teks biasa, jadi hapus semua tag `<...>`.
      - **Contoh di API Endpoint:**
        ```javascript
        // Di dalam Supabase Edge Function atau server API Anda
        import DOMPurify from 'isomorphic-dompurify';

        const userInput = request.body.notes; // Mis: "<script>alert('xss')</script>Nice verse!"
        const cleanNotes = DOMPurify.sanitize(userInput);
        // cleanNotes akan menjadi: "Nice verse!"

        // Simpan `cleanNotes` ke database, bukan `userInput`.
        ```

### b. Pembatasan Tarif API (API Rate Limiting) & Pencegahan Penyalahgunaan

- **Ancaman:** Serangan Denial-of-Service (DoS) atau Brute Force di mana penyerang membanjiri API dengan permintaan dalam jumlah besar, menyebabkan server melambat atau *crash* dan biaya membengkak.
- **Area Terdampak:** Semua *endpoint* API, terutama yang melakukan operasi mahal (pencarian, interaksi AI) atau yang tidak diautentikasi.
- **Implementasi (di level API Gateway/Backend):**
  1.  **Supabase:** Supabase memiliki perlindungan penyalahgunaan bawaan, tetapi untuk kontrol lebih, Anda bisa mengimplementasikan *rate limiting* kustom di Edge Functions.
  2.  **Logika:**
      - Gunakan IP pengguna (atau `user_id` jika sudah login) sebagai kunci unik.
      - Simpan *timestamp* dari setiap permintaan di Redis atau tabel database.
      - Terapkan aturan: Izinkan maksimal X permintaan per menit per pengguna/IP. Jika terlampaui, kembalikan respons `429 Too Many Requests`.
  3.  **Contoh (di dalam Edge Function):**
      - Gunakan Upstash Redis (terintegrasi baik dengan Vercel/Supabase) untuk menyimpan *counter* per IP.
      - Sebelum menjalankan logika utama, periksa *counter*. Jika melebihi batas, hentikan eksekusi dan kembalikan error 429.

### c. Validasi Konten (Content Validation)

- **Ancaman:** Pengguna memasukkan data yang tidak valid atau berbahaya ke dalam sistem, yang dapat menyebabkan bug atau perilaku tak terduga.
- **Area Terdampak:** Semua input dari pengguna.
- **Implementasi:**
  1.  **Validasi Skema:** Gunakan *library* seperti `Zod` atau `Joi` baik di frontend maupun backend.
      - **Frontend:** Berikan umpan balik langsung kepada pengguna jika input tidak valid (misalnya, "Email tidak valid").
      - **Backend (Wajib):** Selalu validasi ulang semua data yang datang dari klien. Jangan pernah percaya input dari frontend. Validasi tipe data, panjang string, format, dll.
  2.  **Contoh dengan Zod di API Endpoint:**
      ```javascript
      import { z } from 'zod';

      const bookmarkSchema = z.object({
        surah_number: z.number().int().min(1).max(114),
        verse_number: z.number().int().min(1),
        notes: z.string().max(500).optional(),
      });

      const result = bookmarkSchema.safeParse(request.body);
      if (!result.success) {
        return new Response('Invalid input', { status: 400 });
      }
      // Lanjutkan dengan data yang sudah divalidasi: result.data
      ```

### d. Alur Autentikasi yang Aman (Secure Authentication Flows)

- **Ancaman:** Pembajakan akun, kebocoran token.
- **Implementasi:**
  1.  **Gunakan Penyedia Terpercaya:** Manfaatkan sistem autentikasi bawaan dari Supabase. Mereka sudah menangani banyak aspek keamanan seperti penyimpanan *password* yang di-*hash*, manajemen token (JWT), dan perlindungan dari serangan umum.
  2.  **HTTPS:** Pastikan seluruh aplikasi berjalan di atas HTTPS untuk mengenkripsi semua komunikasi antara klien dan server.
  3.  **Manajemen Token di Frontend:**
      - Simpan JWT (JSON Web Token) di dalam `HttpOnly` *cookie* jika memungkinkan (jika frontend dan backend berada di domain yang sama/subdomain). Ini adalah cara paling aman untuk mencegah XSS mencuri token.
      - Jika tidak memungkinkan, simpan di `localStorage` tetapi sadari risikonya. Pastikan sanitasi input (poin a) sangat ketat.
  4.  **Validasi Token di Backend:** Setiap *endpoint* yang memerlukan autentikasi harus memverifikasi validitas JWT yang dikirim dalam *header* `Authorization`.

## 4. Langkah-langkah Pengerjaan

1.  **[Prioritas Kritis]** Terapkan **Validasi Skema** dengan `Zod` di semua *endpoint* API backend. Ini adalah pertahanan pertama yang paling penting.
2.  **[Prioritas Kritis]** Terapkan **Sanitasi Input** di backend untuk semua data teks yang dibuat pengguna sebelum menyimpannya ke database.
3.  **[Prioritas Tinggi]** Konfigurasikan **API Rate Limiting** dasar, terutama pada *endpoint* pencarian dan AI.
4.  **[Prioritas Tinggi]** Audit alur autentikasi untuk memastikan token JWT ditangani dengan aman, sesuai dengan praktik terbaik yang disediakan oleh Supabase.
5.  **[Berkelanjutan]** Selalu perbarui dependensi (*library*) ke versi terbaru untuk mendapatkan perbaikan keamanan.
