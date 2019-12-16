const { ipcRenderer } = require('electron')
// const dotenv = require('dotenv')
const fs = require('fs')
const LogManager = require('./helpers/LogManager')
const SocketManager = require('./helpers/SocketManager')
const DataManager = require('./helpers/DataManager')

// env variable'ları oluştur
// dotenv.config()
let rawenv = fs.readFileSync('./env.json')
let env = JSON.parse(rawenv)

const logger = new LogManager()

// Agent başlatıldı bilgisi
logger.Success(`Agent çalışıyor.`)

const socketManager = new SocketManager(env.SERVER, logger)
const dataManager = new DataManager(logger)
const ipcListener = require('./helpers/IpcListener')(ipcRenderer, socketManager, logger)

dataManager.Get().then(data => console.log(data))
