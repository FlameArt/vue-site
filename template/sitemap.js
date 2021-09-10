const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap')

/**
 * Генератор сайтмепа
 */
class SitemapGenerator {

  constructor() {
    this.config = JSON.parse(fs.readFileSync('./src/config.json'));
    this.config = SERVER_IS_PROD ? this.config.prod : this.config.dev;
  }

  async start() {

    // Генерим роботс из конфига
    //this.RobotsTXTGenerator();

    // Генерим сайтмеп
    //await this.SitemapGenerator();

  }

  async SitemapGenerator() {

    // создаём сайтмеп
    const sm = new SitemapStream({ hostname: this.config.domain });

    // Главная страница
    sm.write({url: '/', changefreq: 'daily', priority: 0.9});

    // Получаем выборку страниц впнов
    let vpns = await REST.get('sites', {'parserLevel': 3, isShow: 1}, null, null, null, 0, 100);

    // Записываем страницы впнов
    for (let vpn of vpns.data) {
      sm.write({url: '/vpn/'+vpn.short_link+'/'+vpn.id, changefreq: 'weekly', priority: 0.5})
    }

    // Записываем готовый сайтмеп в файл
    sm.end();
    let sitemap = await streamToPromise(sm);
    fs.writeFileSync('public/sitemap.xml', sitemap);

  }

  /**
   * Генерируем файл роботс, т.к. по умолчанию он с example.com, указываем домен из конфига
   * @constructor
   */
  RobotsTXTGenerator() {
    let rtxt = fs.readFileSync('./public/robots.txt').toString();
    rtxt = rtxt.replace("http://www.example.com/", this.config.domain);
    fs.writeFileSync('./public/robots.txt', rtxt);
  }

}

module.exports = SitemapGenerator;
