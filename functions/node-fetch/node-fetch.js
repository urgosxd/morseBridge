const fetch = require('node-fetch')

const handler = async function(event, context) {
  let query = event.queryStringParameters.consulta
  query = query.trim().replaceAll(' ', '+')
  console.log(query)
  try {
    const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${query}&location=Peru&google_domain=google.com.pe&gl=pe&hl=es&num=3&api_key=956366187f9ce0de0ab8fec9a2103250819db90578aac9935c13f85a9abe92fb`
      , {
        headers: { Accept: 'application/json' },
      })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    console.log(data)

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
