var Q = require('q');
var nconf = require('nconf');
// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: './config/config.json' });

var follow = require('follow');
var nano = require('nano')(nconf.get('db:host'));
var HttpServerLib = require('./httpServerAPI.js');
var PrinterLib = require('./printerAPI.js');
var ScreenFlowLib = require('./screenFlowAPI.js');
var jsonNewBusiness = require('./config/business.json');

var db_business = nano.db.use(nconf.get('db:db_business'));
var db_key_business = nconf.get('db:key_business');
var db_operation = nano.db.use(nconf.get('db:db_operation'));

var server = new HttpServerLib(function(){inicializaTela();});
var printer = new PrinterLib();
var screenFlow = new ScreenFlowLib(server);

// configuracao aplicacao
var max_garrafas = nconf.get('app:max_garrafas');
var max_impressao = nconf.get('app:max_impressao');
// var max_baia = nconf.get('app:max_baia');
var inicio_baia = nconf.get('app:inicio_baia');

// configuracao devices
var pin_botao = nconf.get('pin:pin_botao');
var pin_sinalizador = nconf.get('pin:pin_sinalizador');
var pin_porta_d = nconf.get('pin:pin_porta_d');
var pin_garrafa_d = nconf.get('pin:pin_garrafa_d');
var pin_porta_e = nconf.get('pin:pin_porta_e');
var pin_garrafa_e = nconf.get('pin:pin_garrafa_e');
var pin_manutencao = nconf.get('pin:pin_manutencao');
var pin_gaveta = nconf.get('pin_gaveta');
var pin_impressora = nconf.get('pin_impressora');
var pin_limpeza = nconf.get('pin_limpeza');
var tempo_pin_garrafa = nconf.get('pin:tempo_pin_garrafa');

// configuracao cupom
var cupom_rede = nconf.get('cupom:rede');
var cupom_pdv = nconf.get('cupom:pdv');
var cupom_id = nconf.get('cupom:idMaquina');
var cupom_codBarraNum = nconf.get('cupom:codBarraNum');
var cupom_codBarraTip = nconf.get('cupom:codBarraTip');

// verifca DB
checkDB(db_business.config.db);
checkDB(db_operation.config.db);

// buscar dados de inicializacao no DB
var db_obj_business;

/*
// versao 2.0 couchdb
var query = {
              "selector": {"type": "data"},
              "sort": [{"timeStamp": "desc"}]
            };
nano.request({ db : db_business.config.db
              ,method : "POST"
              ,doc : "_find"
              ,content_type : "json"
              ,body : query
*/

nano.request({ db : db_business.config.db
              ,method : "GET"
              ,doc : db_key_business
              ,content_type : "json"
}, function(err,data){
  if( !err && ( ( data.docs && data.docs.length > 0 ) || data._id ) ) {
    // manter sempre o ultimo objeto ativo
    if( data.docs ){ // caso exista mais de um documento
      db_obj_business = data.docs[0];
    }else{
      db_obj_business = data;
    }
  }else{
    // caso dados nao existam, criar estrutura inicial
    db_obj_business = jsonNewBusiness;
    db_obj_business.timestamp = getTimeStamp();

    insertBusiness(db_obj_business, db_key_business);

    // versao 2.0 couchdb
    // createIndexBusiness();
  }

  // CONTROLE DE BAIA, primeira checagem
  controleBaia();
});

// contadores
// db_obj_business.bottleCount.data
// db_obj_business.printerPaper.data
// db_obj_business.bottleTray.data

// intervalos de tela
var intervalNovaGarrafa = null;
var intervalImpressao = null;
var intervalRecusaGarrafa = null;
var intervalRecusaGarrafaInicio = null;
var intervalLoading = null;
var intervalInicioGarrafa = null;
var intervalVerificandoGarrafa = null;
var intervalExpirado = null;

var controleBusiness = false;
var controleBaiaCheiaE = false;
var controleBaiaCheiaD = false;
var controleBloqueioProcesso = false;
var controleBloqueioBotao = false;
var controleBloqueioManutencao = false;

var controleManutencaoPorta = false;
var controleManutencaoPin = null;

var db_operation_addr = db_operation.config.url + db_operation.config.db;

follow({db:db_operation_addr, include_docs:true, since: "now"}, function(error, change) {
  if(!error) {

    console.log("Change of " + change.doc.type + " has status " + change.doc.status + " on revision " + change.doc._rev);

    // reinicializa controle para atualizacao dao banco de business
    controleBusiness = false;

    // CONTROLE MANUTENCAO
    if( change.doc.type == 'command' && change.doc.pin == '0' && ( change.doc.count == 5 || controleBloqueioManutencao ) ){

      // CONTROLE DE MANUTENCAO
      if( controleManutencaoPorta ){
        // CONTROLE DE PORTAS DE MANUTENCAO
        switch(change.doc.count) {
          case 1:
            // travar porta
            acionarSolenoide(true, pin_gaveta);
            controleManutencaoPorta = false;
            controleManutencaoPin = null;

            // zerar contagem de impressao
            if( controleManutencaoPin == pin_impressora ){
              // ZERAR CONTADOR
              db_obj_business.printerPaper.data = 0;
              controleBusiness = true; // flag para atualizacao
            }

            // tela de manutencao
            screenFlow.manutPrincipal();
            break;
          case 2:
            // travar porta
            acionarSolenoide(true, pin_gaveta);
            controleManutencaoPorta = false;
            controleManutencaoPin = null;

            // tela de manutencao
            screenFlow.manutPrincipal();
            break;
        }

      }else{
        // CONTROLE COMANDOS DE MANUTENCAO
        switch(change.doc.count) {
          // TELA MANUTENCAO INICAL
          case 5:
            // bloqueio de manutencao
            controleBloqueioManutencao = true;

            controleBloqueioProcesso = false; // liberar processo

            // RELE: APAGA SINALIZADOR
            acionarSinalizador(false);

            // tela de manutencao
            screenFlow.manutInicial();
            break;
          // ABRIR GAVETA
          case 1:
            // abrir porta
            acionarSolenoide(true, pin_gaveta);
            controleManutencaoPorta = true;
            controleManutencaoPin = pin_gaveta;

            // tela de mensagem manutencao
            screenFlow.manutMsg('GAVETA ABERTA <br/> PARA FECHAR, PRESSIONE 1 VEZ');
            break;
          // ABRIR IMPRESSORA
          case 2:
            // abrir porta
            acionarSolenoide(true, pin_impressora);
            controleManutencaoPorta = true;
            controleManutencaoPin = pin_impressora;

            // tela de mensagem manutencao
            screenFlow.manutMsg('IMPRESSORA ABERTA <br/> PARA FECHAR E CONFIRMAR A TROCA DO PAPEL, PRESSIONE 1 VEZ <br/> PARA FECHAR E CONFIRMAR QUE NÃO HOUVE TROCA DO PAPEL, PRESSIONE 2 VEZES');
            break;
          // ABRIR LIMPEZA
          case 3:
            // abrir porta
            acionarSolenoide(true, pin_limpeza);
            controleManutencaoPorta = true;
            controleManutencaoPin = pin_limpeza;

            // tela de mensagem manutencao
            screenFlow.manutMsg('PORTA DE LIMPEZA ABERTA <br/> PARA FECHAR, PRESSIONE 1 VEZ');
            break;
          // ABRIR MANUTENCAO
          case 4:
            // abrir porta
            acionarSolenoide(true, pin_manutencao);
            controleManutencaoPorta = true;
            controleManutencaoPin = pin_manutencao;

            // tela de mensagem manutencao
            screenFlow.manutMsg('PORTA DE MANUTENÇÃO ABERTA <br/> PARA FECHAR, PRESSIONE 1 VEZ');
            break;
          // EXTRAIR RELATORIO
          case 6:
            // verficar se pen drive esta inserido
            // extrair relatorio

            break;
          // SAIDA TELA MANUTENCAO
          case 7:
            // liberacao de manutencao
            controleBloqueioManutencao = false;

            // travar portas
            acionarSolenoide(false, pin_manutencao);
            acionarSolenoide(false, pin_gaveta);
            acionarSolenoide(false, pin_impressora);
            acionarSolenoide(false, pin_limpeza);

            inicializaTela();

            break;
        }
      }

    }

    // CONTROLE DE OPERACAO
    if( ( change.doc.type == 'start'
       || ( change.doc.type == 'input' && change.doc.status.toString() == 'true' && change.doc.pin == '0' && !controleBloqueioBotao )
       || change.doc.type == 'camera'
       || change.doc.type == 'presence'
       || change.doc.type == 'bottlepass'
       || change.doc.type == 'bottlestuck' )
       && !controleBloqueioProcesso
       && !controleBloqueioManutencao ){

      // limpa Interval anteriores, caso existam
      clearInterval(intervalNovaGarrafa);
      clearInterval(intervalImpressao);
      clearInterval(intervalRecusaGarrafa);
      clearInterval(intervalRecusaGarrafaInicio);
      clearInterval(intervalLoading);
      clearInterval(intervalInicioGarrafa);
      clearInterval(intervalVerificandoGarrafa);
      clearInterval(intervalExpirado);

      // CONTROLE EVENTO
      switch(change.doc.type) {
        // MSG: START
        case 'start':
          if( change.doc.status.toString() == 'true' ){
            intervalInicioGarrafa = screenFlow.inicio(db_obj_business.bottleCount.data, db_obj_business.bottleTray.data, function(){
              // EXPIROU: FINALIZAR O PROCESSO
              expirouProcesso();
            });
          }
          break;

        // MSG: INPUT
        case 'input':
          // MSG: BOTAO
          if(change.doc.pin == '0'){
            if( change.doc.status.toString() == 'true' && db_obj_business.bottleCount.data > 0 ){
              // IMPRIMIR
              console.log( "IMPRIMIR" );

              // ATUALIZAR CONTADOR
              ++db_obj_business.printerPaper.data;
              controleBusiness = true; // flag para atualizacao

              // VALIDACAO: FIM DE PAPAEL PARA IMPRESSAO
              if( db_obj_business.printerPaper.data > max_impressao ){

                // RELE: ACIONAR SINALIZADOR
                acionarSinalizador(true);

                // TELA: VERIFICAR NIVEL DE PAPEL
                screenFlow.manutencao(4);

                controleBloqueioProcesso = true; // bloquear processo indefinido

              // IMPRESSAO
              }else{
                // registra novo cupom
                db_obj_business.cupomCount.data ++;
                controleBusiness = true; // flag para atualizacao

                controleBloqueioProcesso = true; // bloquear processo

                // IMPRESSORA: ENVIANDO DADOS
                printer.printCupom(cupom_rede, cupom_pdv, db_obj_business.cupomCount.data, db_obj_business.bottleCount.data, cupom_codBarraNum, cupom_codBarraTip);

                // TELA: IMPRESSAO
                intervalImpressao = screenFlow.impressao(db_obj_business.bottleCount.data, function(){
                  // FINALIZAR PROCESSO
                  finalizarProcesso();
                });
              }

            }
          // MSG: SENSOR INFRA VERMELHO
          /*
          }else if(change.doc.pin == '1'){
            if( change.doc.status.toString() == 'true' ){
              // TELA: AVISO DE RECIPIENTE LOTADO
              // screenFlow.compartimentoCheio();
            }else{
              // TELA: AVISO DE RECIPIENTE DISPONIVEL
              intervalInicioGarrafa = screenFlow.inicio(db_obj_business.bottleCount.data, db_obj_business.bottleTray.data, function(){
                // EXPIROU: FINALIZAR O PROCESSO
                expirouProcesso();
              });
            }
            */
          }
          break;

        // MSG: CAMERA
        case 'camera':
          if( change.doc.status.toString() == 'true' ){
            // GARRAFA APROVADA.
            console.log( "GARRAFA APROVADA" );

            // OK. NOVA GARRAFA
            console.log( "OK. NOVA GARRAFA ("+db_obj_business.bottleCount.data+")" );

            var funcaoCallBack = function(){
              intervalVerificandoGarrafa = setInterval(function () {
                  clearInterval(intervalVerificandoGarrafa);

                  screenFlow.manutencao(6);

                  controleBloqueioProcesso = true; // bloquear processo

                }, 60 * 1000);
            };

            // liberacao da garrafa
            // solenoide acionado = garrafa liberada
            if(db_obj_business.bottleTray.data == 'D'){
              acionarSolenoideMomentaneo(true, pin_garrafa_d, tempo_pin_garrafa, funcaoCallBack);
            }else{
              acionarSolenoideMomentaneo(true, pin_garrafa_e, tempo_pin_garrafa, funcaoCallBack);
            }

            controlePorta( true ); // travamento da porta

          } else {
            // GARRAFA RECUSADA. RETIRAR GARRAFA
            console.log( "GARRAFA RECUSADA. RETIRAR GARRAFA" );

            var funcaoCallBack = function(){
              screenFlow.manutencao(6);

              controleBloqueioProcesso = true; // bloquear processo
            };

            controleBloqueioBotao = true; // bloquear botao

            intervalRecusaGarrafa = screenFlow.recusadaGarrafa( funcaoCallBack );
          }
          break;

        // MSG: PRESENCA
        case 'presence':
          if( change.doc.status.toString() == 'true' ){
            // TELA: CARREGANDO GARRAFA
            intervalLoading = screenFlow.carregandoGarrafa();

            controleBloqueioBotao = true; // bloquear botao

          }else{
            // TELA: AVISO DE RECIPIENTE DISPONIVEL
            intervalInicioGarrafa = screenFlow.inicio(db_obj_business.bottleCount.data, db_obj_business.bottleTray.data, function(){
              // EXPIROU: FINALIZAR O PROCESSO
              expirouProcesso();
            });

            controleBloqueioBotao = false; // liberar botao
          }
          break;

        // MSG: GARRAFA PASSOU ESTEIRA
        case 'bottlepass':
          if( change.doc.status.toString() == 'true' ){
            // contabilizar nova garrafa quando passar pelo sensor
            db_obj_business.bottleCount.data ++;
            controleBusiness = true; // flag para atualizacao

            controlePorta( false ); // liberacao da porta

            if( max_garrafas <= db_obj_business.bottleCount.data ){
              // MAX GARRAFA. RETIRAR GARRAFA
              console.log( "MAX GARRAFA. RETIRAR GARRAFA" );

              screenFlow.maximoGarrafa(db_obj_business.bottleCount.data, function(){
                // BOTAO: SIMULAR ACIONAMENTO DO BOTAO PARA FINALIZAR O PROCESSO
                acionarBotao(true);
              });

            }else{

              intervalNovaGarrafa = screenFlow.aprovadaGarrafa(db_obj_business.bottleCount.data,  function(){
                intervalInicioGarrafa = screenFlow.inicio(db_obj_business.bottleCount.data, db_obj_business.bottleTray.data, function(){
                  // EXPIROU: FINALIZAR O PROCESSO
                  expirouProcesso();
                });
              });

            }
          }
          break;

        // MSG: GARRAFA BLOQUEOU ESTEIRA
        case 'bottlestuck':
          if( change.doc.status.toString() == 'true' ){
            // alterar baias
            // 0 = Direita
            // 1 = Esquerda
            if( change.doc.bayNumber == 0 ){
              controleBaiaCheiaD = true; // Baia direita cheia
            }else{
              controleBaiaCheiaE = true; // Baia esquerda cheia
            }

            // contabilizar nova garrafa quando passar pelo sensor
            db_obj_business.bottleCount.data ++;

            // fixar baia utlizada
            alterarBaia();

            if( controleBaiaCheiaD && controleBaiaCheiaE ){
              // BOTAO: SIMULAR ACIONAMENTO DO BOTAO PARA FINALIZAR O PROCESSO
              acionarBotao(true);
            }else{
              intervalInicioGarrafa = screenFlow.inicio(db_obj_business.bottleCount.data, db_obj_business.bottleTray.data, function(){
                // EXPIROU: FINALIZAR O PROCESSO
                expirouProcesso();
              });
            }

            controleBusiness = true; // flag para atualizacao
          }
          break;

      }

    }

    // DADOS DE BUSINESS: APLICAR NA BASE
    if( controleBusiness ){
      // CONTROLE DE BAIA
      controleBaia();
      // ATUALIZAR DB
      insertBusiness(db_obj_business, db_key_business);
    }

  }else{
    console.log("BIG Error: " + error);
  }

});

// COLECAO DE FUNCOES PRIVADAS
function insertOperation(dados){
  db_operation.insert(dados,function(err, body) {
    console.log(err);
    console.log(body);
  });
}

function insertBusiness(dados, key){
  db_business.insert(dados, key, function(err, body) {
    console.log('(************************************)');
    console.log("err : " + err);
    console.log(body);
    console.log('(************************************)');

    if( !err ){
      dados._rev = body.rev;
    }
  });
}

function checkDB(dbName){

  nano.request({ db : dbName
                ,method : "GET"
                ,doc : "_all_docs"
                ,content_type : "json"
  }, function(err,data){

    console.log('checking database ' + dbName);
    console.log('checking database err: ' + err);
    console.log('checking database data: ' + data);

    if( err && err.error == 'not_found' ) {
      nano.db.create(dbName, function(err, body) {
        if (!err) {
          console.log('database ' +dbName+ ' created!');
        }else{
          console.log('database ' +dbName+ ' NOT created! err: ' + err);
        }
      });
    }else{
      console.log('database ' +dbName+ ' checked!');
    }

  });
}

function createIndexBusiness(){
  var timeStampIndex =  {
                          "index": {
                            "fields": [{"timeStamp": "desc"}]
                          },
                          "name" : "timeStamp-index"
                        };
  nano.request({ db : db_business.config.db
                ,method : "POST"
                ,doc : "_index"
                ,content_type : "json"
                ,body : timeStampIndex
  }, function(err,data){
    console.log(err);
    console.log(data);
  });
}

function inicializaTela(){
  insertOperation({ "type": 'start',
                    "status": true,
                    "timestamp" : getTimeStamp(),
                    "pin": 0
                  });
}

function acionarSinalizador(sinal){
  insertOperation({ "type": 'setoutput',
                    "status": sinal,
                    "timestamp" : getTimeStamp(),
                    "pin": pin_sinalizador
                  });
}

function acionarBotao(sinal){
  insertOperation({ "type": 'input',
                    "status": sinal,
                    "timestamp" : getTimeStamp(),
                    "pin": pin_botao
                  });
}

function acionarSolenoide(sinal, pino){
  insertOperation({ "type": 'setoutput',
                    "status": sinal,
                    "timestamp" : getTimeStamp(),
                    "pin": pino
                  });
}

function acionarSolenoideMomentaneo(sinal, pino, tempo, callback){
  insertOperation({ "type": 'setoutput',
                    "status": sinal,
                    "timestamp" : getTimeStamp(),
                    "pin": pino
                  });

  var interval = setInterval(function () {
    clearInterval(interval);
    // nega acionamento apos tempo determinado
    insertOperation({ "type": 'setoutput',
                      "status": !sinal,
                      "timestamp" : getTimeStamp(),
                      "pin": pino
                    });
    // chamada de retorno
    if( callback != null ){
      callback();
    }
  }, tempo * 1000);
}

function controleBaia(){
  // fixar baia utlizada
  alterarBaia();

  // acionar travamento da porta
  // solenoide acionado = porta travada
  if(db_obj_business.bottleTray.data == 'D'){
    console.log('controle de baia : travamento pin_porta_e = ' + pin_porta_e);
    acionarSolenoide(true, pin_porta_e);
    acionarSolenoide(false, pin_porta_d);
  }else{
    console.log('controle de baia : travamento pin_porta_d = ' + pin_porta_d);
    acionarSolenoide(true, pin_porta_d);
    acionarSolenoide(false, pin_porta_e);
  }
}

function alterarBaia(){
  // alterar baia
  if( ( !controleBaiaCheiaD && inicio_baia == 'D' ) || ( !controleBaiaCheiaD && controleBaiaCheiaE ) ){
    db_obj_business.bottleTray.data = 'D';
  }else if ( ( !controleBaiaCheiaE && inicio_baia == 'E' ) || ( !controleBaiaCheiaE && controleBaiaCheiaD ) ) {
    db_obj_business.bottleTray.data = 'E';
  }
}

function controlePorta( sinal ){
  // acionar travamento da porta
  // solenoide acionado = porta travada
  if(db_obj_business.bottleTray.data == 'D'){
    console.log('controle de baia : travamento pin_porta_e = ' + pin_porta_e);
    acionarSolenoide(sinal, pin_porta_d);
  }else{
    console.log('controle de baia : travamento pin_porta_d = ' + pin_porta_d);
    acionarSolenoide(sinal, pin_porta_e);
  }
}

function expirouProcesso(){
  intervalExpirado = screenFlow.expirou(function() {
    acionarBotao(true);
  });
}

function finalizarProcesso(){
  // zerar contador de garrafa
  db_obj_business.bottleCount.data = 0;

  // DADOS DE BUSINESS: APLICAR NA BASE
  insertBusiness(db_obj_business, db_key_business);

  if( controleBaiaCheiaD && controleBaiaCheiaE ){
    // marquina cheia
    screenFlow.manutencao(1);

    // RELE: ACIONAR SINALIZADOR
    acionarSinalizador(true);

    controleBloqueioProcesso = true; // bloquear processo indefinido
  }else{
    screenFlow.inicio(db_obj_business.bottleCount.data, db_obj_business.bottleTray.data);
    controleBloqueioProcesso = false; // liberar processo
  }
}

function getTimeStamp(){
  return ((new Date().getTime())/1000);
}
