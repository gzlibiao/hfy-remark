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

const { parse } = require('urltel')
const { get } = require('axios')

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
      `https://api.live.bilibili.com/xlive/web-room/v1/gift/bag_list?${parse(
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
