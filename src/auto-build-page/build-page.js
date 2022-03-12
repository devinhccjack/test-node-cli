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
    console.log('echo--------',paths)
    shell.echo('页面地址:' + paths)
    fs.mkdir(paths, function() { 
      var str = ''
      if (config.helloworld) { 
        // 新建空白页，读取空白页模版 
        var sss=path.resolve('./src/auto-build-page/template-helloworld.vue')
        var fff=fs.readFileSync(sss) 
        str = handleStr(fff.toString(),config)
      } else { 
        var sss=path.resolve('./src/auto-build-page/template-table.vue')
        console.log('sss----',sss)
        var fff=fs.readFileSync(sss) 
        console.log('fff----',fff)

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
      // addRou(`./views/${config.name}/index.vue`, config)
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
  