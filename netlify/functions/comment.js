const http = require('http')
const Waline = require('@waline/vercel')
const serverless = require('serverless-http')

const app = Waline({
  env: 'netlify',
  async avatarUrl(comment) {
    const reg = new RegExp('(\\d+)@qq\\.com$', 'i')
    const mail = comment.mail
    if (reg.test(mail)) {
      const q = mail.replace(/@qq\.com/i, '').toLowerCase()
      return 'https://q1.qlogo.cn/headimg_dl?dst_uin=' + q + '&spec=4'
    }
    return 'https://jf-temp-1301446188.cos.ap-guangzhou.myqcloud.com/logo1'
  },
  // 每秒允许的请求次数
  IPQPS: 0,

  // 限制某个 IP 在 1 小时内最多提交评论次数
  maxAge: 60 * 60 * 1000, // 1 小时

  // 是否启用 IP 限制
  enable: true,

  async postSave(comment) {
    console.log('comm', comment)

    // do what ever you want after save comment
  }
})
module.exports.handler = serverless(http.createServer(app))
