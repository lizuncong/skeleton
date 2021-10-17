window.Skeleton = (function(){
  const CLASS_NAME_PREFIX = 'sk-'
  const $$ = document.querySelectorAll.bind(document)
  const REMOVE_TAGS = ['title', 'meta', 'style', 'script']
  const styleCache = {}
  function buttonHandler(element, options = {}){
    const className = CLASS_NAME_PREFIX + 'button'
    const rule = `{
      color: ${options.color} !important;
      background: ${options.color} !important;
      border: none !important;
      box-shadow: none !important;
    }`

    addStyle(`.${className}`, rule);

    element.classList.add(className)
  }

  function imageHandler(element, options = {}){
    const { width, height } = element.getBoundingClientRect()
    const attrs = {
      width, height, src: 'http://placeholder.png'
    }

    setAttributes(element, attrs)

    const className = CLASS_NAME_PREFIX + 'image'
    const rule = `{
      background: ${options.color} !important;
    }`


    addStyle(`.${className}`, rule);

    element.classList.add(className)
  }

  function setAttributes(element, attrs){
    Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]))
  }
  function addStyle(selector, rule){
    if(styleCache[selector]) return;
    styleCache[selector] = rule;
  }
  // 转换原始元素为骨架DOM元素
  function genSkeleton(options){
    console.log(options)
    const rootElement = document.documentElement;
    ;(function traverse(options){
      const { button, image } = options;
      const buttons = []
      const imgs = []
      function preTraverse(element){
        if(element.children && element.children.length){
          Array.from(element.children).forEach(child => preTraverse(child))
        }
        if(element.tagName === 'BUTTON'){
          buttons.push(element)
        } else if(element.tagName === 'IMG'){
          imgs.push(element)
        }
      }

      preTraverse(rootElement)

      buttons.forEach(item => buttonHandler(item, button))
      imgs.forEach(item => imageHandler(item, image))
    })(options)

    let rules = ''
    Object.keys(styleCache).forEach(key => {
      rules += `${key}${styleCache[key]}\n`
    })
    const styleEle = document.createElement('style');
    styleEle.innerHTML = rules;
    styleEle.id = 'skeleton-style'
    document.head.appendChild(styleEle)
  }

  // 获得骨架DOM元素的HTML字符串和样式style
  function getHtmlAndStyle(){
    const styles = Array.from($$('style')).map(style => style.innerHTML || style.innerText)
    Array.from($$(REMOVE_TAGS.join(','))).forEach(ele => {
      if(ele.id === 'skeleton-style') return;
      ele.parentNode.removeChild(ele)
    })
    const html = document.body.innerHTML
    return {
      html,
      styles
    }
  }

  return { genSkeleton, getHtmlAndStyle }
})()
