class Logger {
  constructor() {
    this.inner = document.querySelector('.inner')
    this.systemBar = document.querySelector('.system-bar')
  }
  // FIXME:
  Notify (content, className) {
    this.systemBar.innerHTML = content
    this.systemBar.classList.add(className)
  }

  Log (content, className) {
    this.inner.innerHTML =
      `<p class="log ${className}"><span>${content}</span></p>` + this.inner.innerHTML
  }

  Warning (content) {
    this.Log(content, 'warning')
  }

  Default (content) {
    this.Log(content, 'default')
  }

  Success (content) {
    this.Log(content, 'success')
  }

  Error (content) {
    this.Log(content, 'error')
  }

  Fatal (content) {
    this.Log(content, 'fatal')
  }
}

module.exports = Logger
