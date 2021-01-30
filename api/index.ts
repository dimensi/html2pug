const { convert } = require('convert.js')

module.exports = (req, res) => {
  res.json({
    convert: convert(req.body)
  })
}
