// const WebSocket2 = require('ws');

var host = window.document.location.host.replace(/:.*/, '');

console.log("host -> " + host);

const ws = new WebSocket('ws://' + host + ':8081');

ws.onopen = function() {
    ws.send('something from client');
};

ws.onmessage = function(message) {
	console.log(message);
    console.log('received from server: %s', message.data);

    // tratamento das mensagens
    var dados = JSON.parse(message.data);
	
	//var dados = message.data;
	
	 var div = $('#imgFundo');
    if( dados.imgFundo != '' ){
      div.attr("src", dados.imgFundo);
    }
	//var div = $('#imgFundo');
	
	//var dados = "1";
	// DecideSugest(dados);
	
	
};


// var mqtt = require('mqtt');

// var topicGenericSong = 'BuildIT_BlueHack_Output_Song';
// var topicGeneric = 'BuildIT_BlueHack_Output';
// var brokerURL = 'mqtt://iot.eclipse.org';

// var client = mqtt.connect(brokerURL, {});


// client.on('connect', function () {
//     client.subscribe(topicGeneric);
// 	client.subscribe(topicGenericSong);
//     console.log('connected subscribe');
// })

// client.on('message', function (topic, message) {
//     var json = JSON.parse(message.toString());


//     console.log(json);
// 	console.log("client. -> index.js");

// 	DecideSugest(json);
// })



var DecideSugest = function(dados) {
	console.log("function DecideSugest");
	console.log(dados);
	console.log(dados.page);
	switch (dados.page) {
		case "inicio":
			screenFlow.cardapio();
			break;
		case "parceiro":
			screenFlow.Parceiro();
			break;
		case "camera":
			screenFlow.camera();
			break;
		case "jukebox": 
			screenFlow.jukeBox();
			break;
		case "despedida":
			screenFlow.Despedida();
			break;
		case "pagamento":
			screenFlow.Pagamento();
			break;
		case "cardapio":
			console.log("entrou");
			screenFlow.cardapio();
			break;
		case "default":
			// chamando função random
			
			var x = Math.floor(Math.random() * 7 + 1);
			
			if (x===1)
			{
				screenFlow.sugestCafeManha();
			}
			else if(x===2)
			{
				screenFlow.sugestParmegiana();
			}
			else if(x===3)
			{
				screenFlow.sugestPizza();
			}
			else if(x===4)
			{
				screenFlow.sugestParmegiana();
			}
			else if(x===5)
			{
				screenflow.sugestSorvete();
			}
			else if(x===6)
			{
				screenFlow.sugestVinho();
			}
			else 
			{
				screenFlow.cardapio();
			}
	}	
	
};
