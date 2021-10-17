/**
 * 骨架屏插件，生成骨架屏的实现思路
 * 监听打包完成的事件
 * 当webpack编译完成后，启动一个服务，通过pub去访问这个生成的页面，抓取内容
 * **/
const PLUGIN_NAME = "SKELETON_PLUGIN"
const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const Server = require('./Server');
const Skeleton = require('./Skeleton')
class SkeletonPlugin{
  constructor(options){
    this.options = options
  }
  apply(compiler){
    console.log('skeleton plugin')
    compiler.hooks.done.tap(PLUGIN_NAME, async() => {
      await this.startServer()
      //生成骨架屏内容
      this.skeleton = new Skeleton(this.options)
      await this.skeleton.initialize() // 启动一个无头浏览器
      // 生成骨架屏的html和style
      const skeletonHTML = await this.skeleton.genHTML(this.options.origin)
      console.log('skeletonHtml', skeletonHTML)
      const originPath = resolve(this.options.staticDir, 'index.html');
      const originHTML = await readFileSync(originPath, 'utf8')
      const finalHTML = originHTML.replace('<!-- shell -->', skeletonHTML)
      await writeFileSync(originPath, finalHTML)
      await this.skeleton.destroy() // 销毁无头浏览器
      await this.server.close()
    })
  }

  async startServer(){
    this.server = new Server(this.options)
    await this.server.listen();
  }
}

module.exports = SkeletonPlugin
