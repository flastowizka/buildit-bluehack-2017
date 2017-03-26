var tjbot = require('tjbot');
// var config = require('./config'); // user configuration file

// var PiMotion = require('node-pi-motion');

// var options = {
//     verbose: true,
//     throttle: 200
// }
// var nodePiMotion = new PiMotion(options);

// obtain credentials from config.js, see config.default.js for more info.
var credentials = {
    password: '4ab96a3985c4ce82bf51bb2b2e213965270faf9b',
	username: 'Credentials-1',
    conversation: {
         "username": "daef8bcc-47a5-43b6-9b1e-b075e582e44c",
  "password": "uRTpwyD0erZ1"
    }, 
    speech_to_text: {
        username: 'f87ff4f0-4f56-40a6-ba3c-657f2459acb2',
        password: 'mR0qm8axluR7',
    }, 
    text_to_speech: {
"username": "6ce063d6-46d5-4173-ad22-ea8b32902c0a",
  "password": "7id5KdJMBzMr"
    }, 
    tone_analyzer: {
        "username": "e8d5ecb7-5382-4a77-a235-a8818a9a4429",
  "password": "4uBOwrGH34G8"
    },
    visual_recognition: {
        key: '4ab96a3985c4ce82bf51bb2b2e213965270faf9b',
        version: '2016-05-19'
    }
};
 
// these are the hardware capabilities that our TJ needs for this example
var hardware = ['led', 'camera'];
 
// turn on debug logging to the console
var config = {
    verboseLogging: true,  // enable console debugging
    'attentionWord': 'TJ', // attention word for STT
    'ledPin': 8,    
    'servoPin': 7,
    'voice': 'en-US_MichaelVoice',
    'verboseLogging': false,  
    'ttsReconnect': true,    // reconnect to STT service on error
    'visionConfidenceThreshold': 0.5, // Confidence threshold for tags from visual recognition service. Tags below this will be ignored.
    'visionTextConfidenceThreshold': 0.1,
    'cameraParams': {
        height: 720,
        width: 960,
        vflip: true,   // vertical flip
        hflilp: true    // horizontal flip
    } //set camera params
};
 
// instantiate the TJBot library!
var tj = new tjbot(hardware, config, credentials);

var mqtt = require('mqtt');

var topicGeneric = 'BuildIT_BlueHack_Input';
// var clientIdTJ = 'MQTT_BuildIT_BlueHack_TJ_2017';
var brokerURL = 'mqtt://iot.eclipse.org';

var client  = mqtt.connect(brokerURL, {
//   clientId : clientIdTJ
});

var isIdentificado = false;

// nodePiMotion.on('DetectedMotion', function() {
// 	console.log('Motion detected! Now do something.');

    if (!isIdentificado) {
        isIdentificado = true;

        // setTimeout(function() {
            console.log("Iniciando reconhecimento de imagem após 30 seconds");
        

            // Change LED color to red.
            tj.shine("red");

            // console.log(tj.see('classify'));

            // tj.see('classify').then(function(result) {
            tj.see('face_detection').then(function(result) {
                console.log(JSON.stringify(result))

                var msg = {
                    payload: result.object
                }; //JSON.stringify(result);
                
                var countFace = 0
                var hasChildren = false;
                var hasAged = false;

                var minAge = 0;
                var maxAge = 0;
                var avgAge = 0;

                var faces_local = null;

                if(msg.payload.images[0] === undefined){
                    faces_local = msg.payload.images;
                } else {
                    faces_local = msg.payload.images[0];
                }

                while ( faces_local.faces[countFace] ) {
                    minAge = 0;
                    maxAge = 0;
                    if (faces_local.faces[countFace].min !== null) {
                        minAge = faces_local.faces[countFace].min;
                    }
                    if (faces_local.faces[countFace].max !== null) {
                        maxAge = faces_local.faces[countFace].max;
                    }
                    
                    if(minAge>0 && maxAge>0){
                        avgAge = (maxAge-minAge)/2;
                        
                        hasChildren = ( avgAge < 10 );
                        hasAged = ( avgAge > 60 );
                    }
                    
                    countFace++;
                }

                var saudacao = "";
                var date = new Date();
                var current_hour = date.getHours();
                current_hour = current_hour - 3; // horario BR

                if (current_hour > 4 && current_hour < 12) {
                    saudacao = "Bom dia";
                } else if (current_hour >= 12 && current_hour < 18) {
                    saudacao = "Boa tarde";
                } else if (current_hour >= 18 && current_hour <= 23) {
                    saudacao = "Boa noite";
                } else {
                    saudacao = "Olá";
                }
                
                
                msg.payload = {
                    "countFace" : countFace, 
                    "hasChildren" : hasChildren, 
                    "hasAged" : hasAged,
                    "text": saudacao
                };
                
                console.log(msg.payload);

                client.publish(topicGeneric, JSON.stringify(msg.payload));

            }, function (error) {
                console.log("error classify");
                console.log(error);
            });
        // }, 30000);
    }
// });