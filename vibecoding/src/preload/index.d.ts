import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onIdleUpdate: (callback: (idleTime: number) => void) => void
      onSystemEvent: (callback: (event: string) => void) => void
      reportActivity: () => void
      updateMood: (mood: string) => void
      getIdleTime: () => Promise<number>
    }
  }
}
