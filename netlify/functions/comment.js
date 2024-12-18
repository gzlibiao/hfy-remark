const http = require('http')
const Waline = require('@waline/vercel')
const serverless = require('serverless-http')

const app = Waline({
  env: 'netlify',
  comment: {
    enable: true, // 启用评论功能
    verify: false, // 禁用验证码（防止评论频繁需要输入验证码）
    moderation: false, // 禁用评论审核（减少进入审核队列的校验）
    // 其他校验相关的配置项，如垃圾评论防护等
    akismet: false // 禁用 Akismet 垃圾评论防护（如果该功能有开启）
  },
  async postSave(comment) {
    // do what ever you want after save comment
  }
})

module.exports.handler = serverless(http.createServer(app))
