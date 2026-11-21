export async function apiRequest(path, options = {}) {
  let response
  try {
    response = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('Tidak dapat terhubung ke backend. Pastikan server NestJS berjalan.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message
    const err = new Error(message || 'Permintaan gagal. Pastikan server NestJS berjalan.')
    err.status = response.status
    throw err
  }
  return data
}
