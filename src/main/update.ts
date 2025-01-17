import { app, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import type { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater'
import { autoUpdater } from 'electron-updater'
import logger from './logger'
// const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

export function update(win: Electron.BrowserWindow): void {
  logger.info('Now Running update()')
  logger.info(`AutoUpdate Feed Url: ${autoUpdater.getFeedURL()}`)
  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  autoUpdater.checkForUpdatesAndNotify()

  // start check
  autoUpdater.on('checking-for-update', function () {
    logger.info('Checking for update')
  })
  // update available
  autoUpdater.on('update-available', (arg: UpdateInfo) => {
    logger.info('Update available')
    win.webContents.send('update-can-available', {
      update: true,
      version: app.getVersion(),
      newVersion: arg?.version
    })
  })
  // update not available
  autoUpdater.on('update-not-available', (arg: UpdateInfo) => {
    logger.info('Update not available')
    win.webContents.send('update-can-available', {
      update: false,
      version: app.getVersion(),
      newVersion: arg?.version
    })
  })

  // Checking for updates
  ipcMain.handle('check-update', async () => {
    if (!app.isPackaged) {
      const error = new Error('The update feature is only available after the package.')
      return { message: error.message, error }
    }

    try {
      return await autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      return { message: 'Network error', error }
    }
  })

  // Start downloading and feedback on progress
  ipcMain.handle('start-download', (event: Electron.IpcMainInvokeEvent) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          // feedback download error message
          event.sender.send('update-error', { message: error.message, error })
          logger.error(error.message)
        } else {
          // feedback update progress message
          event.sender.send('download-progress', progressInfo)
          logger.info(`Downloaded ${progressInfo?.percent}`)
        }
      },
      () => {
        // feedback update downloaded message
        event.sender.send('update-downloaded')
        logger.info('Update downloaded')
      }
    )
  })

  // Install now
  ipcMain.handle('quit-and-install', () => {
    autoUpdater.quitAndInstall(false, true)
  })
}

function startDownload(
  // eslint-disable-next-line no-unused-vars
  callback: (error: Error | null, info: ProgressInfo | null) => void,
  // eslint-disable-next-line no-unused-vars
  complete: (event: UpdateDownloadedEvent) => void
): void {
  logger.info('Starting download')
  autoUpdater.on('download-progress', (info: ProgressInfo) => callback(null, info))
  autoUpdater.on('error', (error: Error) => callback(error, null))
  autoUpdater.on('update-downloaded', complete)
  autoUpdater.downloadUpdate()
}
