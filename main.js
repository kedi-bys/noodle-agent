const { app, BrowserWindow, Tray, Menu, screen, powerMonitor } = require('electron')
const fs = require('fs')
const path = require('path')
const appFolder = path.dirname(process.execPath)
const updateExe = path.resolve(appFolder, '..', 'Update.exe')
const exeName = path.basename(process.execPath)

let rawenv = fs.readFileSync(path.join(__dirname, 'env.json'))
let env = JSON.parse(rawenv)

if (require('electron-squirrel-startup')) app.quit()
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
const setupEvents = require(path.join(__dirname,'installers','setup-events'))
if (setupEvents.handleSquirrelEvent()) {
  process.exit()
}

const WIDTH = 280
const HEIGHT = 380

let win
let tray

function bootstrap() {
  win = new BrowserWindow({
    show: false,
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

  tray = new Tray(path.join(__dirname, 'noodle.ico'))
  // tray.displayBalloon({
  //   icon: path.join(__dirname, 'noodle.ico'),
  //   title: 'Agent',
  //   content: 'v0.1'
  // })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Kapat', type: "normal", click: onContextMenuCloseClicked },
    { label: 'Debug', type: "normal", click: onContextMenuDebugClicked }
  ])
  tray.setContextMenu(contextMenu)

  //Cihaza ait durumların(uyku, kilit, enerji) yakalandığı alan
  powerMonitor
    .on('suspend', () => {
      //Web içeriklerinin yakalayabileceği bir event gönderiliyor / IpcListener.js
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

  //Kullanıcıya ait durumların(Idle, Active) yakalandığı alan
  let last_status // Son durum bilgisi
  setInterval(() => { // Saniyede bir kontrol edilecek
    //Koşulumuza uyan süre içerisindeki aktiflik durum bilgisi değişkene atanıyor
    let device_status = powerMonitor.getSystemIdleState(Number(env.IDLE_TIME))
    //koşul değerlendirmesi (active, idle, locked, unknown)
    switch (device_status) {
      case 'active':
        //Her saniye aynı veriyi göndermemek için kontrol
        if (last_status != device_status) {
          win.webContents.send(`user-active`, {})
        }
        // Son durum cihaz bilgisine eşitleniyor
        last_status = device_status
        break
      case 'idle':
        //Her saniye aynı veriyi göndermemek için kontrol
        if (last_status != device_status) {
          win.webContents.send(`user-idle`, {})
        }
        // Son durum cihaz bilgisine eşitleniyor
        last_status = device_status
        break
      default:
        // Son durum cihaz bilgisine eşitleniyor
        last_status = device_status
        break
    }
  }, 1000)
}

function onContextMenuDebugClicked() {
  if (win.isVisible()) {
    win.hide()
  } else {
    win.show()
  }
}

function onContextMenuCloseClicked() {
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

// app.setLoginItemSettings({
//   openAtLogin: true,
//   path: updateExe,
//   args: [
//     '--processStart', `"${exeName}"`,
//     '--process-start-args', `"--hidden"`
//   ]
// })
app.requestSingleInstanceLock()
app.on('second-instance', (event, argv, cwd) => {
  app.quit()
})