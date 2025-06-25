import { create } from 'zustand'
import type { User as FirebaseUser } from 'firebase/auth'
import type { User } from '../types'

interface AuthState {
  firebaseUser: FirebaseUser | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setFirebaseUser: (firebaseUser) => 
    set((state) => {
      const newIsAuthenticated = !!firebaseUser && !!state.user
      return { 
        ...state, 
        firebaseUser,
        isAuthenticated: newIsAuthenticated
      }
    }),

  setUser: (user) => 
    set((state) => {
      const newIsAuthenticated = !!state.firebaseUser && !!user
      return { 
        ...state, 
        user,
        isAuthenticated: newIsAuthenticated
      }
    }),

  setLoading: (isLoading) => 
    set((state) => ({ 
      ...state, 
      isLoading 
    })),

  logout: () => 
    set(() => ({
      firebaseUser: null,
      user: null,
      isLoading: false,
      isAuthenticated: false
    }))
}))