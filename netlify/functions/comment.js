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
  IPQPS: process.env.IPQPS || 5, // 默认值为 5
  async postSave(comment) {
    console.log('comm', comment)

    // do what ever you want after save comment
  }
})
module.exports.handler = serverless(http.createServer(app))

module.exports = {
  IPQPS: process.env.IPQPS || 5 // 默认值为 5
}
