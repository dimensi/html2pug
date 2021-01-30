const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const { convert } = require('./convert')

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

  app.use(express.static(path.join(__dirname, '../static')))
} else {
  app.use(express.static(path.join(__dirname, '../dist')))
}

app.use(bodyParser.json())

app.post('/convert', ({ body: { html, options } }, res) => {
  const settings = {
    noemptypipe: true,
    ...options
  }

  try {
    const pug = convert(html, settings)
    res.json({ pug })
  } catch (e) {
    console.error(e)
    res.status(500).send(e.message)
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listened on http://localhost:' + (process.env.PORT || 3000))
})
