var TJBot = require('tjbot');
// var config = require('./config');

// obtain our credentials from config.js
// var credentials = config.credentials;
var credentials = {
    // text_to_speech: {
    //     "username": "a8b47ad5-e5fb-4a9c-81c2-5e3f02656e3a",
    //     "password": "wzUqNFDLk8KE"
    // }
};

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['servo'];

// turn on debug logging to the console
var tjConfig = {
    verboseLogging: true,
    // 'attentionWord': 'TJ', // attention word for STT
    // 'ledPin': 8,    
    // 'servoPin': 7,
    // 'voice': 'pt-BR_IsabelaVoice',
    // 'verboseLogging': false,  
    // 'ttsReconnect': true,    // reconnect to STT service on error
    // 'visionConfidenceThreshold': 0.5, // Confidence threshold for tags from visual recognition service. Tags below this will be ignored.
    // 'visionTextConfidenceThreshold': 0.1,
    // 'cameraParams': {
    //     height: 720,
    //     width: 960,
    //     vflip: true,   // vertical flip
    //     hflilp: true    // horizontal flip
    // } //set camera params
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);






var mqtt = require('mqtt');

var topicGeneric = 'BuildIT_BlueHack_Output';
var brokerURL = 'mqtt://iot.eclipse.org';

var client = mqtt.connect(brokerURL, {});

client.on('connect', function () {
    client.subscribe(topicGeneric);
    console.log('connected subscribe');

    // client.publish(topicGeneric, 'Hello mqtt: ' + new Date().getTime());
    console.log('connected publish');
})

client.on('message', function (topic, message) {
    var json = JSON.parse(message.toString());    

    // if (json.page == "recomendacao" || json.page == "inicio") {
    if(json.page == "pagamento") {
        tj.wave();
        tj.wave();
        tj.wave();
        tj.wave();
        tj.wave();
        tj.wave();
        tj.wave();
    }
})