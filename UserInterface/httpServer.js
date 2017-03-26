/*
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();

app.use(express.static(path.join(__dirname, '/views')));

var wss = new WebSocketServer({server: server});
wss.on('connection', function (ws) {
  var id = setInterval(function () {
    ws.send(JSON.stringify(process.memoryUsage()), function () {  ignore errors  });
  }, 100);
  console.log('started client interval');
  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });
});

server.on('request', app);
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});
*/

const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const path = require('path');
const exphbs = require('express-handlebars');
const express = require('express');

const app = express();

//app.use('/views', express.static('views'));
app.use('/assets', express.static('assets'));
app.use('/jslib', express.static('node_modules'));


app.get('/', function (req, res) {
   res.send('Aplicação rodando...');
});

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views')
}));

app.set('view engine', '.hbs') ;
app.set('views', path.join(__dirname, 'views'));

app.get('/visao', (request, response) => {
  var paramImagem = '/assets/telas/inicio.png';
  if( request.query.paramImagem != '' ){
    paramImagem = request.query.paramImagem;
  }

  response.render('inicio', {
    imagem: paramImagem
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  var id = 0;
  /* Codigo de teste para comunicacao
  id = setInterval(
    function () {

      var d = new Date();

      var data = //{"flutuante1":"0","flutuante2":"1","imgFundo":"/assets/telas/tela-1a-com-timer-clean.png"}

                  {
                    'flutuante1': (d.getSeconds()).toString(),
                    'flutuante2': (d.getSeconds()+1).toString(),
                    'imgFundo': '/assets/telas/tela-1a-com-timer-clean.png'
                  };

      console.log('sending: ' + JSON.stringify(data));
      ws.send(JSON.stringify(data));

  }, 1000);
  */
  console.log('started client interval');

  ws.on('message', function incoming(message) {
    console.log('received from client: %s', message);
  });

  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });

  // ws.send('something from server');
});

var serverListening = server.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("serverListening");

   console.log("Example app listening at http://%s:%s", host, port)

});
