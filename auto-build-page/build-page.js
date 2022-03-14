var addConfig = require('./addConfig')
var fs = require('fs')
var path = require('path')
var shell = require('shelljs')

shell.echo('>>>>>>')
shell.echo('开始新建页面')
addConfig.forEach((ele) => {
  if (ele.open) {
    buildPage(ele)
  }
})

function buildPage(config) {
    var paths = path.resolve(`./src/views/${config.name}`)
    shell.echo('页面地址:' + paths)
    fs.mkdir(paths, function() { 
      var str = ''
      if (config.helloworld) { 
        // 新建空白页，读取空白页模版 
        // var sss=path.resolve('./src/auto-build-page/template-helloworld.vue')
        var sss=path.resolve('./auto-build-page/template-helloworld.vue')
        var fff=fs.readFileSync(sss) 
        str = handleStr(fff.toString(),config)
      } else { 
        // var sss=path.resolve('./src/auto-build-page/template-table.vue')
        var sss=path.resolve('./auto-build-page/template-table.vue')
        var fff=fs.readFileSync(sss) 
        str = handleStr(fff.toString(),config)
      } 
      // 写入文件
      fs.writeFile(paths + '/index.vue', str,{'flag':'a'},function(err){
        if(err){
          throw err
        }
      }) 
      shell.echo('结束生成页面')
    //   shell.echo('开始新增路由……')
      addRou(`./views/${config.name}/index.vue`, config)
    }) 
  }
  function handleStr(str, config) { 
    if (config.helloworld) {
      return str
    } 
    str = str.replace('%title%', config.desc)
    str = str.replace('%method%', config.getlist.method)
    str = str.replace('%geturl%', config.getlist.url)
    return str
  }

  function addRou(paths, config) {
    var templateStr = handleRouStr(
      fs.readFileSync(path.resolve('./auto-build-page/template-route.txt')),
      config,
      paths
    )
    // 添加到路由文件
    addToConf(templateStr)
  }

  function handleRouStr(str, config, paths) {
    str = str.toString().replace(/%path%/g, `/${config.name}`)
    str = str.replace(/%name%/g, config.desc)
    str = str.replace(/%name2%/g, `${config.desc}首页`)
    str = str.replace(/%repath%/g, `/${config.name}/index`)
    str = str.replace(/%requirepath%/g, paths)
    return str
  }

  function addToConf(str) {
    str += '// add-flag' // 添加的位置标记
    var confStr = handleConfRouStr(fs.readFileSync(path.resolve('./src/addRoute.js')), str)
    fs.writeFileSync(path.resolve('./src/addRoute.js'), confStr)
    shell.echo('路由添加成功!')
    shell.echo('结束生成页面')
    shell.echo('>>>>>>')
  }
  function handleConfRouStr(ori, str) {
    ori = ori.toString().replace('// add-flag', str)
    return ori
  }
  
