const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const html2jade = require('html2jade')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const config = require('../webpack.dev.js')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(compiler))
} else {
  app.use(express.static(path.join(__dirname, '../dist')))
}

app.use(express.static(path.join(__dirname, '../static')))
app.use(bodyParser.json())

app.post('/convert', ({ body: { html, options } }, res) => {
  const settings = {
    noemptypipe: true,
    ...options
  }

  html2jade.convertHtml(html, settings, (err, pug) => {
    if (err) {
      console.error(err)
      res.status(500).send(err.message)
      return
    }

    res.json({ pug })
  })

  res.end()
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listened on http://localhost:' + (process.env.PORT || 3000))
})
