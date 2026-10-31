import { useState } from 'react'
import Header from './components/Header'
import SkillSummary from './components/SkillSummary'
import SkillForm from './components/SkillForm'
import SkillList from './components/SkillList'
import GitHubSkills from './components/GitHubSkills'

const categories = ['Design', 'Security', 'Data', 'Writing', 'Research', 'Automation']
const platforms = ['Claude', 'OpenAI', 'Gemini', 'AI Agent', 'General']

// Data awal skill
const dataAwal = [
  {
    id: 1,
    name: 'UI/UX Designer Assistant',
    description: 'Memberi masukan layout, warna, dan aksesibilitas dari screenshot desain.',
    category: 'Design',
    platform: 'Claude',
    author: '@design_guru',
    favs: 124,
  },
  {
    id: 2,
    name: 'Python Security Auditor',
    description: 'Memeriksa kode Python untuk celah keamanan seperti SQL injection dan secret yang bocor.',
    category: 'Security',
    platform: 'General',
    author: '@sec_expert',
    favs: 98,
  },
  {
    id: 3,
    name: 'SQL Query Optimizer',
    description: 'Menganalisis query lambat dan menyarankan index atau penulisan ulang query.',
    category: 'Data',
    platform: 'OpenAI',
    author: '@db_admin',
    favs: 76,
  },
  {
    id: 4,
    name: 'Research Summarizer',
    description: 'Merangkum paper ilmiah menjadi poin utama, metode, dan keterbatasan.',
    category: 'Research',
    platform: 'Claude',
    author: '@paper_bot',
    favs: 54,
  },
]

function App() {
  // State daftar skill (array)
  const [skills, setSkills] = useState(dataAwal)

  function addSkill(form) {
    const skillBaru = { ...form, id: Date.now(), favs: 0 }
    setSkills([...skills, skillBaru])
  }

  function deleteSkill(id) {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  // Data untuk komponen ringkasan
  const totalKategori = new Set(skills.map((skill) => skill.category)).size
  const totalFavorit = skills.reduce((total, skill) => total + skill.favs, 0)

  return (
    <>
      <Header title="AI SkillHub" subtitle="Kumpulan AI Skills dari Claude, OpenAI, Gemini, dan lainnya" />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <SkillSummary totalSkill={skills.length} totalKategori={totalKategori} totalFavorit={totalFavorit} />

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <SkillForm categories={categories} platforms={platforms} onAdd={addSkill} />

          <section>
            <h2 className="mb-3 text-base font-semibold text-neutral-100">Daftar Skill</h2>
            <SkillList skills={skills} onDelete={deleteSkill} />
          </section>
        </div>

        <GitHubSkills />
      </main>
    </>
  )
}

export default App
