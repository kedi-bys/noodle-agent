const client = require('socket.io-client')

class SocketManager {
  constructor(url, logger) {
    this.socket = client.connect(url)
    this.socket.on('connect', this.OnConnect.bind(this))
    this.socket.on('disconnect', this.OnDisconnect.bind(this))

    this.logger = logger
  }

  OnConnect () {
    this.logger.Success('Sunucuya bağlanıldı.')
    this.logger.Notify('online', 'online')
  }

  OnDisconnect () {
    this.logger.Fatal('Sunucu bağlantısı koptu.')
  }
}

module.exports = SocketManager
