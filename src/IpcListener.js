module.exports = (ipcRenderer, socketManager, logger) => {
  ipcRenderer.on('device-unlocked', () => {
    logger.Warning(`Oturum açıldı.`)
    socketManager.TryConnect()
  })

  // Cihaz uyandığında socket bağlantısı muhtemelen kopmuş olacak. Bu event
  // geldiğinde SocketManager'ın tekrar bağlanmasını sağlamak lazım. Eğer
  // kendisi otomatik olarak yapmıyorsa.
  ipcRenderer.on('device-resumed', () => {
    socketManager.TryConnect()
  })
}
