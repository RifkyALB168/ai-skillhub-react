import { useEffect, useState } from 'react'

// Repo GitHub dengan topik agent-skills, diurutkan dari bintang terbanyak
const API_URL = 'https://api.github.com/search/repositories?q=topic:agent-skills&sort=stars&per_page=6'

// Daftar skill populer yang diambil dari GitHub Search API
function GitHubSkills() {
  // status: 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('loading')
  const [repos, setRepos] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // Ambil data dari API, dipakai saat halaman dibuka dan saat klik Coba Lagi
  async function fetchSkills() {
    try {
      const response = await fetch(API_URL)
      // fetch tidak otomatis gagal untuk status 4xx/5xx, jadi dicek manual
      if (!response.ok) {
        throw new Error(`Server GitHub membalas dengan status ${response.status}.`)
      }
      const data = await response.json()
      setRepos(data.items)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error.message)
      setStatus('error')
    }
  }

  // Ambil data sekali saat komponen pertama kali tampil (status awal sudah 'loading')
  useEffect(() => {
    fetchSkills()
  }, [])

  // Tombol Coba Lagi: tampilkan loading lagi, lalu ulangi pengambilan data
  function handleRetry() {
    setStatus('loading')
    fetchSkills()
  }

  return (
    <section>
      <h2 className="text-base font-semibold text-neutral-100">Skill Populer dari GitHub</h2>
      <p className="mt-1 mb-3 text-neutral-400">Repository dengan topik agent-skills, diurutkan dari bintang terbanyak.</p>

      {status === 'loading' && (
        <p role="status" className="animate-pulse rounded border border-dashed border-neutral-800 px-4 py-10 text-center text-neutral-400">
          Memuat skill dari GitHub...
        </p>
      )}

      {status === 'error' && (
        <div role="alert" className="rounded border border-red-900 px-4 py-8 text-center">
          <p className="font-medium text-red-400">Gagal memuat data dari GitHub.</p>
          <p className="mt-1 text-neutral-400">{errorMessage}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded border border-neutral-700 px-4 py-2 font-medium hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-100"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <article key={repo.id} className="flex flex-col rounded border border-neutral-800 p-4">
              <h3 className="font-medium break-words text-neutral-100">{repo.full_name}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-neutral-400">{repo.description || 'Tidak ada deskripsi.'}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                <span>
                  {repo.language || 'Lainnya'} · {repo.stargazers_count.toLocaleString('id-ID')} bintang
                </span>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded px-2 py-1 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-100"
                >
                  Buka di GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default GitHubSkills
