const client = require('socket.io-client')

/**
 * Bütün socket bağlantı ve haberleşme işlemlerini organize edecek class.
 */
class SocketManager {
  constructor(url, logger) {
    this.url = url
    this.logger = logger
    this.TryConnect()
  }

  TryConnect () {
    if (!this.socket || !this.socket.connected) {
      this.socket = client.connect(this.url)
      this.socket.on('connect', this.OnConnect.bind(this))
      this.socket.on('disconnect', this.OnDisconnect.bind(this))

      this.logger.Warning(`${this.url} ile socket bağlantısı kurulmaya çalışılıyor.`)
      this.logger.Notify('Bağlanıyor...', 'pending')

      setTimeout(() => {
        if (!this.socket.connected) {
          this.logger.Fatal('Sunucu ile bağlantı kurulamadı.')
          this.logger.Notify('Bağlantı başarısız.', 'offline')
          this.socket.disconnect()
        }
      }, 5000)
    }
  }

  OnConnectionTimeout () {
    this.logger.Fatal('Sunucu ile bağlantı kurulamadı.')
    this.logger.Notify('Bağlantı başarısız.', 'offline')
  }

  OnConnect () {
    this.logger.Success('Sunucuya bağlanıldı.')
    this.logger.Notify('Bağlandı', 'online')
  }

  OnDisconnect () {
    this.logger.Fatal('Sunucu bağlantısı koptu.')
    this.logger.Notify('Bağlantı başarısız.', 'offline')
  }
}

module.exports = SocketManager
