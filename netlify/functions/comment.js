const http = require('http')
const Waline = require('@waline/vercel')
const serverless = require('serverless-http')

const app = Waline({
  env: 'netlify',
  handler: async (req, res) => {
    if (req.method === 'POST') {
      const userIp = getClientIp(req) // 获取用户的 IP 地址
      console.log(userIp, 'userIp"')

      // 提交评论
      try {
        const comment = req.body

        // 将评论保存到 Waline 服务
        await waline.comment.create(comment)

        // 更新用户的上次评论时间
        await setLastCommentTime(userIp, currentTime)

        return res.status(200).json({ message: 'Comment submitted successfully!' })
      } catch (error) {
        return res.status(500).json({ message: 'Failed to submit comment', error })
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }
  },
  async postSave(comment) {
    // do what ever you want after save comment
  }
})

module.exports.handler = serverless(http.createServer(app))
