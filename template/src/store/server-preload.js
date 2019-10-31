/**
 * Предзагруженное из базы состояние, чтобы не перезагружать его на серве при каждом запросе страницы
 */
class ServerPreloadedState{
  
  /**
   * Объекты, которые надо предзагрузить и обновлять периодически
   * @return {Promise.<void>}
   * @constructor
   */
  async AllFetchedData() {
    
    // Предзагружаем любые таблицы, которые нужны для быстрого доступа и генерируем готовые списки
    // this.objects = await global.REST.get('objects');
    
    // Загружаем контентную модель с роутингами
    this.Content = await global.REST.get('content');
    
  }
  
  
  constructor() {
    
    /**
     * Время обновления состояния, мс
     * По умолчанию обновление раз в полчаса
     * @type {number}
     */
    this.UpdateRateMS = 1000 * 60 * 30;
    
    /**
     * Загружаем в первый раз данные
     */
    this.AllFetchedData();
    
  }
  
  /**
   * Запуск периодического обновления состояния
   */
  run () {
    
    let that = this;
    
    this.UpdateTimer = setInterval(async function () {
      await that.AllFetchedData();
    }, this.UpdateRateMS);
    
  }
  
}

module.exports = ServerPreloadedState;