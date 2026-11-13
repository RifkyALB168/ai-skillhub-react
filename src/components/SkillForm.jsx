import { useState } from 'react'

const formKosong = { name: '', description: '', category: 'Design', platform: 'Claude', author: '' }

function SkillForm({ categories, platforms, onSave, skill, busy, onCancel }) {
  const [form, setForm] = useState(skill ? {
    name: skill.name,
    description: skill.description,
    category: skill.category,
    platform: skill.platform,
    author: skill.author,
  } : formKosong)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await onSave(form)
      setForm(formKosong)
    } catch (err) {
      setError(err.message)
    }
  }

  const inputClass = 'mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-base text-neutral-100 focus:outline-2 focus:outline-neutral-100'

  return (
    <form onSubmit={handleSubmit} className="min-w-0 rounded border border-neutral-800 p-4">
      <h2 className="text-base font-semibold text-neutral-100">{skill ? 'Ubah Skill' : 'Tambah Skill'}</h2>
      <fieldset disabled={busy} className="disabled:opacity-60">
        <label htmlFor="name" className="mt-4 block text-neutral-400">Nama Skill</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required minLength={3} maxLength={100} placeholder="Contoh: Code Review Helper" className={inputClass} />

        <label htmlFor="description" className="mt-3 block text-neutral-400">Deskripsi</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} required minLength={10} maxLength={500} rows="3" className={inputClass} />

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-neutral-400">Kategori</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="platform" className="block text-neutral-400">Platform</label>
            <select id="platform" name="platform" value={form.platform} onChange={handleChange} className={inputClass}>
              {platforms.map((platform) => <option key={platform}>{platform}</option>)}
            </select>
          </div>
        </div>

        <label htmlFor="author" className="mt-3 block text-neutral-400">Author</label>
        <input id="author" name="author" value={form.author} onChange={handleChange} required minLength={2} maxLength={50} placeholder="@username" className={inputClass} />
        {error && <p role="alert" className="mt-3 text-red-400">{error}</p>}
        <button type="submit" className="mt-4 min-h-11 w-full rounded bg-neutral-100 px-4 py-2 font-medium text-black hover:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100">
          {busy ? 'Menyimpan...' : skill ? 'Simpan Perubahan' : 'Tambah'}
        </button>
        {skill && <button type="button" onClick={onCancel} className="mt-2 min-h-11 w-full rounded border border-neutral-700 px-4 py-2 hover:bg-neutral-900">Batal Ubah</button>}
      </fieldset>
    </form>
  )
}

export default SkillForm
