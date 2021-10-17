const puppeteer = require('puppeteer')
const { resolve } = require('path')
const { readFileSync } = require('fs')
const { sleep } = require('./utils')

class Skeleton{
  constructor(options){
    this.options = options
  }

  async initialize(){
    this.browser = await puppeteer.launch({ headless: false }) // 不打开无头浏览器，设为false的话会打开一个浏览器窗口
  }

  // 打开一个页签
  async newPage(){
    const { device } = this.options
    const page = await this.browser.newPage();
    await page.emulate(puppeteer.devices[device])
    return page
  }
  async genHTML(url){
    const page = await this.newPage();
    const res = await page.goto(url, { waitUntil: 'networkidle2' }) // 等待网络空闲，说明此时页面已经加载完成
    if(res && !res.ok()){
      throw new Error(`${res.status} on ${url}`)
    }

    // 创建骨架屏
    await this.makeSkeleton(page)
    const {html, styles} = await page.evaluate(() => Skeleton.getHtmlAndStyle())
    const result = `
      <style>${styles.join('\n')}</style>
      ${html}
    `
    return result
  }

  async makeSkeleton(page){
    const { defer=5000 } = this.options
    const scriptContent = await readFileSync(resolve(__dirname, 'skeletonScript.js'), 'utf8')
    await page.addScriptTag({ content: scriptContent })
    await sleep(defer) // 等待scriptContent脚本执行完成
    // 脚本执行完成后就是创建骨架屏的DOM结构了
    // 在页面中执行此函数
    await page.evaluate((options) => {
      Skeleton.genSkeleton(options)
    }, this.options)
  }
  async destroy(){
    if(this.browser){
      await this.browser.close();
      this.browser = null;
    }
  }
}


module.exports = Skeleton
