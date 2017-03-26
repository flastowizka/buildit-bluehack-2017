var Q = require('q');
var nconf = require('nconf');
// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: './config/config.json' });

var nano = require('nano')(nconf.get('db:host'));
var db_business = nano.db.use(nconf.get('db:db_business'));

var db_key_business = nconf.get('db:key_business');
var jsonNewBusiness = require('./config/business.json');

var db_contador_garrafas;
var query = {
              "selector": {"type": "data"}
             ,"sort": [{"timeStamp": "desc"}]
            };

var obj;

nano.request({ db : "bottlebusiness"
              ,method : "POST"
              ,doc : "_find"
              ,content_type : "json"
              ,body : query
}, function(err,data){
  console.error(err);
  if( !err && data.docs.length > 0 ) {
    obj = data.docs[0];
    db_contador_garrafas = obj.bottleCount.data;

    obj.bottleCount.data = ++db_contador_garrafas;

    var promise_chain = Q.fcall(function(){});
    promise_chain.then(insertBusiness(obj, db_key_business)
      .then(function(result){
        obj._rev = result.rev;
      })
    );

    if( obj.bottleCount.data > 0 ){
      obj.bottleCount.data = -3;
      promise_chain.then(insertBusiness(obj, db_key_business)
        .then(function(result){
          obj._rev = result.rev;
        })
      );
    }

  }else{
    obj = jsonNewBusiness;
    obj.timeStamp = new Date().getTime().toString();
    insertBusiness(obj, db_key_business);

    var timeStampIndex =  {
                            "index": {
                              "fields": [{"timeStamp": "desc"}]
                            },
                            "name" : "timeStamp-index"
                          };
    nano.request({ db : "bottlebusiness"
                  ,method : "POST"
                  ,doc : "_index"
                  ,content_type : "json"
                  ,body : timeStampIndex
    }, function(err,data){
      console.log(err);
      console.log(data);
    });
  }
});

function insertBusiness(dados, key){
  var deferred = Q.defer();
  db_business.insert(dados, key, function(err, body) {
    console.log(err);
    console.log(body);

    if( err ){
      deferred.reject(err);
    }

    deferred.resolve(body);
  });

  return deferred.promise;
}


/*
EXEMPLO: VARIFICAR EXISTENCIA DO BANCO / CRIAR UM CASO NAO EXISTA
db_business.insert({ type: 'test', msg: 'db: bottlebusiness, ok', timeStamp: new Date().getTime() }, 'data_test', function(err, body) {

  console.log(err);
  console.log(body);

  if (!err){
    console.log("DB OK");

  }else{
    console.log("DB NOT OK");

    // db do not exists
    if(err.statusCode == '404'){
      nano.db.create('bottlebusiness', function(err, body) {
        if (!err) {
          console.log('database bottlebusiness created!');
        }

        // segunda tentativa de acesso ao db
        db_business.insert({ type: 'test', msg: 'db: bottlebusiness, ok', timeStamp: new Date().getTime() }, 'data_test', function(err, body) {
          if (!err){
            console.log("DB OK");
          }else{
            console.log("DB NOT OK");
            console.log(err);
            console.log(body);
          }
        });
      });
    // Document conflict
    }else if(err.statusCode == '409'){
      db_business.head('data_test', function(err, _, headers) {
        if (!err) {
          console.log('DB bottlebusiness data found!');
        }

        // tentativa de acesso ao db
        db_business.insert({_rev: headers.etag.replace(/\"/g, ""), type: 'test', msg: 'db: bottlebusiness, updated', timeStamp: new Date().getTime() }, 'data_test', function(err, body) {
          if (!err){
            console.log("DB bottlebusiness UPDATED");
          }else{
            console.log("DB bottlebusiness FAIL");
            console.log(err);
            console.log(body);
          }
        });
      });
    }
  }

});
*/

/* EXEMPLO INSERT
var dados =  {
              "type": "data",
              "timeStamp" : new Date().getTime().toString(),
              "collection": [
                {
                  "data": "2",
                  "key": "printer_paper",
                  "msg": "controle máximo de impressão / verificação do papel da impressora"
                },
                {
                  "data": "5",
                  "key": "bottle_approved",
                  "msg": "controle do número total de garrafas aprovadas"
                },
                {
                  "data": "3",
                  "key": "bottle_rejected",
                  "msg": "controle do número total de garrafas reprovadas"
                }
              ]
            };

db_business.insert(dados,function(err, body) {
  console.log(err);
  console.log(body);
});
*/



/*
var follow = require('follow');

var max_garrafas = 5;
var contador_garrafas = 0;

follow({db:"http://localhost:5984/garrafas", include_docs:true, since: "now"}, function(error, change) {
  if(!error) {

    console.log("Change of " + change.doc.type + " has status " + change.doc.status + " on revision " + change.doc._rev);

    if( change.doc.type == "button_pressed" ){
      if( change.doc.status ){
        // IMPRIMIR
        contador_garrafas = 0;
      }
    }else if( change.doc.type == "camera" ){
      if( change.doc.status ){
        // GARRAFA APROVADA.
        contador_garrafas ++;
        if( max_garrafas < contador_garrafas ){
          // MAX GARRAFA. RETIRAR GARRAFA
        }else{
          // OK. NOVA GARRAFA
        }
      }else {
        // GARRAFA RECUSADA. RETIRAR GARRAFA
      }
    }

  }else{
    console.log("BIG Error: " + error);
  }

})
*/
