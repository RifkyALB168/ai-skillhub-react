# AI SkillHub (React)

**Nama:** Rifky Albuchori  
**NIM:** 103022400126  
**Kelas:** SE-48-04  
**Studi Kasus:** AI SkillHub (Community-driven AI Skills Repository)

---

## Deskripsi

AI SkillHub adalah aplikasi untuk menemukan, menyimpan, dan membagikan *AI Skills* dari berbagai ekosistem AI (Claude, OpenAI, Gemini, hingga AI Agents). Repository ini adalah frontend React yang akan terus dikembangkan sampai pekan ke-14 dan disambungkan ke backend/API pada pekan ke-11.

**Entitas utama:** Skill, dengan atribut `name`, `description`, `category`, `platform`, `author`, dan `favs`.

## Teknologi

- [React 19](https://react.dev/) dengan [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) melalui plugin `@tailwindcss/vite`
- Font [Geist](https://fonts.google.com/specimen/Geist) dari Google Fonts

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

> Jika PowerShell menolak menjalankan `npm` karena *execution policy*, gunakan `npm.cmd run dev` atau jalankan dari Git Bash/CMD.

## Struktur Folder

```
ai-skillhub-react/
├── index.html
├── public/
│   └── logo.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── Header.jsx
│       ├── SkillSummary.jsx
│       ├── SkillForm.jsx
│       ├── SkillList.jsx
│       └── SkillCard.jsx
└── docs/
    └── screenshots/
```

---

## Minggu 6: React Dasar

### Component

| Component | Props | Fungsi |
|---|---|---|
| `Header` | `title`, `subtitle` | Logo dan judul aplikasi |
| `SkillSummary` | `totalSkill`, `totalKategori`, `totalFavorit` | Ringkasan jumlah data skill |
| `SkillForm` | `categories`, `platforms`, `onAdd` | Form tambah skill (controlled component) |
| `SkillList` | `skills`, `onDelete` | Daftar skill dan pesan saat daftar kosong |
| `SkillCard` | `name`, `description`, `category`, `platform`, `author`, `favs`, `onDelete` | Kartu untuk satu skill |

### Interaktivitas

| Requirement | Penerapan |
|---|---|
| State array dan render list | `App.jsx` menyimpan daftar skill dengan `useState(dataAwal)`. `SkillList` menampilkannya dengan `skills.map()` dan `key={skill.id}`. |
| Form input (controlled component) | Setiap input di `SkillForm` memakai `value={form...}` dan `onChange={handleChange}`. Tombol **Tambah** memanggil `onAdd`, lalu `App` menambah item baru dengan `setSkills([...skills, skillBaru])`. Nama skill dan author wajib diisi. |
| Conditional rendering | Jika `skills.length === 0`, `SkillList` menampilkan teks **"Belum ada data Skill"**. Tombol **Hapus** di tiap kartu bisa dipakai untuk mengosongkan daftar. |

### Screenshot

| Tahap | Screenshot |
|---|---|
| Tampilan awal setelah instalasi | ![](docs/screenshots/01-tampilan-awal-vite.png) |
| `npm run dev` di `localhost:5173` | ![](docs/screenshots/02-npm-run-dev.png) |
| Tampilan akhir (desktop) | ![](docs/screenshots/03-tampilan-akhir-desktop.png) |
| Tampilan akhir (mobile) | ![](docs/screenshots/04-tampilan-akhir-mobile.png) |
| Validasi form kosong | ![](docs/screenshots/05-validasi-form.png) |
| Mengisi form | ![](docs/screenshots/06-isi-form.png) |
| Setelah klik Tambah | ![](docs/screenshots/07-setelah-tambah.png) |
| Daftar kosong | ![](docs/screenshots/08-daftar-kosong.png) |
