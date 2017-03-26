var serverLocal;

function ScreenFlow(server) {
  // validar server
  if( !server ){
    console.error('Servidor nao encontrado.');
  }else{
    serverLocal = server;
	console.log('Servidor definido: ' + serverLocal);
  }
}

ScreenFlow.prototype.sugestCafeManha = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/CafeManha.jpg'
	});
	
	//chamada de retorno
     if( callback != null ){
     callback();
   }
}

ScreenFlow.prototype.sugestParmegiana = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Parmegiana.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.sugestSorvete = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Sorvete.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.sugestAcai = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Acai.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.sugestPizza = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Pizza.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.sugestVinho = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Vinho.jpg'
	});
	  if( callback != null ){
      callback();
   }
}

ScreenFlow.prototype.cardapio = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Cardapio2.jpg'
	});
	  if( callback != null ){
      callback();
   }
}

ScreenFlow.prototype.jukebox = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/jukebox.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.camera = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/camera.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.Despedida = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/Despedida.jpg'
	});
	  if( callback != null ){
      callback();
   }
}
ScreenFlow.prototype.Pagamento = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/pagamento.jpg'
	});
	  if( callback != null ){
      callback();
   }
}

ScreenFlow.prototype.Parceiros = function(callback){
	// console.log('Servidor definido (testeSugest): ' + serverLocal);
console.log("entrou");
  serverLocal.wsSendMsg({
      'flutuante1': '',
      'flutuante2': '',
      'flutuante3': '',
	  'imgFundo':'/assets/telas/parceiros.jpg'
	});
	  if( callback != null ){
      callback();
   }
}


// ScreenFlow.prototype.papelImpressora = function(callback){
  // // TELA: VERIFICAR NIVEL DE PAPEL
  // serverLocal.wsSendMsg({
      // 'flutuante1': '',
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'imgFundo': '/assets/telas/tela-11.png'
    // });

  // var id2 = setInterval(function () {
      // clearInterval(id2);

      // // chamada de retorno
      // if( callback != null ){
        // callback();
      // }

    // }, 10000);

    // return id2;
// }

// ScreenFlow.prototype.impressao = function(contador_garrafas, callback){
  // // TELA: CONTROLE PARA IMPRESSAO
  // var countInterval = 10;
  // var countMsgFinal = 3;

  // serverLocal.wsSendMsg({
      // 'flutuante1': countInterval--,
      // 'flutuante2': '',
      // 'flutuante3': contador_garrafas,
      // 'imgFundo': '/assets/telas/tela-7-clean.png'
    // });

  // // TELA: CONTROLE PARA IMPRESSAO
  // intervalImpressao = setInterval(function () {
      // serverLocal.wsSendMsg({
          // 'flutuante1': countInterval--,
          // 'flutuante2': '',
          // 'flutuante3': contador_garrafas,
          // 'imgFundo': '/assets/telas/tela-7-clean.png'
        // });
      // if( countInterval == 0 ){
        // clearInterval(intervalImpressao);
        // serverLocal.wsSendMsg({
            // 'flutuante1': '',
            // 'flutuante2': '',
            // 'flutuante3': '',
            // 'imgFundo': '/assets/telas/tela-8.png'
          // });

        // // conta intervalo para mensagem final de impressao
        // var intervalImpressao2 = setInterval(function () {
          // clearInterval(intervalImpressao2);
          // // chamada de retorno
          // if( callback != null ){
            // callback();
          // }
        // }, countMsgFinal * 1000 );

      // }
  // }, 1000);

  // return intervalImpressao;
// }

// ScreenFlow.prototype.compartimentoCheio = function(callback){
  // // TELA: AVISO DE RECIPIENTE LOTADO
  // serverLocal.wsSendMsg({
      // 'flutuante1': '',
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'imgFundo': '/assets/telas/tela-11.png'
    // });

  // // chamada de retorno
  // if( callback != null ){
    // callback();
  // }
// }

// ScreenFlow.prototype.inicio = function(qtdeGarrafa, bandeja, callback){
  // // TELA: AVISO DE RECIPIENTE DISPONIVEL
  // var intervalInicioGarrafa = null;
  // var img_bandeja_inicio = '';
  // var img_bandeja_iniciado = '';

  // // identificar qual bandeja esta sendo utilizada
  // if( bandeja == 'D' ){
    // img_bandeja_inicio = 'inicio-d.png';
    // img_bandeja_iniciado = 'tela-1a-com-timer-clean-d.png';
  // }else{
    // img_bandeja_inicio = 'inicio-e.png';
    // img_bandeja_iniciado = 'tela-1a-com-timer-clean-e.png';
  // }

  // if( qtdeGarrafa > 0 ){
    // // TELA: APROVADA. PROXIMA GARRAFA
    // var countInterval = 30;

    // serverLocal.wsSendMsg({
        // 'flutuante1': countInterval--,
        // 'flutuante2': qtdeGarrafa,
        // 'flutuante3': '',
        // 'imgFundo': '/assets/telas/' + img_bandeja_iniciado
      // });

      // intervalInicioGarrafa = setInterval(function () {
        // serverLocal.wsSendMsg({
            // 'flutuante1': countInterval--,
            // 'flutuante2': qtdeGarrafa,
            // 'flutuante3': '',
            // 'imgFundo': '/assets/telas/' + img_bandeja_iniciado
          // });

        // if( countInterval == 0 ){
          // clearInterval(intervalInicioGarrafa);

          // // chamada de retorno
          // if( callback != null ){
            // callback();
          // }
        // }
      // }, 1000);
  // }else{
    // serverLocal.wsSendMsg({
        // 'flutuante1': '',
        // 'flutuante2': '',
        // 'flutuante3': '',
        // 'imgFundo': '/assets/telas/' + img_bandeja_inicio
      // });
  // }

  // return intervalInicioGarrafa;
// }

// ScreenFlow.prototype.maximoGarrafa = function(qtdeGarrafa, callback){
  // // TELA: MAX GARRAFA. RETIRAR GARRAFA
  // serverLocal.wsSendMsg({
      // 'flutuante1': '',
      // 'flutuante2': qtdeGarrafa,
      // 'flutuante3': '',
      // 'flutuante4': qtdeGarrafa,
      // 'imgFundo': '/assets/telas/tela-5-clean.png'
    // });

  // var id2 = setInterval(function () {
      // clearInterval(id2);

      // // chamada de retorno
      // if( callback != null ){
        // callback();
      // }
    // }, 3000);

// }

// ScreenFlow.prototype.aprovadaGarrafa = function(qtdeGarrafa, callback){
  // // TELA: APROVADA. PROXIMA GARRAFA
  // var countInterval = 10;
  // // primeira resposta rapida
  // serverLocal.wsSendMsg({
      // 'flutuante1': countInterval--,
      // 'flutuante2': qtdeGarrafa,
      // 'flutuante3': '',
      // 'imgFundo': '/assets/telas/tela-3-com-timer-clean.png'
    // });

  // intervalNovaGarrafa = setInterval(function () {
    // serverLocal.wsSendMsg({
        // 'flutuante1': countInterval--,
        // 'flutuante2': qtdeGarrafa,
        // 'flutuante3': '',
        // 'imgFundo': '/assets/telas/tela-3-com-timer-clean.png'
      // });

    // if( countInterval == 0 ){
      // clearInterval(intervalNovaGarrafa);

      // // chamada de retorno
      // if( callback != null ){
        // callback();
      // }
    // }
  // }, 1000);

  // return intervalNovaGarrafa;
// }

// ScreenFlow.prototype.recusadaGarrafa = function(callback){
  // // TELA: CONTROLE PARA RECUSA DE GARRAFA
  // var countInterval = 60;
  // serverLocal.wsSendMsg({
      // 'flutuante1': countInterval--,
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'imgFundo': '/assets/telas/tela-6-com-timer-clean.png'
    // });

  // intervalRecusaGarrafa = setInterval(function () {
    // serverLocal.wsSendMsg({
        // 'flutuante1': countInterval--,
        // 'flutuante2': '',
        // 'flutuante3': '',
        // 'imgFundo': '/assets/telas/tela-6-com-timer-clean.png'
      // });

    // if( countInterval < 0 ){
      // clearInterval(intervalRecusaGarrafa);

      // // chamada de retorno
      // if( callback != null ){
        // callback();
      // }
    // }
  // }, 1000);

  // return intervalRecusaGarrafa;
// }

// ScreenFlow.prototype.carregandoGarrafa = function(callback){
  // // TELA: CARREGANDO GARRAFA
  // var countInterval = 1;
  // intervalLoading = setInterval(function () {

    // serverLocal.wsSendMsg({
        // 'flutuante1': '',
        // 'flutuante2': '',
        // 'flutuante3': '',
        // 'imgFundo': '/assets/telas/tela-2-'+countInterval+++'.png'
      // });

    // if( countInterval > 7 )
      // countInterval = 1;

  // }, 1000);

  // return intervalLoading;
// }

// ScreenFlow.prototype.expirou = function(callback){
  // // TELA: EXPIROU TEMPO LIMITE
  // serverLocal.wsSendMsg({
      // 'flutuante1': '',
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'flutuante4': '',
      // 'imgFundo': '/assets/telas/tela-9.png'
    // });

  // intervalExpirado = setInterval(function () {
      // clearInterval(intervalExpirado);

      // // chamada de retorno
      // if( callback != null ){
        // callback();
      // }
    // }, 3000);

  // return intervalExpirado;
// }

// ScreenFlow.prototype.manutencao = function(codigo, callback){
  // // TELA: AVISO DE RECIPIENTE LOTADO
  // serverLocal.wsSendMsg({
      // 'flutuante1': codigo,
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'imgFundo': '/assets/telas/tela-11.png'
    // });

  // // chamada de retorno
  // if( callback != null ){
    // callback();
  // }
// }

// ScreenFlow.prototype.manutInicial = function(callback){
  // // TELA: CONTROLE MANUTENCAO
  // var countInterval = 3;
  // serverLocal.wsSendMsg({
      // 'flutuante1': countInterval--,
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'imgFundo': '/assets/telas/manutencao_1.png'
    // });

  // var intervalManutencao = setInterval(function () {
    // serverLocal.wsSendMsg({
        // 'flutuante1': countInterval--,
        // 'flutuante2': '',
        // 'flutuante3': '',
        // 'imgFundo': '/assets/telas/manutencao_1.png'
      // });

    // if( countInterval < 0 ){
      // clearInterval(intervalManutencao);

      // serverLocal.wsSendMsg({
          // 'flutuante1': '',
          // 'flutuante2': '',
          // 'flutuante3': '',
          // 'imgFundo': '/assets/telas/manutencao_2.png'
        // });

      // // chamada de retorno
      // if( callback != null ){
        // callback();
      // }
    // }
  // }, 1000);

  // return intervalManutencao;
// }

// ScreenFlow.prototype.manutPrincipal = function(callback){
  // // TELA: CONTROLE MANUTENCAO
  // serverLocal.wsSendMsg({
      // 'flutuante1': '',
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'flutuante4': '',
      // 'flutuante5': '',
      // 'imgFundo': '/assets/telas/manutencao_2.png'
    // });

    // // chamada de retorno
    // if( callback != null ){
      // callback();
    // }
// }

// ScreenFlow.prototype.manutMsg = function(msg, callback){
  // // TELA: CONTROLE MANUTENCAO
  // serverLocal.wsSendMsg({
      // 'flutuante1': '',
      // 'flutuante2': '',
      // 'flutuante3': '',
      // 'flutuante4': '',
      // 'flutuante5': msg,
      // 'imgFundo': '/assets/telas/tela-branca.png'
    // });

    // // chamada de retorno
    // if( callback != null ){
      // callback();
    // }
// }

module.exports = ScreenFlow;
