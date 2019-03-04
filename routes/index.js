const router = require('koa-router')()
const superagent = require('superagent')
const CONFIG = require('../config/config')
const koaBody = require('koa-body')
const path = require('path')
const fs = require('fs')
const request = require('request')
var iconv = require('iconv-lite')

module.exports = (app) => {
  app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200*1024*1024
    }
  }))
  router.get('/shoes/exportShoes', async ctx => {
    let url = ctx.request.url
    await requestGet(url, {}).then(res => {
      // ctx.set('Content-disposition', 'attachment;filename=name.jpg')
      // ctx.set('Content-type', 'application/vnd.ms-excel;charset=UTF-8')
      ctx.body = res
    }).catch(err => {
      ctx.throw(err)
    })
  })
  router.get('*', async ctx => {
    ctx.response.redirect('/')
  })

  router.post('*', async ctx => {
    let data = ctx.request.body
    let url = ctx.request.url
    //console.log(ctx.request.files)
    if(ctx.request.files) {
      let {path: filePath, name} = ctx.request.files.upfile
      const newPath = path.join(path.dirname(filePath),name)
      let result = await renameFile(filePath, newPath)
      data.upfile = result
      await requestFile(data, url).then(res => {
        ctx.body = res.body
      }).catch(err => {
        ctx.throw(err)
      })
    } else {
      await superagentNode(data, url).then(res => {
        ctx.body = res.body
      }).catch(err => {
        ctx.throw(err)
      })
    }
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
}

// 转发formdata
function requestFile(data, url){
  return new Promise((resolve, reject) => {
    request({
      method: "POST",
      url: CONFIG.server + url,
      formData: data
    }, (err, res, body) => {
      if(err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

// 转发get请求
function requestGet(url, data) {
  return new Promise((resolve, reject) => {
    request({
      method: "Get",
      url: CONFIG.server + url
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body);
        
      }
    })
  })
}

// 读取文件formdata
function renameFile(filePath, newPath){
  return new Promise((resolve, reject) => {
    fs.rename(filePath, newPath, (err) => {
      if(err) {
        reject(err) 
      } else {
        const file = fs.createReadStream(newPath)
        resolve(file)
      }
    })
  })
}

// 生成一个文件转发promise
function superagentNode(data, url){
  return new Promise((resolve, reject) => {
    superagent
      .post(CONFIG.server + url)
    .send(data)
    .set('Content-Type','application/json')
    .end(function(err, res) {
      if (!err && res.statusCode === 200){
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}
