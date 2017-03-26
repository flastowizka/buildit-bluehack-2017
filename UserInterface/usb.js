var usbDetect = require('usb-detection');
var fs = require('fs');
var usb = require('usb')

console.log(usb.getDeviceList());

fs.writeFile('D:/\hello/\helloworld.txt', 'Hello World!', function (err) {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
});

// Detect add/insert
usbDetect.on('add', function(device) {
  console.log('add', device, "\r\n************************");
  var dev = usb.findByIds(device.vendorId, device.productId);
  if( dev ){
    console.log(dev);
    dev.open();
    dev.interfaces;
  }

});
usbDetect.on('add:vid', function(device) { console.log('add', device, "\r\n***********************"); });
usbDetect.on('add:vid:pid', function(device) { console.log('add', device, "\r\n************************"); });

// Detect remove
usbDetect.on('remove', function(device) { console.log('remove', device, "\r\n************************"); });
usbDetect.on('remove:vid', function(device) { console.log('remove', device, "\r\n************************"); });
usbDetect.on('remove:vid:pid', function(device) { console.log('remove', device, "\r\n************************"); });

// Detect add or remove (change)
usbDetect.on('change', function(device) { console.log('change', device, "\r\n************************"); });
usbDetect.on('change:vid', function(device) { console.log('change', device, "\r\n************************"); });
usbDetect.on('change:vid:pid', function(device) { console.log('change', device, "\r\n************************"); });

// Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
usbDetect.find(function(err, devices) { console.log('find', devices, err, "\r\n************************"); });
//usbDetect.find(vid, function(err, devices) { console.log('find', devices, err); });
//usbDetect.find(vid, pid, function(err, devices) { console.log('find', devices, err); });

// Promise version of `find`:
usbDetect.find().then(function(devices) { console.log(devices, "\r\n************************"); }).catch(function(err) { console.log(err); });
