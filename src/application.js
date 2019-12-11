const dotenv = require('dotenv')

const client = require('socket.io-client')
const { ipcRenderer } = require('electron')

const si = require('systeminformation')

dotenv.config()

const Logger = require('./src/logger')
const SocketManager = require('./src/socket')

const logger = new Logger()
const socketManager = new SocketManager(process.env.SERVER, logger)

logger.Success(`Agent çalışıyor.`)

// const socket = client.connect(process.env.SERVER)
// socket.on('disconnect', () => {
//   log('Socket disconnected', 4)
//   systemBar.classList.remove('online')
//   systemBar.classList.add('offline')
//   systemBar.innerHTML = 'offline'
// })

// socket.on('connect', () => {
//   log('Socket connected', 2)
//   systemBar.classList.remove('offline')
//   systemBar.classList.add('online')
//   systemBar.innerHTML = 'online'
// })

// socket.on('transmission', () => log(`Veriler sunucu tarafından alındı.`, 2))

// // si.getStaticData().then(data =>
// //   socket.emit('info', { ...data })
// // )

// si.getStaticData().then(data =>
//   socket.emit('info', { ...data })
// )

// si.getDynamicData().then(data =>
//   socket.emit('info', { ...data })
// )

// socket.on('demand', type => {
//   log(`${type} istendi.`, 1)
//   cmd[type](socket)
// })

// function log (content, level = 0) {
//   inner.innerHTML = `<p class="log ${logLevels[level]}"><span>${content}</span></p>` + inner.innerHTML
// }

// ipcRenderer.on('device-unlocked', () => {
//   log(`Oturum açıldı.`, 2)
// })

// log(`Node version: ${process.versions.node}`, 1)
// log(`Chrome version: ${process.versions.chrome}`, 1)
// log(`Electron version: ${process.versions.electron}`, 1)
// log(`Platform: ${os.platform()}`, 1)
// log(`Release ${os.release()}`, 1)
// log(`Arch: ${os.arch()}`, 1)
// log(`Total Memory ${os.totalmem()}`, 1)
// log(`Uptime: ${os.uptime()} secs`, 1)
// log(`User: ${os.userInfo().username}`, 1)
// log(`IP: ${os.networkInterfaces().Ethernet.map(e => e.address).join(', ')}`, 1)
// log(`MAC: ${os.networkInterfaces().Ethernet.map(e => e.mac).join(', ')}`, 1)
// log(`Hostname: ${os.hostname()}`, 1)
// log(`CPUs: [${os.cpus().map(c => c.model)}]`, 1)
