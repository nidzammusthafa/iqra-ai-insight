# Quran Frontend - Aplikasi Studi Al-Qur'an dengan AI

**Aplikasi mobile-first untuk membaca Al-Qur'an dengan wawasan ayat berbasis AI, hadits, dan pencarian yang mudah.**

## 🌟 Fitur Utama

### 📱 Mobile-First Design
- **Navigasi Bawah**: Tab bar dengan Qur'an, Hadits, dan Pencarian
- **Responsif**: Dioptimalkan untuk perangkat mobile
- **Antarmuka Bersih**: Fokus pada pengalaman membaca yang nyaman

### 📖 Modul Al-Qur'an
- **114 Surah Lengkap**: Daftar lengkap dengan terjemahan Indonesia
- **Tampilan Ayat**: Teks Arab dengan font Amiri yang indah
- **Toggle Terjemahan**: Buka/tutup terjemahan secara mudah
- **Navigasi Intuitif**: Pindah antar surah dengan mudah

### 🤖 Wawasan Ayat AI
- **Asbabun Nuzul**: Latar belakang turunnya ayat
- **Hadits Terkait**: Hadits yang relevan dengan ayat
- **Tafsir Ringkas**: Penjelasan singkat dan konteks sejarah
- **Ayat Terkait**: Hubungan antar ayat dalam Al-Qur'an

### 📚 Modul Hadits
- **Perawi Terpercaya**: Bukhari, Muslim, Abu Dawud, Ahmad, dll.
- **Pencarian Hadits**: Cari hadits berdasarkan perawi
- **Tampilan Bersih**: Teks Arab dan terjemahan Indonesia

### 🔍 Pencarian Canggih
- **Pencarian Ayat**: Cari di seluruh Al-Qur'an berdasarkan terjemahan
- **Pencarian Surah**: Temukan surah berdasarkan nama
- **Filter Hasil**: Hasil pencarian yang relevan dan terstruktur

## 🎨 Design System

### Warna Utama
- **Primary**: Islamic Green (#22C55E) - Melambangkan kedamaian dan spiritualitas
- **Secondary**: Golden (#F59E0B) - Aksen elegan dan kemewahan
- **Gradients**: Kombinasi hijau dan emas untuk elemen hero

### Typography
- **Arabic Text**: Font Amiri untuk teks Arab yang indah
- **UI Text**: Font Inter untuk antarmuka yang modern
- **Responsive Sizing**: Ukuran font yang adaptif untuk berbagai perangkat

### Komponen
- **Verse Cards**: Kartu ayat dengan shadow dan border yang elegan
- **AI Panel**: Panel wawasan dengan gradient background
- **Navigation**: Bottom tab bar dengan animasi smooth
- **Loading States**: Spinner yang konsisten dengan design system

## 🛠 Teknologi

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS dengan design system kustom
- **UI Components**: Shadcn UI yang dikustomisasi
- **State Management**: TanStack Query untuk data fetching
- **Routing**: React Router v6
- **Build Tool**: Vite
- **API**: Integrasi dengan quran-api2.vercel.app

## 🔧 Struktur Proyek

```
src/
├── components/
│   ├── layout/
│   │   └── MobileLayout.tsx      # Layout mobile dengan bottom navigation
│   ├── quran/
│   │   ├── SurahCard.tsx         # Kartu surah di halaman utama
│   │   ├── VerseCard.tsx         # Kartu ayat dengan kontrol
│   │   └── AIInsightPanel.tsx    # Panel wawasan AI
│   └── ui/                       # Komponen UI dasar (Shadcn)
├── pages/
│   ├── QuranHome.tsx             # Halaman utama Al-Qur'an
│   ├── SurahDetail.tsx           # Detail surah dengan ayat
│   ├── HaditsHome.tsx            # Halaman hadits
│   ├── SearchPage.tsx            # Halaman pencarian
│   └── NotFound.tsx              # Halaman 404
├── services/
│   └── quranApi.ts               # Service untuk API calls
├── types/
│   └── quran.ts                  # TypeScript definitions
└── index.css                    # Design system & styles
```

## 🚀 Instalasi & Development

```bash
# Clone repository
git clone <repository-url>
cd quran-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Penggunaan

1. **Navigasi**: Gunakan tab bar di bawah untuk beralih antara Qur'an, Hadits, dan Pencarian
2. **Membaca Surah**: Pilih surah dari daftar, scroll untuk membaca ayat
3. **Toggle Terjemahan**: Tap ikon mata untuk show/hide terjemahan
4. **Wawasan AI**: Tap ikon lampu untuk mendapat insight ayat
5. **Pencarian**: Cari ayat atau surah dengan kata kunci
6. **Sharing**: Tap ikon share untuk berbagi ayat

## 🎯 Roadmap

### Fitur yang Akan Datang
- [ ] **Audio Qur'an**: Tilawah dari berbagai qari
- [ ] **Bookmark**: Simpan ayat favorit
- [ ] **Tampilan Juz**: Baca per juz atau halaman mushaf
- [ ] **Chatbot AI**: Tanya jawab interaktif tentang Islam
- [ ] **Offline Mode**: Akses tanpa internet
- [ ] **Dark/Light Theme**: Toggle tema
- [ ] **Font Settings**: Kontrol ukuran dan jenis font

### Integrasi AI
- [ ] **Backend AI**: Implementasi model LLM khusus data Islam
- [ ] **Fine-tuning**: Training dengan data tafsir dan hadits
- [ ] **Caching**: Optimasi performa AI response
- [ ] **Accuracy Review**: Review ahli untuk akurasi konten

## 🔐 Keamanan & Akurasi

- **Disclaimer AI**: Setiap wawasan AI disertai disclaimer
- **Sumber Terpercaya**: Data dari API yang sudah divalidasi
- **Review Process**: Rencana review konten oleh ahli
- **Error Handling**: Penanganan error yang graceful

## 💡 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini menggunakan lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- **API**: Terima kasih kepada quran-api2.vercel.app
- **Design Inspiration**: Islamic art and calligraphy
- **Community**: Feedback dan dukungan dari komunitas Muslim developers

---

**"Dan Kami turunkan kepadamu Al-Qur'an sebagai penjelasan segala sesuatu..."** - QS. An-Nahl: 89