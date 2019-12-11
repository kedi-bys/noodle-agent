class LogManager {
  constructor() {
    // Log'ların ekleneceği DOM elementi
    this.inner = document.querySelector('.inner')

    // Yalnızca Notify fonksiyonunun kullanacağı bir DOM elementi
    this.systemBar = document.querySelector('.system-bar')
  }

  /**
   * Agent üzerinde debug arayüzündeki sistem bar kısmını günceller. Bu
   * fonksiyonun logger içinde olması çok makul değil ama uygulamanın şuanki
   * aşamasında bunun için ayrı bir sınıf yapmanın anlamı yok. İleride ayrı bir
   * modüle ayırmak gerekebilir.
   * @param {string} content sistem bar'da gözükecek olan metin
   * @param {string} className sistem bar için eklenecek yeni css class ismi
   */
  Notify (content, className) {
    this.systemBar.innerHTML = content
    this.systemBar.classList.forEach(_className => {
      _className !== 'system-bar' && this.systemBar.classList.remove(_className)
    })
    this.systemBar.classList.add(className)
  }

  Log (content, className) {
    this.inner.innerHTML = ''.concat(
      `<p class="log ${className}"><span>${content}</span></p>`,
      this.inner.innerHTML
    )
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

module.exports = LogManager
