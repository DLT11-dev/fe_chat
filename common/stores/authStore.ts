import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, RegisterRequest, User } from '../modules/auth/auth.interface'
import { LoginRequest } from '@/common/modules/auth/auth.interface'
import { AuthService } from '@/common/modules/auth/auth.services'

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  logout: (refreshToken: string) => void
  register: (credentials: any) => Promise<void>
  setUser: (user: User) => void
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: string) => void
  clearError: () => void
  checkAuth: () => Promise<void>
  // Thêm flag để theo dõi token vừa được tạo
  isTokenFresh: boolean
  setTokenFresh: (isFresh: boolean) => void
}

// Helper function to map backend user to frontend user format
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    name: backendUser.username,
  }
}

const authService = new AuthService()

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isTokenFresh: false, // Flag mới

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })
        
        try {
          const loginRequest: LoginRequest = {
            username: credentials.username, 
            password: credentials.password
          }
          
          const response = await authService.login(loginRequest)
          
          // Map backend response to frontend format
          const user = mapBackendUserToFrontend(response.user)
          
    
          set({
            user,
            token: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isTokenFresh: true // Đánh dấu token vừa được tạo
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại'
          })
        }
      },

      logout: async(refreshToken: string) => {
        try {
          await authService.logout(refreshToken)
        } catch (error) {
          console.error('Logout API error:', error)
        }
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isTokenFresh: false
        })
      },

      register: async (credentials: RegisterRequest) => {
        set({ isLoading: true, error: null })
        
        try {
          const registerRequest: RegisterRequest = {
            username: credentials.username, 
            email: credentials.email,
            password: credentials.password
          }

          await authService.register(registerRequest)
          
          // Mock successful registration
          set({
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Đăng ký thất bại'
          })
        }
      },

      setUser: (user: User) => {
        set({ user })
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true })
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken })
      },

      clearError: () => {
        set({ error: null })
      },

      setTokenFresh: (isFresh: boolean) => {
        set({ isTokenFresh: isFresh })
      },

      checkAuth: async () => {
        const { refreshToken, isTokenFresh } = get()
        
        if (!refreshToken) {
          set({ isAuthenticated: false, user: null })
          return
        }

        // Nếu token vừa được tạo từ đăng nhập, không cần refresh
        if (isTokenFresh) {
  
          set({ isTokenFresh: false }) // Reset flag sau lần đầu
          return
        }


        set({ isLoading: true })
        
        try {
          // Try to refresh the token to check if it's still valid
          const response = await authService.refreshToken(refreshToken)
          
          // Map backend response to frontend format
          const user = mapBackendUserToFrontend(response.user)
          
          set({
            user,
            token: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Phiên đăng nhập đã hết hạn'
          })
        }
      }
    }),
    {
      name: 'auth-storage', // tên key trong localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isTokenFresh: state.isTokenFresh
      })
    }
  )
) 