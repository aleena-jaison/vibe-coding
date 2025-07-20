import { app, shell, BrowserWindow, ipcMain, screen, powerMonitor } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the floating widget window for Mochi
  const mainWindow = new BrowserWindow({
    width: 160, // Adjusted for full body panda
    height: 200, // Adjusted for full body panda
    show: false,
    frame: false, // Frameless window
    transparent: true, // Transparent background
    alwaysOnTop: true, // Always on top
    skipTaskbar: true, // Don't show in taskbar
    resizable: false, // Fixed size
    autoHideMenuBar: true,
    x: 50, // Position near bottom-right (will be adjusted)
    y: 50,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Position window in bottom-right corner
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize
  mainWindow.setPosition(screenWidth - 180, screenHeight - 220)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Mochi companion IPC handlers
  let userIdleTime = 0
  let lastActivityTime = Date.now()
  
  // Track user activity (reset idle timer)
  ipcMain.on('user-activity', () => {
    lastActivityTime = Date.now()
    userIdleTime = 0
  })
  
  // Get current idle time
  ipcMain.handle('get-idle-time', () => {
    userIdleTime = Date.now() - lastActivityTime
    return Math.floor(userIdleTime / 1000) // Return in seconds
  })
  
  // Handle mood updates
  ipcMain.on('mood-update', (event, mood) => {
    console.log('User mood updated:', mood)
    // TODO: Store mood in electron-store
  })
  
  // Handle system events for emotional responses
  powerMonitor.on('resume', () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.webContents.send('system-event', 'wake-up')
    }
  })
  
  // Check for user activity every 2 seconds for more responsive idle detection
  setInterval(() => {
    const currentIdleTime = Math.floor((Date.now() - lastActivityTime) / 1000)
    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.webContents.send('idle-update', currentIdleTime)
    }
  }, 2000)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // For Mochi companion, we want to keep running even when window is closed
  // The app should only quit when explicitly requested
  if (process.platform !== 'darwin') {
    // Don't quit automatically - stay running as background companion
    // app.quit()
  }
})

// Enable auto-launch on system startup
app.setLoginItemSettings({
  openAtLogin: true,
  name: 'Panda Companion'
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
