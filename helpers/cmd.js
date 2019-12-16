const os = require('os')
const { remote } = require('electron')

const cmd = {
  systemInfo: socket => socket.emit('info', {
    platform: os.platform(),
    release: os.release()
  }),

  userInfo: socket => socket.emit('info', {
    ...os.userInfo()
  }),

  refresh: () => remote.getCurrentWindow().reload()
}

module.exports = cmd
