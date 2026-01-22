import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { Session } from 'inspector'

const ACCESS_TOKEN = 'thisisjustarandomstring'

export interface AuthUser {
  userId: string | null
  email: string | null
  role: string | null
}

interface AuthState {
  user: any
  auth: {
    user: AuthUser | null
    accessToken: string
    setUser: (user: AuthUser | null) => void
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    session: Session | null
    isAuthenticated: boolean
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''

  return {
    auth: {
      user: null,
      accessToken: initToken,
      setUser: (user: AuthUser | null) =>
        set((state) => ({
          auth: {
            ...state.auth,
            user,
          },
        })),
      setAccessToken: (accessToken: string) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return {
            auth: {
              ...state.auth,
              accessToken,
            },
          }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            auth: {
              ...state.auth,
              accessToken: '',
            },
          }
        }),
      reset: () =>
        set(() => {
          removeCookie(ACCESS_TOKEN)
          return {
            auth: {
              user: null,
              accessToken: '',
              setUser: () => {},
              setAccessToken: () => {},
              resetAccessToken: () => {},
              reset: () => {},
            },
          }
        }),
    },
  }
})
