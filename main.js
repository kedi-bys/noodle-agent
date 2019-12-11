const { app, BrowserWindow, Tray, Menu, screen, powerMonitor } = require('electron')

const WIDTH = 280
const HEIGHT = 380

let win
let tray

function bootstrap () {
  win = new BrowserWindow({
    // show: false,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#2f3241',
    movable: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    x: screen.getPrimaryDisplay().workAreaSize.width - WIDTH,
    y: screen.getPrimaryDisplay().workAreaSize.height - HEIGHT,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./index.html')

  tray = new Tray('./resources/eye-16x16.png')
  tray.displayBalloon({
    icon: './resources/eye-256x256.png',
    title: 'Agent',
    content: 'v0.1'
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Kapat', type: "normal", click: onContextMenuCloseClicked },
    { label: 'Debug', type: "normal", click: onContextMenuDebugClicked }
  ])
  tray.setContextMenu(contextMenu)

  powerMonitor
    .on('suspend', () => {
      win.webContents.send('device-suspend', {})
    })
    .on('resume', () => {
      win.webContents.send('device-resumed', {})
    })
    .on('on-ac', () => {
      win.webContents.send('device-on-ac', {})
    })
    .on('on-battery', () => {
      win.webContents.send('device-on-battery', {})
    })
    .on('lock-screen', () => {
      win.webContents.send('device-locked', {})
    })
    .on('unlock-screen', () => {
      win.webContents.send('device-unlocked', {})
    })
  let last_status
  setInterval(() => {
    let device_status = powerMonitor.getSystemIdleState(10)
    switch (device_status) {
      case 'active':
        if (last_status != device_status) {
          console.log(device_status)
        }
        last_status = device_status
        break;
      case 'idle':
        if (last_status != device_status) {
          console.log(device_status)
        }
        last_status = device_status
        break;
      case 'locked':
        if (last_status != device_status) {
          console.log(device_status)
          last_status = device_status
        }
        break;
      default:
        break;
    }
  }, 1000);
}

function onContextMenuDebugClicked () {
  if (win.isVisible()) {
    win.hide()
  } else {
    win.show()
  }
}

function onContextMenuCloseClicked () {
  win.close()
}

app.on('ready', bootstrap)

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    bootstrap()
  }
})
