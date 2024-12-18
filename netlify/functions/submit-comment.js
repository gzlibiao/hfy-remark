const { createClient } = require('redis')

// 创建 Redis 客户端
const redis = createClient({
  url: 'redis://localhost:6379' // 连接到 Redis（或者使用你自己的 Redis 服务地址）
})

redis.connect()

const RATE_LIMIT_WINDOW = 60 * 1000 // 限制为每分钟一次提交
const MAX_SUBMISSIONS = 1 // 每分钟最大提交次数

exports.handler = async (event, context) => {
  const ip =
    event.headers['x-real-ip'] || event.headers['x-forwarded-for'] || event.clientContext.ip

  // 获取用户提交的时间戳（以 IP 为例）
  const lastSubmitTime = await redis.get(`comment_last_submit_${ip}`)

  // 如果存在最后提交时间，并且还在频率限制窗口内，拒绝评论
  if (lastSubmitTime && Date.now() - lastSubmitTime < RATE_LIMIT_WINDOW) {
    return {
      statusCode: 429, // 返回 429 Too Many Requests
      body: JSON.stringify({ message: '请稍后再提交评论。' })
    }
  }

  // 更新提交时间戳
  await redis.set(`comment_last_submit_${ip}`, Date.now())

  // 这里你可以将评论数据保存到数据库等地方
  // 示例：处理评论存储操作

  // 返回成功响应
  return {
    statusCode: 200,
    body: JSON.stringify({ message: '评论提交成功！' })
  }
}
