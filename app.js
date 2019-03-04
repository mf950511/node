const Koa = require('koa')
const path = require('path')
const app = new Koa()
const serve = require('koa-static')
const CONFIG = require('./config/config')
const router = require('./routes/index')

//配置静态文件
app.use(serve(
  path.join(__dirname, 'dist/')
))

// 路由 
router(app)

app.listen(CONFIG.port, () => {
  console.log(`server running in http://localhost:${CONFIG.port}`)
  console.log(`api running in ${CONFIG.server}`)
})