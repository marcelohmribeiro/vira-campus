import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { settings } from 'src/config'
import type { Usuario } from 'src/types'

const { APP_NAME } = settings

interface AuthState {
	user: Usuario | null
	token: string | null
	login: (userData: Usuario, token: string) => void
	logout: () => void
	isAuthenticated: () => boolean
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,

            login: (userData, token) => {
                set({ 
                    user: userData,
                    token,
                })
            },

            logout: () => {
                localStorage.removeItem(APP_NAME)
                set({ user: null, token: null })
            },

            isAuthenticated: () => !!get().token,
        }),
        {
            name: APP_NAME,
            partialize: (state) => ({ 
                token: state.token, user: state.user
            }),
}))

export default useAuthStore
export { useAuthStore }
