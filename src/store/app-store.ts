import { create } from 'zustand'
import { auth } from '../helper-plugin'

interface ISchemas {
  layouts: ILayouts
  settings: Record<string, any>
  uid: string
}

interface IAppState {
  isAuthorized: boolean
  isSuperAdmin?: boolean
  layouts?: Map<string, ILayouts>
  login: () => void
  logout: () => void
  setIsSuperAdmin: (value?: boolean) => void
  setSchemas?: (schemas: Array<ISchemas>) => void
}

export const useAppStore = create<IAppState>((set) => ({
  isAuthorized: auth.getToken() !== null && auth.getToken() !== undefined,
  login: () => set(() => ({ isAuthorized: true })),
  logout: () => set(() => ({ isAuthorized: false })),
  setIsSuperAdmin: (isSuperAdmin) => set((state) => ({ ...state, isSuperAdmin })),
  setSchemas(schemas) {
    const layouts = new Map()
    schemas.forEach((s) => {
      layouts.set(s.uid, s.layouts)
    })
    set((state) => ({ ...state, layouts }))
  }
}))
