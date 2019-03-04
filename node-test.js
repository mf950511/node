const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const app = new Koa()
const router = new Router()
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024
  }
}))
router.get('/api/getData', async ctx => {
  console.log(ctx.request.headers)
  console.log(ctx.request.body)
  console.log(ctx.request.files)
})
router.post('/api/getData', async ctx => {
  console.log(ctx.request.headers)
  console.log(ctx.request.body)
  console.log(ctx.request.files)
})
router.post('/good-server/good/uploadGoodsPhoto', async ctx => {
  
  console.log(ctx.request.body)
})
app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3001)