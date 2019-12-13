const client = require('socket.io-client')
const si = require('systeminformation')
/**
 * Bütün socket bağlantı ve haberleşme işlemlerini organize edecek class.
 */
class SocketManager {
  constructor(url, logger) {
    this.url = url
    this.logger = logger
    this.TryConnect()
    this.messageBuffer = []
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
          this.TryConnect()
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

    // Buffer'ı kontrol et
    if (this.messageBuffer.length) {
      this.messageBuffer.forEach(msg => this.socket.emit(msg.type, msg.content))
      this.messageBuffer = []
    }
  }

  OnDisconnect () {
    this.logger.Fatal('Sunucu bağlantısı koptu.')
    this.logger.Notify('Bağlantı başarısız.', 'offline')
  }

  /**
   * 
   * @param {string} type Sunucuda yakalanacak socket event'i
   * @param {any} content 
   */
  async Emit(type, content) {
    let user = ((await si.users())[0]).user
    let hostname = (await si.osInfo()).hostname
    content.username = user
    content.hostname = hostname.toLocaleUpperCase()
    if (this.socket && this.socket.connected) {
      this.socket.emit(type, content)
    } else {
      this.messageBuffer.push({type, content})
    }
  }
}

module.exports = SocketManager
