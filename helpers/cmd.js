const os = require('os')
const { remote } = require('electron')
const sd = require('electron-shutdown-command')

const cmd = {
  systemInfo: socket => socket.emit('info', {
    platform: os.platform(),
    release: os.release()
  }),

  userInfo: socket => socket.emit('info', {
    ...os.userInfo()
  }),

  refresh: () => remote.getCurrentWindow().reload(),

  shutdown: (type) => {
    this.shutdown.type()
  }
}

module.exports = cmd
