
//Requirments
var http=require('http');
var url=require('url');
var StringDecoder=require('string_decoder').StringDecoder;
var https=require('https');
var fs=require('fs');
var config=require('./config');
//Instantiating http server
var httpserver=http.createServer(function(req,res){
  unifiedServer(req,res);
})
//Listening from http server
   httpserver.listen(config.httpport,function(){
  console.log('Server listening from port ' +config.httpport);
});
//Instantiating https Server

var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer=https.createServer(httpsServerOptions,function(req,res){
unifiedServer(req,res);
});
//Listenng to https Server
httpsServer.listen(config.httpsport,function(){
console.log('Server Listening from port'+config.httpsport);
});

var unifiedServer=function(req,res){
  //parsing request path
  var parsedUrl=url.parse(req.url,true);
   var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    //parsing methods
    var method =req.method.toLowerCase();
    //parsing query strings
    var queryStringObject=parsedUrl.query;
    //parsing headers
    var headers=req.headers;
  var decoder=new StringDecoder('utf-8');
  var buffer='';
  req.on('data',function(data){
    buffer+=decoder.write(data);
    
  });
         req.on('end',function(data){
buffer+=decoder.end();
           var chosenHandler=typeof(routers[trimmedPath]) != 'undefined' ? routers[trimmedPath] : handlers.notFound;
           var data={
        'trimmedPath':trimmedPath,
        'method':method,
        'queryStringObject':queryStringObject,
        'headers':headers,
        'payload':buffer
      };
           chosenHandler(data,function(statusCode,payload){
            statuscode=typeof(statusCode) == 'number'? statusCode : 200;
            payload=typeof(payload) == 'object'? payload : {};
             var payloadString=JSON.stringify(payload);
             res.setHeader('Content-type','application/json');
res.writeHead(statusCode);
res.end(payloadString);
console.log('The Response is this',statusCode,payloadString); 

           });           
         });
}
var handlers={}
  handlers.foo=function(data,callback){
  callback(200);
  }

handlers.hello=function(data,callback){
  callback(406,{'Welcome Message':'Hello Guyss'})
}
handlers.notFound=function(data,callback){
  callback(404);
}
var routers={
  foo:handlers.foo,
  hello:handlers.hello
}
