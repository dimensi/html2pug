const { convert } = require('./convert')
const parse = require('co-body')

module.exports = async (req, res) => {
  const { html, options } = await parse.json(req)

  try {
    const pug = await convert(html, options)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ pug }))
  } catch (err) {
    console.error(err)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end(err.message)
  }
}
