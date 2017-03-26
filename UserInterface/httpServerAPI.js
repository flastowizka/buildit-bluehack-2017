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
const path = require('path');

const WebSocket = require('ws');
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
  var paramImagem = '/assets/telas/RostoRobo.png';
  if( request.query.paramImagem ){
    paramImagem = request.query.paramImagem;
  }

  response.render('inicio', {
    imagem: paramImagem
  });
});

const server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
var wsCliente; // transformar em um array para manter referencia de todos os clientes conectados
var callbackOnMessage;

// tratamento de erros
wss.on('error', function connection(error) {
  console.error('WebSocket.Server: ' + error);
});

// Servidor aberto
wss.on('listening', function connection(error) {
  console.error('WebSocket.Server: listening');
});

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  var id = null;

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

  console.log('wsCliente started');

  wsCliente = ws;

  // log de acoes do servidor para monitoramento
  ws.on('message', function incoming(message) {
    console.log('wsCliente received : %s', message);
	  if( callbackOnMessage != null ){
		callbackOnMessage();
	  }
  });

  ws.on('close', function (code, reason) {
    console.log('wsCliente stopping : code = %s reason = %s', code, reason);
  });

  ws.on('error', function (error) {
    console.log('wsCliente error : %s', error);
  });

  ws.on('unexpected-response', function (request, response) {
    console.log('wsCliente unexpected-response : request %o | response : %o', request, response);
  });

});

var serverListening;

function HttpServer(callback) {
  // inicar o server apenas uma vez
  if( !serverListening ){
    serverListening = server.listen(8081, function () {

       var host = server.address().address
       var port = server.address().port

       console.log("HttpServer -> serverListening");

       console.log("App listening at http://%s:%s", host, port)

    });
  } else {
    serverListening = server.connection(8081, function () {

       var host = server.address().address
       var port = server.address().port

       console.log("HttpServer -> serverListening -> ELSE");

       console.log("App listening at http://%s:%s", host, port)

    });
  }

  // salva referencia de metodo
  callbackOnMessage = callback;

  // this.ws = ws;
}

HttpServer.prototype.wsSendMsg = function(data){
  if( wsCliente && wsCliente.readyState == 1 ){ // OPEN
    wsCliente.send(JSON.stringify(data));
  }else if( wsCliente ){
    console.log('wsCliente not OPEN: wsCliente.readyState = ' + wsCliente.readyState);
  }else{
    console.log('wsCliente not OPEN: wsCliente = ' + wsCliente);
  }
}

module.exports = HttpServer;
