process.env.NODE_PATH = __dirname
const express = require('express')
const bodyParser = require('body-parser')
const html2jade = require('html2jade')
const app = express()

app.use(bodyParser.json())
app.use(express.static('src/static')) // Подключил файлы из паблика
app.set('view engine', 'pug') // Подключил pug
app.set('views', 'src/views') // Указал путь до views
app.locals.pretty = true

app.post('/convert', (req, res) => {
  const html = req.body.html
  const optionsFromReq = req.body.options

  const options = {
    noemptypipe: true,
    double: true,
    donotencode: true
  }

  if (optionsFromReq.tabs) {
    options.tabs = true
  } else {
    options.tabs = false
  }

  if (optionsFromReq.spaces) {
    options.nspaces = Number(optionsFromReq.spaces)
  }

  if (optionsFromReq.bodyless) {
    options.bodyless = true
  }

  if (optionsFromReq.noattrcomma) {
    options.noattrcomma = true
  }

  html2jade.convertHtml(html, options, (err, jade) => {
    if (err) {
      console.error(err)
      res.status(500).send(err.message)
      return
    }

    res.json({ jade })
  })
  res.end()
})

app.get('/', (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  res.render('index', { title: 'html2pug', baseUrl: fullUrl })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listened on ' + (process.env.PORT || 3000))
})
