# AI SkillHub Backend

NestJS REST API untuk mengelola data Skill dengan Prisma dan PostgreSQL.

## Menjalankan PostgreSQL dan backend

Jalankan PostgreSQL lokal dan buat database `ai_skillhub`. Dari sesi `psql` sebagai admin PostgreSQL, contoh perintah untuk mesin pengembangan baru:

```sql
CREATE ROLE skillhub LOGIN CREATEDB PASSWORD 'ganti_dengan_password_lokal';
CREATE DATABASE ai_skillhub OWNER skillhub;
```

Hak `CREATEDB` diperlukan agar `prisma migrate dev` bisa membuat database sementara untuk memeriksa migrasi. Salin `.env.example` ke `.env` dalam folder `backend` lalu sesuaikan `DATABASE_URL` dengan PostgreSQL lokal. Jika kata sandi berisi karakter khusus URL, gunakan bentuk percent-encoded.

Dari folder `backend`:

```bash
npm ci
npx prisma migrate dev
npm run start:dev
```

Migrasi membuat tabel dan memasukkan empat skill awal. Perubahan lewat REST API tetap tersimpan setelah NestJS dimulai ulang.

- [API Skill](http://127.0.0.1:3000/api/skills)
- [Swagger UI](http://127.0.0.1:3000/docs)

Pada komputer yang memakai instalasi portabel proyek ini, jalankan perintah berikut di PowerShell jika PostgreSQL sudah berhenti:

```powershell
$pg = Join-Path $env:LOCALAPPDATA 'AI-SkillHub\postgres'
& "$pg\pgsql\bin\postgres.exe" -D "$pg\data"
```

## Tes integrasi

Buat database `ai_skillhub_test` dengan role yang sama, lalu isi `TEST_DATABASE_URL` di `.env`. Terapkan migrasi ke database tes dengan menetapkan `DATABASE_URL` sementara di PowerShell dari folder `backend`:

```powershell
$env:DATABASE_URL = node.exe -r dotenv/config -p "process.env.TEST_DATABASE_URL"
npx.cmd prisma migrate deploy
Remove-Item Env:DATABASE_URL
npm.cmd test -- --runInBand
```

Bukti migrasi dan pengujian ada di [README proyek](../README.md#minggu-10-rest-api--postgresql--prisma).
