var path =  require('path');
var fs = require("fs");

var printer = require("node-thermal-printer");
var bwipjs = require('bwip-js');
var dateFormat = require('dateformat');

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

function PrinterEPSON() {
  printer.init({
    type: 'epson',
    characterSet: 'LATINA',
    removeSpecialCharacters: false,
    replaceSpecialCharacters: true,
    interface: '/dev/usb/lp0' //ESDPRT001 - /dev/usb/lp0
  });

  printer.isPrinterConnected(function(exists){
    console.log("Printer connected? " + exists);

    if( exists ){
      printer.alignCenter();
      printer.println("Impressora pronta!");
      printer.partialCut();

      printer.execute(function(err){
        if (err) {
          console.error("Print failed", err);
        } else {
          console.log("Print done : isPrinterConnected");
        }
      });
    }

  });
}

PrinterEPSON.prototype.printCupom = function(rede, loja, id, qtdeGarrafa, barcode, bartype){
  var agora = new Date();

  printer.alignCenter();

  // printer.printImage('assets/ambev-black-400.png', function(done){
  //  console.log("done: " + done);
  //  printer.newLine();

    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.setTextDoubleWidth();
    printer.println(rede);
    printer.println(loja);
    printer.bold(false);
    printer.setTextNormal();

    printer.newLine();
    printer.println("DEVOLUÇÃO DE VASILHAMES");
    printer.newLine();

    printer.alignLeft();

    printer.drawLine();
    // printer.newLine();
    printer.leftRight(dateFormat(agora, 'dd/mm/yyyy'), dateFormat(agora, 'HH:MM:ss'));
    // printer.newLine();
    printer.drawLine();

    printer.newLine();
    printer.alignCenter();
    printer.println(qtdeGarrafa + " x Cerveja GFA 300ML");
    printer.newLine();

    printer.alignCenter();
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.setTextDoubleWidth();
    printer.invert(true);
    printer.println("          " + qtdeGarrafa + " ");
    printer.invert(false);
    printer.bold(false);
    printer.setTextNormal();

    bwipjs.toBuffer({
            bcid:        bartype,       // Barcode type
            text:        barcode,    // Text to encode
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

               fs.writeFile("assets/mycode.png", png, function(err) {

                  if(err) console.log(err);

                  console.log("The file was saved!");

                  printer.alignCenter();
                  printer.printImage('assets/mycode.png', function(done){

                    if(done) console.log(done);

                    printer.newLine();
                    printer.drawLine();
                    // printer.newLine();

                    printer.leftRight("Recibo", id);
                    // printer.newLine();
                    printer.drawLine();

                    printer.bold(true);
                    printer.setTextDoubleHeight();
                    printer.setTextDoubleWidth();
                    printer.print("VALIDO SOMENTE HOJE");
                    printer.bold(false);
                    printer.setTextNormal();
                    printer.partialCut();

                    printer.execute(function(err){
                      if (err) {
                        console.log("Print failed: ", err);
                      } else {
                        console.log("Print done : writeFile");
                      }
                    });
                  });
                });

            }
          });

  // });

}

module.exports = PrinterEPSON;

/*
Teste unitario da API

var printerAPI = new PrinterEPSON();

printerAPI.printCupom("Garrafas Aprovadas!", '2343212234510');
*/
