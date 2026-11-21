import { useState } from 'react'
import { apiRequest } from '../services/apiRequest'

function AuthForm({ onLogin, sessionMessage }) {
  const [registering, setRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(sessionMessage)
  const [error, setError] = useState('')
  const inputClass = 'mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-base text-neutral-100 focus:outline-2 focus:outline-neutral-100'

  function switchMode() {
    setRegistering(!registering)
    setPassword('')
    setError('')
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const endpoint = registering ? 'register' : 'login'
      const data = await apiRequest('/api/auth/' + endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (registering) {
        setRegistering(false)
        setPassword('')
        setNotice('Akun sudah dibuat. Silakan masuk.')
      } else {
        onLogin(data.accessToken)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <form onSubmit={handleSubmit} className="rounded border border-neutral-800 p-5">
        <h2 className="text-lg font-semibold text-neutral-100">{registering ? 'Daftar akun' : 'Masuk ke AI SkillHub'}</h2>
        <fieldset disabled={busy} className="disabled:opacity-60">
          <label htmlFor="auth-email" className="mt-4 block text-neutral-300">Email</label>
          <input id="auth-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          <label htmlFor="auth-password" className="mt-3 block text-neutral-300">Kata sandi</label>
          <input id="auth-password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} required minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          {registering && <p className="mt-1 text-xs text-neutral-400">Gunakan minimal 8 karakter.</p>}
          <button className="mt-4 min-h-11 w-full rounded bg-neutral-100 px-4 py-2 font-medium text-black hover:bg-neutral-300">
            {busy ? 'Memproses...' : registering ? 'Daftar' : 'Masuk'}
          </button>
          <button type="button" onClick={switchMode} className="mt-2 min-h-11 w-full rounded border border-neutral-700 px-4 py-2 hover:bg-neutral-900">
            {registering ? 'Sudah punya akun? Masuk' : 'Buat akun'}
          </button>
        </fieldset>
        {notice && <p role="status" className="mt-3 text-neutral-300">{notice}</p>}
        {error && <p role="alert" className="mt-3 text-red-400">{error}</p>}
      </form>
    </main>
  )
}

export default AuthForm
