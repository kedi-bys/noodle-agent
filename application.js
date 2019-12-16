const { ipcRenderer } = require('electron')
// const dotenv = require('dotenv')
const fs = require('fs')
const LogManager = require('./src/LogManager')
const SocketManager = require('./src/SocketManager')
const DataManager = require('./src/DataManager')

// env variable'ları oluştur
// dotenv.config()
let rawenv = fs.readFileSync('./resources/env.json')
let env = JSON.parse(rawenv)

const logger = new LogManager()

// Agent başlatıldı bilgisi
logger.Success(`Agent çalışıyor.`)

const socketManager = new SocketManager(env.SERVER, logger)
const dataManager = new DataManager(logger)
const ipcListener = require('./src/IpcListener')(ipcRenderer, socketManager, logger)

dataManager.Get().then(data => console.log(data))
