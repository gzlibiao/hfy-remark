// const http = require('http');
// const Waline = require('@waline/vercel');
// const serverless = require('serverless-http');

// const app = Waline({
//   env: 'netlify',
//   async postSave(comment) {
//     // do what ever you want after save comment
//   },
// });

// module.exports.handler = serverless(http.createServer(app));

const { get } = require('axios')

function parseUrlTel(urlString) {
  // 解析URL
  const urlObj = url.parse(urlString)
  // 查询参数对象
  const queryObj = new URLSearchParams(urlObj.query)
  // 尝试从查询参数中获取tel
  const tel = queryObj.get('tel')
  return tel || null
}

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    }
  }

  try {
    const { code } = queryStringParameters
    if (!code) {
      return {
        statusCode: 400,
        body: 'Bad Request: code is required'
      }
    }

    const { data } = await get(
      `https://api.live.bilibili.com/xlive/web-room/v1/gift/bag_list?${parseUrlTel(
        queryStringParameters
      )}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
      }
    )

    if (data.code === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(data.data)
      }
    } else {
      return {
        statusCode: 400,
        body: 'Bad Request: ' + data.message
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Internal Server Error: ' + error.message
    }
  }
}
