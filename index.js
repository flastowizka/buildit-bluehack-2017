var mqtt = require('mqtt');

// var topicGeneric = 'BuildIT_BlueHack_Input';
var topicGeneric = 'BuildIT_BlueHack_Output';
// var clientIdTJ = 'MQTT_BuildIT_BlueHack_TJ_2017';
var brokerURL = 'mqtt://iot.eclipse.org';

var client  = mqtt.connect(brokerURL, {
  // clientId : clientIdTJ
});

client.on('connect', function () {
  client.subscribe(topicGeneric);
  console.log('connected subscribe');

  client.publish(topicGeneric, 'Hello mqtt: ' + new Date().getTime());
  console.log('connected publish');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic + ' / ' + message.toString());

  var json = JSON.parse(message.toString());

  if (json.page == "recomendacao") {

  }

  // client.end()
})
