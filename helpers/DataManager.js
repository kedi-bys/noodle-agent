const si = require('systeminformation')

/**
 * Tüm bilgisayardan alınacak verileri organize edecek class.
 */
class DataManager {
  constructor(logger) {
    this.logger = logger
    this.lastSystemInformation = null
  }

  /**
   * Placeholder bir fonksiyon yalnızca veri çekebildiğimizi kontrol etmek için.
   */
  Get () {
    return new Promise((resolve, reject) => {
      // Log
      this.logger.Warning('Sistem verisi çekiliyor.')

      si.getStaticData()
        .then(data => {
          // Log
          this.logger.Warning('Sistem verisi çekildi.')
          this.Compare(data)

          resolve(data)
        })
        .catch(err => {
          this.logger.Fatal('Sistem verisi çekilirken bir hata oluştu.')
          reject(err)
        })
    })
  }

  /**
   * Sistem verisi çekildikten sonra en son çekilmiş olan veri ile arasında fark
   * olup olmadığını fark varsa bunları ayrı ayrı listeleyerek sunucuya
   * bildirilecek hale getirecek fonksiyon.
   *
   * Şimdilik sadece son veri olarak kaydediyor.
   * @param {Object} systemInformation
   */
  Compare (systemInformation) {
    this.lastSystemInformation = systemInformation
  }
}

module.exports = DataManager
