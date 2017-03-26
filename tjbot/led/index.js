var tjbot = require('tjbot');
// var config = require('./config'); // user configuration file
 
// obtain credentials from config.js, see config.default.js for more info.
// var credentials = config.credentials;
var credentials = {
    
};
 
// these are the hardware capabilities that our TJ needs for this example
// var hardware = ['led', 'microphone', 'speaker', 'camera', 'see'];
// var hardware = ['led', 'microphone', 'speaker'];
var hardware = ['led'];

var config = {
    verboseLogging: true,  // enable console debugging
    // 'attentionWord': 'TJ', // attention word for STT
    // 'ledPin': 8,    
    // 'servoPin': 7,
    // 'voice': 'en-US_MichaelVoice',
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
 
// instantiate the TJBot library!
var tj = new tjbot(hardware, config, credentials);
 
// Change LED color to red.
tj.shine("yellow");

console.log("CALLED shine.yellow");

// tj.see('classify');


// console.log("SEE CALLED");

tj.pulse("yellow", 20, 1);

console.log("CALLED pulse.yellow");