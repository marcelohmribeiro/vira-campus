import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { settings } from 'src/config'

const { APP_NAME } = settings

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: () => {
                set({ isAuthenticated: true })
            },

            logout: () => {
                localStorage.removeItem(APP_NAME)
                set({ token: null, isAuthenticated: false })
            },
        }),
        {
            name: APP_NAME,
            partialize: (state) => ({ 
                token: state.token, isAuthenticated: state.isAuthenticated
            }),
}))

export default useAuthStore
export { useAuthStore }
