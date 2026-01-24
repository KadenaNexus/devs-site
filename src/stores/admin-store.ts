import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ADMIN_TOKEN = 'admin_token'
const ADMIN_USER = 'admin_user'

export interface AdminUser {
  id: string
  email: string
  username: string
}

interface AdminState {
  user: AdminUser | null
  accessToken: string
  isAuthenticated: boolean
  setUser: (user: AdminUser | null) => void
  setAccessToken: (accessToken: string) => void
  setAuthenticated: (authenticated: boolean) => void
  logout: () => void
}

export const useAdminStore = create<AdminState>((set) => {
  const cookieToken = getCookie(ADMIN_TOKEN)
  const cookieUser = getCookie(ADMIN_USER)
  
  const initToken = cookieToken ? JSON.parse(cookieToken) : ''
  const initUser = cookieUser ? JSON.parse(cookieUser) : null
  const initAuth = !!initToken

  return {
    user: initUser,
    accessToken: initToken,
    isAuthenticated: initAuth,
    
    setUser: (user: AdminUser | null) =>
      set(() => {
        if (user) {
          setCookie(ADMIN_USER, JSON.stringify(user))
        } else {
          removeCookie(ADMIN_USER)
        }
        return { user }
      }),
    
    setAccessToken: (accessToken: string) =>
      set(() => {
        setCookie(ADMIN_TOKEN, JSON.stringify(accessToken))
        return { accessToken }
      }),
    
    setAuthenticated: (authenticated: boolean) =>
      set(() => ({ isAuthenticated: authenticated })),
    
    logout: () =>
      set(() => {
        removeCookie(ADMIN_TOKEN)
        removeCookie(ADMIN_USER)
        return {
          user: null,
          accessToken: '',
          isAuthenticated: false,
        }
      }),
  }
})
