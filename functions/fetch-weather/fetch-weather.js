// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const axios = require('axios');

const handler = async (event) => {
  const {id} = event.queryStringParameters;

  // eslint-disable-next-line no-undef
  const API_SECRET = process.env.API_SECRET;
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${API_SECRET}&units=metric`

  try {
    const {data} = await axios.get(url);
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch(error) {
    const {status, statusText, headers, data} = error.response

    return {
      statusCode: status,
      body: JSON.stringify({status, statusText, headers, data})
    }
  }
}

module.exports = { handler }
