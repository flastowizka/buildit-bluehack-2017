var path =  require('path');

var printer = require("node-thermal-printer");

var fs = require("fs");

/*
var barcode = require('barcode');
var code39 = barcode('ean13', {
    data: "123456789012",
    width: 400,
    height: 100,
});
*/
//var outfile = path.join('assets', 'imgs', 'mycode.png')
/*
var outfile = path.join('./assets', 'mycode.png');
code39.saveImage(outfile, function (err) {
    if (err) throw err;

    console.log('File has been written!');
});
*/


printer.init({
  type: 'epson',
  characterSet: 'LATINA',
  removeSpecialCharacters: false,
  replaceSpecialCharacters: true,
  interface: '/dev/usb/lp0' //ESDPRT001 - /dev/usb/lp0
});

printer.isPrinterConnected(function(exists){
  console.log("Printer connected? " + exists);
});

printer.alignCenter();
printer.raw(new Buffer("Raw: Hello world"), function(err){ console.log("Msg print raw: " + err) } );
printer.println("Hello world");
printer.partialCut();

printer.execute(function(err){
  if (err) {
    console.error("Print failed", err);
  } else {
    console.log("Print done");
  }
});

var bwipjs = require('bwip-js');

bwipjs.toBuffer({
        bcid:        'ean13',       // Barcode type
        text:        '2343212234510',    // Text to encode
        scale:       3,               // 3x scaling factor
        height:      15,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
//        textfont:    'Inconsolata',   // Use your custom font
        textsize:    10               // Font size, in points
    }, function (err, png) {
        if (err) {
            console.error("Write imagem barcode failed : ", err);
        } else {
            // `png` is a Buffer
            // png.length           : PNG file length
            // png.readUInt32BE(16) : PNG image width
            // png.readUInt32BE(20) : PNG image height

           fs.writeFile("./assets/mycode.png", png, function(err) {
              if(err) console.log(err);

              console.log("The file was saved!");

              printer.printImage('assets/mycode.png', function(done){
              printer.partialCut();

              printer.execute(function(err){
                if (err) {
                  console.error("Print failed", err);
                } else {
                  console.log("Print done");
                }
            });

            });


            });

  }
    });



//printer.beep();
//printer.partialCut();
//printer.alignCenter();
//printer.println("Hello world");
//printer.partialCut();
/*
printer.printImage('assets/mycode.png', function(done){

printer.partialCut();

  printer.execute(function(err){
    if (err) {
      console.error("Print failed", err);
    } else {
      console.log("Print done");
    }
  });
});
*/
//printer.cut();
//printer.partialCut();
