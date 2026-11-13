import { useEffect, useState } from 'react'
import Header from './components/Header'
import SkillSummary from './components/SkillSummary'
import SkillForm from './components/SkillForm'
import SkillList from './components/SkillList'
import GitHubSkills from './components/GitHubSkills'
import { skillsApi } from './services/skillsApi'

const categories = ['Design', 'Security', 'Data', 'Writing', 'Research', 'Automation']
const platforms = ['Claude', 'OpenAI', 'Gemini', 'AI Agent', 'General']

function App() {
  const [skills, setSkills] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  async function loadSkills() {
    try {
      const data = await skillsApi.findAll()
      setSkills(data)
      setStatus('success')
      setError('')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  useEffect(() => {
    void loadSkills()
  }, [])

  async function saveSkill(form) {
    setBusy(true)
    setNotice('')
    try {
      if (editing) {
        const updated = await skillsApi.update(editing.id, form)
        setSkills((items) => items.map((skill) => skill.id === updated.id ? updated : skill))
        setNotice('Skill berhasil diubah.')
      } else {
        const created = await skillsApi.create({ ...form, favs: 0 })
        setSkills((items) => [...items, created])
        setNotice('Skill berhasil ditambahkan.')
      }
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }

  async function deleteSkill(id) {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await skillsApi.remove(id)
      setSkills((items) => items.filter((skill) => skill.id !== id))
      if (editing?.id === id) setEditing(null)
      setNotice('Skill berhasil dihapus.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const totalKategori = new Set(skills.map((skill) => skill.category)).size
  const totalFavorit = skills.reduce((total, skill) => total + skill.favs, 0)

  return (
    <>
      <Header title="AI SkillHub" subtitle="Kumpulan AI Skills dari Claude, OpenAI, Gemini, dan lainnya" />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <SkillSummary totalSkill={skills.length} totalKategori={totalKategori} totalFavorit={totalFavorit} />
        {notice && <p role="status" className="text-neutral-200">{notice}</p>}
        {error && <p role="alert" className="text-red-400">{error}</p>}
        {status === 'loading' && <p role="status" className="text-neutral-400">Memuat daftar skill...</p>}
        {status === 'error' && (
          <button type="button" onClick={() => { setStatus('loading'); void loadSkills() }} className="rounded border border-neutral-700 px-4 py-2">
            Coba Lagi
          </button>
        )}
        {status === 'success' && (
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <SkillForm
              key={editing?.id ?? 'new'}
              categories={categories}
              platforms={platforms}
              onSave={saveSkill}
              skill={editing}
              busy={busy}
              onCancel={() => setEditing(null)}
            />
            <section className="min-w-0">
              <h2 className="mb-3 text-base font-semibold text-neutral-100">Daftar Skill</h2>
              <SkillList skills={skills} onDelete={deleteSkill} onEdit={setEditing} busy={busy} />
            </section>
          </div>
        )}
        <GitHubSkills />
      </main>
    </>
  )
}

export default App
