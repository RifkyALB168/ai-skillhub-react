import { apiRequest } from './apiRequest'

export function createSkillsApi(token, onUnauthorized) {
  async function request(path = '', options = {}) {
    try {
      return await apiRequest(`/api/skills${path}`, {
        ...options,
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      if (error.status === 401) onUnauthorized(token)
      throw error
    }
  }

  return {
    findAll: () => request(),
    create: (skill) => request('', { method: 'POST', body: JSON.stringify(skill) }),
    update: (id, skill) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(skill) }),
    remove: (id) => request(`/${id}`, { method: 'DELETE' }),
  }
}
