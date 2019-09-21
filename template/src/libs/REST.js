
export default class REST {
  
  constructor(server_address){
    
    /**
     * Адрес серва
     * @type {string}
     */
    this.SERVER = server_address === undefined ? "http://localhost/" : server_address;
    this.SERVER = this.SERVER.substr(this.SERVER.length-2, 1) === '/' ? this.SERVER.substr(0,this.SERVER.length-1) : this.SERVER;
    
    /**
     * Стандартное число запросов на страницу
     * @type {number}
     */
    this.perPageDefault = 20;
    
  }
  
  /**
   *
   * @param {string} url Адрес
   * @param {object|string} params Параметры, которые надо передать, могут быть в виде объекта или строки
   * @param {string} type Тип
   */
  request(url, params, type = 'GET') {
    
    // Нормализуем параметры, если они есть
    if (typeof params === "object") {
      params = JSON.stringify(params);
    }
    
    // Фетч поддерживается - получаем через него, это лучшая производительность
    if(typeof fetch === "function") {
      
      return new Promise(async (resolve,reject)=>{
        
        // Тело ответа формируется в два этапа: сперва заголовки, затем ответ
        let ResolveBody = {};
        
        // Делаем запрос
        fetch(url,
        {
          method: type,
          mode: 'cors',
          body: params,
          headers: {
            'Content-type': 'application/json; charset=utf-8'
          },
        }
        ).then(response=>{
          
          // Ответ получен
          
          // Ответ с ошибкой
          if (response.status !== 200) {
            console.log('Ошибка загрузки [' + response.status + '] ' + url + ": " + response.statusText);
            reject({
              status: response.status,
              message: response.statusText
            });
            return;
          }
          
          // Загрузка успешна
          
          // Если в заголовках указана паджинация
          let pages = undefined;
          if (response.headers.get('X-Pagination-Current-Page') !== null) {
            pages = {
              page: parseInt(response.headers.get('X-Pagination-Current-Page')),
              perPage: parseInt(response.headers.get('X-Pagination-Per-Page')),
              count: parseInt(response.headers.get('X-Pagination-Page-Count')),
              total: parseInt(response.headers.get('X-Pagination-Total-Count')),
            }
          }
          
          // Заполняем тело ответа заголовками
          ResolveBody = {
            status: response.status,
            type: "json",
            data: {},
            pages: pages
          };
          
          
          // Декодируем тело ответа
          return response.json();
          
          
        }).then(response=>{
          
          // Декодируем тело ответа и возвращаем успешную загрузку
          ResolveBody.data = response;
          resolve(ResolveBody);
          
        }).catch(err=>{
          
          // Ошибка загрузки, не связанная с ХТТП, например обрыв соединения
          // TODO: на этом этапе стоит сделать, чтобы он пробовал повторить запрос, если это GET
          
          console.log('Ошибка загрузки [' + 0 + '] ' + url + ": Нет соединения с сервером");
          reject({
            status: 0,
            message: "Нет соединения с сервером"
          });
          
        })
        
      });
      
    }
    
    
    // Фетч не поддерживается - возвращаем промисифицированный XHR
    else {
      
      return new Promise((resolve, reject) => {
        
        // Генерим новый запрос
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        
        // Автоматический парсинг json ответа
        xhr.responseType = 'json';
        
        // Запрос тоже в json
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        // Запрос между доменами свободный, если это dev-среда
        xhr.withCredentials = false;
        
        // Отправляем запрос
        xhr.send(params === undefined ? null : params);
        
        xhr.onload = function () {
          
          // Ошибка загрузки
          if (xhr.status !== 200) {
            console.log('Ошибка загрузки [' + xhr.status + '] ' + url + ": " + xhr.statusText);
            return reject({
              status: xhr.status,
              message: xhr.statusText
            });
          }
          
          // Загрузка успешна
          
          // Если в заголовках указана паджинация
          let pages = undefined;
          if (xhr.getResponseHeader('X-Pagination-Current-Page') !== null) {
            pages = {
              page: parseInt(xhr.getResponseHeader('X-Pagination-Current-Page')),
              perPage: parseInt(xhr.getResponseHeader('X-Pagination-Per-Page')),
              count: parseInt(xhr.getResponseHeader('X-Pagination-Page-Count')),
              total: parseInt(xhr.getResponseHeader('X-Pagination-Total-Count')),
            }
          }
          
          
          return resolve({
            status: xhr.status,
            type: xhr.responseType,
            data: xhr.response,
            pages: pages
          });
        };
        
        // Ошибка загрузки, не связанная с ХТТП, например обрыв соединения
        // TODO: на этом этапе стоит сделать, чтобы он пробовал повторить запрос, если это GET
        xhr.onerror = function () {
          console.log('Ошибка загрузки [' + 0 + '] ' + url + ": Нет соединения с сервером");
          return reject({
            status: 0,
            message: "Нет соединения с сервером"
          });
        };
        
      });
      
    }
    
  }
  
  /**
   * Получить выборку из таблицы через REST
   * @param table
   * @param fields
   * @param where
   * WHERE - Может содержать запросы к JSON полям как простой вложенный поиск, например: [123,111] -
   * через ИЛИ найдёт 123 или 111.
   * Вариант: {"Item":"Value"} найдёт все значения где Item=Value, включая подполя.
   * Можно оформлять в виде вложенного массива запросы любой сложности:
   * ["OR",{"type": 1},["AND",{"id":5},{"class":"new"},{"hello":"go"}]]
   * @param sortfields
   * @param page
   * @param perPage
   * @return Promise<>
   */
  get(table, where, fields, sortfields, page, perPage) {
    
    // Генерим запрос
    let query = this.SERVER + '/api/' + table;
    
    let json = {};
    
    // Генерим условия
    if(where!==undefined)
      json.where = where;
    
    if(fields !== undefined)
      json.fields = fields;
    
    if(sortfields !== undefined)
      json.sort = sortfields;
    
    // Страницы
    json['per-page'] = perPage === undefined ? this.perPageDefault : perPage;
    json['page'] = page === undefined ? 1 : page;
    
    
    return this.request(query, JSON.stringify(json), 'POST');
    
  }
  
  /**
   * Создать новую запись
   * @param table
   * @param values
   */
  create(table, values) {
    
    return this.request(this.SERVER + '/api/' + table + '/create', JSON.stringify(values), 'POST');
    
  }
  
  /**
   * Удалить запись
   * @param table
   * @param id
   */
  remove(table, id) {
    
    return this.request(this.SERVER + '/api/' + table + '/delete?id=' + id , '{}', 'DELETE');
    
  }
  
  
  
}