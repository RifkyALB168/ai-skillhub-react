-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "favs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_normalizedName_key" ON "Skill"("normalizedName");

-- Empat skill dari BAB 9 menjadi data awal database.
INSERT INTO "Skill" ("name", "normalizedName", "description", "category", "platform", "author", "favs")
VALUES
  ('UI/UX Designer Assistant', 'ui/ux designer assistant', 'Memberi masukan layout, warna, dan aksesibilitas dari screenshot desain.', 'Design', 'Claude', '@design_guru', 124),
  ('Python Security Auditor', 'python security auditor', 'Memeriksa kode Python untuk celah keamanan seperti SQL injection dan secret yang bocor.', 'Security', 'General', '@sec_expert', 98),
  ('SQL Query Optimizer', 'sql query optimizer', 'Menganalisis query lambat dan menyarankan index atau penulisan ulang query.', 'Data', 'OpenAI', '@db_admin', 76),
  ('Research Summarizer', 'research summarizer', 'Merangkum paper ilmiah menjadi poin utama, metode, dan keterbatasan.', 'Research', 'Claude', '@paper_bot', 54);
