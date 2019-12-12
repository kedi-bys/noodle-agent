module.exports = (ipcRenderer, socketManager, logger) => {
  ipcRenderer
    .on('device-suspend', () => {
      logger.Warning('Cihaz uyku moduna geçti.')
    })
    // Cihaz uyandığında socket bağlantısı muhtemelen kopmuş olacak. Bu event
    // geldiğinde SocketManager'ın tekrar bağlanmasını sağlamak lazım. Eğer
    // kendisi otomatik olarak yapmıyorsa.
    .on('device-resumed', () => {
      logger.Warning('Cihaz uyandırıldı.')
      socketManager.TryConnect()
    })
    .on('device-on-ac', () => {
      logger.Warning('Cihaz AC gücüyle çalışıyor.')
      socketManager.Emit('device-on-ac', 'Cihaz AC gücüyle çalışıyor.')
    })
    .on('device-on-battery', () => {
      logger.Warning('Cihaz batarya gücüyle çalışıyor.')
    })
    .on('device-locked', () => {
      logger.Warning('Oturum kilitli.')
      socketManager.Emit('device-locked','Oturum Kilitli.')
    })
    .on('device-unlocked', () => {
      logger.Warning('Oturum açıldı.')
      socketManager.Emit('device-unlocked', 'Oturum Açıldı.')
    })
    .on('user-active', () => {
      logger.Success('Kullanıcı aktif durumda.')
      socketManager.Emit('user-active', 'Kullanıcı aktif durumda.')
    })
    .on('user-idle', () => {
      logger.Warning('Kullanıcı bekleme durumunda.') 
      socketManager.Emit('user-idle', 'Kullanıcı bekleme durumda.')     
    })
}
