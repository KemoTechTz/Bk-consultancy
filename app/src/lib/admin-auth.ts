const ADMIN_TOKEN_KEYS = ['adminToken', 'admin_token', 'token']

export const getAdminToken = (): string | null => {
  for (const key of ADMIN_TOKEN_KEYS) {
    const token = localStorage.getItem(key)
    if (token) return token
  }
  return null
}

export const getAdminAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}
