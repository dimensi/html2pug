var express = require('express'),
    app = express(),
    pub = __dirname + '/public/',
    views = __dirname + '/views',
    bodyParser = require('body-parser'),
    html2jade = require('html2jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(pub)); // Подключил файлы из паблика
app.set('view engine', 'pug'); //Подключил pug
app.set('views', views); // Указал путь до views

app.post('/convert', function(req, res) {
    var html = req.body.html;

    html2jade.convertHtml(html, {}, function (err, jade) {
        res.json({ jade: jade });
    });
})
app.get('/', function(req, res) {
    res.render('index', { title: 'html2pug'});
});

app.listen(3000, function() {
    console.log('Сервер запущен');
});
