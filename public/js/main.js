(function() {
    var html = ace.edit("html");
    html.setTheme("ace/theme/chrome");
    html.getSession().setMode("ace/mode/html");
    html.$blockScrolling = Infinity;

    var jade = ace.edit("jade");
    jade.setTheme("ace/theme/chrome");
    jade.getSession().setMode("ace/mode/html");
    jade.$blockScrolling = Infinity;


    html.getSession().setValue(`<!DOCTYPE html>
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
    var convert = function(htmlCode, cb) {
        $.post('/convert', { html: htmlCode}, cb);
    };
    $('#convert').on('click', function(e) {
        e.preventDefault();

        var htmlCode = html.getValue();

        convert(htmlCode, function(result) {
            console.log(result);
            jade.setValue(result.jade);
        });
    });
})(jQuery);
