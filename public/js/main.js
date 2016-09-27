function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {

    /**
     * Создаю html редактор
     * @type {object}
     */
    var htmlAce = ace.edit("html");
    htmlAce.setTheme("ace/theme/chrome");
    htmlAce.getSession().setMode("ace/mode/html");
    htmlAce.$blockScrolling = Infinity;
    htmlAce.setFontSize(14);

    /**
     * Создаю jade редактор
     * @type {object}
     */
    var jade = ace.edit("jade");
    jade.setTheme("ace/theme/chrome");
    jade.getSession().setMode("ace/mode/jade");
    jade.$blockScrolling = Infinity;
    jade.setFontSize(14);

    /**
     * Передаю пример в html редактор
     * @type {String}
     */
    htmlAce.getSession().setValue(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Jade</title>
        <script type="text/javascript">
          foo = true;
          bar = function () {};
          if (foo) {
            bar(1 + 5)
          }
        </script>
      </head>
      <body>
        <h1>Jade - node template engine</h1>
        <div id="container" class="col">
          <p>You are amazing</p>
          <p>Jade is a terse and simple
             templating language with a
             strong focus on performance
             and powerful features.</p>
        </div>
      </body>
    </html>`);


    /**
     * Функция передает по ajax html код и получает jade
     * @param {String}   html        содержимое htmlAce
     * @param {Bool}   tabs        [description]
     * @param {Int}   spaces      [description]
     * @param {Bool}   bodyless    [description]
     * @param {Bool}   noattrcomma [description]
     */
    function convert(html, tabs, spaces, bodyless, noattrcomma) {
        /**
         * Передаю объект с данными
         * @type {Object}
         */
        var data = {
            html:        html,
            tabs:        tabs,
            spaces:      spaces,
            bodyless:    bodyless,
            noattrcomma: noattrcomma
        };
        /**
         * Отправляю POST и поменящаю содержимое в jade
         */
         aja()
         .method('post')
         .url('/convert')
         .data(data)
         .on('200', function(response) {
             jade.getSession().setValue(response.jade);
         })
         .go();
    }

    /**
     * Если выбраны табы, то spaceValueField скрыто
     */
    document.getElementById('tabs-or-space').onclick = function() {
        var tabs            = document.getElementById('tabs');
        var spaceValueField = document.getElementById('spaceValueField');

        if (tabs.checked) {
            spaceValueField.style.opacity = 0;
        } else {
            spaceValueField.style.opacity = 1;
        }
    };

    function iftrue (el) {
        if (el) {
            return true;
        } else {
            return '';
        }
    }

    /**
     * По кнопке передаю все в функцию
     */
    document.querySelector('#convert').onclick = function() {
        var html        = htmlAce.getValue();
        var tabs        = document.querySelector('#tabs').checked;
        var spaces      = document.querySelector('#spaceValue').value;
        var bodyless    = document.querySelector('#bodyless').checked;
        var noattrcomma = document.querySelector('#noattrcomma').checked;

        tabs        = iftrue(tabs);
        bodyless    = iftrue(bodyless);
        noattrcomma = iftrue(noattrcomma);

        convert(html,tabs,spaces,bodyless,noattrcomma);
    };

});
