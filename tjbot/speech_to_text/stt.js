var TJBot = require('tjbot');

// obtain our credentials from config.js
// var credentials = config.credentials;
var credentials = {
    speech_to_text: {
        username: 'f87ff4f0-4f56-40a6-ba3c-657f2459acb2',
        password: 'mR0qm8axluR7',
    }
};

// these are the hardware capabilities that our TJ needs for this recipe
// var hardware = ['led', 'microphone', 'speaker', 'servo', 'camera'];
var hardware = ['led', 'microphone'];

// turn on debug logging to the console
var tjConfig = {
    verboseLogging: true,
    'attentionWord': 'Manoel', // attention word for STT
    'voice': 'pt-BR_IsabelaVoice',
    'language': 'pt-BR',
    'ttsReconnect': true,    // reconnect to STT service on error
    'visionConfidenceThreshold': 0.5, // Confidence threshold for tags from visual recognition service. Tags below this will be ignored.
    'visionTextConfidenceThreshold': 0.1,
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();

var mqtt = require('mqtt');

var topicGeneric = 'BuildIT_BlueHack_Input';
var topicGenericOutput = 'BuildIT_BlueHack_Output';
// var clientIdTJ = 'MQTT_BuildIT_BlueHack_TJ_2017';
var brokerURL = 'mqtt://iot.eclipse.org';

var client  = mqtt.connect(brokerURL, {
//   clientId : clientIdTJ
});

var msg = {
    
}; //JSON.stringify(result);


client.on('connect', function (topic, message) {
    client.subscribe(topicGenericOutput);
    console.log('connected subscribe -> ' + topicGenericOutput);
});

client.on('message', function (topic, message) {

    console.log("******************************************************************");
    console.log("******************** OUT PUT *********************")
    console.log("******************************************************************");
    

    // if (topic == topicGenericOutput) {
        var json = JSON.parse(message.toString());    
        console.log(json);

        msg = json;
    // }
})


// console.log("I understand lots of colors.  You can tell me to shine my light a different color by saying 'turn the light red' or 'change the light to green' or 'turn the light off'.");

// uncomment to see the full list of colors TJ understands
// console.log("Here are all the colors I understand:");
// console.log(tjColors.join(", "));

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
// var colors = ["Manoel", "manoel", "Manu", "manu", "mano", "Mano", "manual"];
// tjColors.forEach(function(color) {
//     colors[color] = 1;
// });

// listen for speech
tj.listen(function(mensagem) {
    console.log("listen TRUE -> " + mensagem);
    // var containsTurn = msg.indexOf("turn") >= 0;
    // var containsChange = msg.indexOf("change") >= 0;
    // var containsSet = msg.indexOf("set") >= 0;
    // var containsLight = msg.indexOf("the light") >= 0;
    // var containsDisco = msg.indexOf("disco") >= 0;

    // if ((containsTurn || containsChange || containsSet) && containsLight) {
        // was there a color uttered?
        var words = mensagem.split(" ");
        for (var i = 0; i < words.length; i++) {
            var word = words[i];

            // console.log("word[" + word + "]" + colors[word] + " -> " + colors.indexOf(word) == 0);
            // if (colors[word] != undefined) {
            if (word == "Manoel" || word == "manoel" || word == "Manu" || word == "manu" || word == "mano" || word == "Mano" || word == "manual" || 
                word == "manuel" || word == "Manuel" || word == "Manuela" || word == "manuela") {
                console.log("Manoel its TRUEEE -> [" + word + "]" + mensagem);

                msg["text"] = mensagem;

                console.log(JSON.stringify(msg));

                client.publish(topicGeneric, JSON.stringify(msg));

                // yes!
                // tj.shine(word);
                break;
            }
        }
    // } else if (containsDisco) {
    //     // discoParty();
    // }
});