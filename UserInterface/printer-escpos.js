const escpos = require('escpos');

const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const printer = new escpos.Printer(device);

device.open(function(){

  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .barcode('12345678', 'EAN8')
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });

});