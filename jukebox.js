var mqtt = require('mqtt');

var topicGeneric = 'BuildIT_BlueHack_Output_Song';
var brokerURL = 'mqtt://iot.eclipse.org';

var client = mqtt.connect(brokerURL, {});

var fs = require('fs');
var Sound = require('aplay');

client.on('connect', function () {
    client.subscribe(topicGeneric);
    console.log('connected subscribe');
})

client.on('message', function (topic, message) {
    var json = JSON.parse(message.toString());

    console.log(json);

    // var soundFile = 'wav/' + json.data + ".wav";
    var soundFile = 'wav/metallica.wav';

    console.log(soundFile);
    
    // capture context
    var self = this;
    var player = new Sound();

    player.on('complete', function () {
        console.info("> audio playback finished");
    });

    player.on('error', function () {
        console.error("> an audio playback error has occurred");
    });
    player.play(soundFile);
    
});