var express    = require('express'),
    app        = express(),
    pub        = __dirname + '/public/',
    views      = __dirname + '/views',
    bodyParser = require('body-parser'),
    html2jade  = require('html2jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(pub)); // Подключил файлы из паблика
app.set('view engine', 'pug'); //Подключил pug
app.set('views', views); // Указал путь до views

app.post('/convert', function(req, res) {

    var html        = req.body.html,
        tabs        = Boolean(req.body.tabs),
        spaces      = Number(req.body.spaces),
        bodyless    = Boolean(req.body.bodyless),
        noattrcomma = Boolean(req.body.noattrcomma);

    var options = {
            tabs: false,
            noemptypipe: true,
            double: true,
            nspaces: spaces,
            noattrcomma: noattrcomma,
            bodyless: bodyless
        }

    if (tabs) {
        options['tabs'] = true;
    }else {
        options['tabs'] = false;
    }

    console.log('tabs: ' + tabs);
    console.log('spaces: ' + spaces);
    console.log('bodyless: ' + bodyless);
    console.log('noattrcomma: ' + noattrcomma);
    html2jade.convertHtml(html, options, function (err, jade) {
        res.json({ jade: jade });
    });
})
app.get('/', function(req, res) {
    res.render('index', { title: 'html2pug'});
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Сервер запущен');
});
