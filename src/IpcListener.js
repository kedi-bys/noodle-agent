const SocketManager = require('./SocketManager')
const LogManager = require('./LogManager')

/**
 *
 * @param {ipcRenderer} ipcRenderer
 * @param {SocketManager} socketManager
 * @param {LogManager} logger
 */
const IpcListener = (ipcRenderer, socketManager, logger) => {
  ipcRenderer
    .on('device-suspend', () => {
      logger.Warning('Cihaz uyku moduna geçti.')
      socketManager.Emit('device-sleep', { device_sleep: true })
    })
    // Cihaz uyandığında socket bağlantısı muhtemelen kopmuş olacak. Bu event
    // geldiğinde SocketManager'ın tekrar bağlanmasını sağlamak lazım. Eğer
    // kendisi otomatik olarak yapmıyorsa.
    .on('device-resumed', () => {
      logger.Warning('Cihaz uyandırıldı.')
      socketManager.TryConnect()
      socketManager.Emit('device-sleep', { device_sleep: false })
    })
    .on('device-on-ac', () => {
      logger.Warning('Cihaz AC gücüyle çalışıyor.')
      socketManager.Emit('device-on-battery', { device_on_battery: false })
    })
    .on('device-on-battery', () => {
      logger.Warning('Cihaz batarya gücüyle çalışıyor.')
      socketManager.Emit('device-on-battery', { device_on_battery: true })
    })
    .on('device-locked', () => {
      logger.Warning('Oturum kilitli.')
      socketManager.Emit('device-locked', { device_locked: true })
    })
    .on('device-unlocked', () => {
      logger.Warning('Oturum açıldı.')
      socketManager.Emit('device-locked', { device_locked: false })
    })
    .on('user-active', () => {
      logger.Success('Kullanıcı aktif durumda.')
      socketManager.Emit('user-idle', { user_idle: false })
    })
    .on('user-idle', () => {
      logger.Warning('Kullanıcı bekleme durumunda.')
      socketManager.Emit('user-idle', { user_idle: true })
    })
}

module.exports = IpcListener
