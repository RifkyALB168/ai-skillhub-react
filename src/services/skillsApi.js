async function request(path = '', options = {}) {
  let response;
  try {
    response = await fetch(`/api/skills${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke backend. Pastikan server NestJS berjalan.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message;
    throw new Error(message || 'Permintaan gagal. Pastikan server NestJS berjalan.');
  }
  return data;
}

export const skillsApi = {
  findAll: () => request(),
  create: (skill) => request('', { method: 'POST', body: JSON.stringify(skill) }),
  update: (id, skill) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(skill) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
