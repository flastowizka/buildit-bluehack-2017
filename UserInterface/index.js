var nconf = require('nconf');
// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: './config/config.json' });

var HttpServerLib = require('./httpServerAPI.js');
var ScreenFlowLib = require('./screenFlowAPI.js');

var server = new HttpServerLib();
var screenFlow = new ScreenFlowLib(server);


var mqtt = require('mqtt');

var topicGenericSong = 'BuildIT_BlueHack_Output_Song';
var topicGeneric = 'BuildIT_BlueHack_Output';
var brokerURL = 'mqtt://iot.eclipse.org';

var client = mqtt.connect(brokerURL, {});


client.on('connect', function () {
    client.subscribe(topicGeneric);
	client.subscribe(topicGenericSong);
    console.log('connected subscribe');
})

client.on('message', function (topic, message) {
    var json = JSON.parse(message.toString());


    console.log(json);
	console.log("client. -> index.js");

	DecideSugest(json);
})



// var id2 = setInterval(function () {
// 	// // chamada de retorno
// 	if( server ){
// 		DecideSugest();
// 			clearInterval(id2);
// 	}
// }, 10000);

var dados = {
	page: "cardapio"
}

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
