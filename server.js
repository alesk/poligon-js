/* jshint -W030 */

var express   = require('express');
var fs        = require('fs');
var util      = require('util');
var url       = require('url');
var mime      = require('mime');


// middleware
var app = express({cache:0});
var Buffer = require('buffer').Buffer;
var constants = require('constants');


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Range');
    res.header('Access-Control-Expose-Headers', 'Content-Range');

    if ('OPTIONS' == req.method) {
        console.log("Options request");
        res.send(200);
    } else {
        next();
    }
};

// middleware
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.logger());
//app.use(express.logger('dev'));
app.use(express.compress());

// logging
app.get("/log.gif", function(req, res){
  var url_parts = url.parse(req.url, true),
      query = url_parts.query;

  console.log(query);
  res.end();
});


// routes
  
var myHandler = function(req, res, next){

  // http://stackoverflow.com/questions/5784621/how-to-read-binary-files-byte-by-byte-in-node-js
  var range = req.headers.range;
  var file = __dirname + ((req.path === '/') ? '/index.html' : req.path);

  // https://gist.github.com/geta6/3793279


  fs.stat(file, function(err, stats){

    if (err) {
      console.log(err.code);
      res.status(404).send(file + " not found.");
      return;
    }

    var size = stats.size;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range', 'Content-Length');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Content-Type', mime.lookup(file));
    res.setHeader('Accept-Ranges', 'bytes');
    //res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    //res.setHeader('Pragma', 'cache');
    //res.setHeader('Expires', '3600');


    if (range) {
      var range_parts = /(\d+)-(\d*)/.exec(range);
      var start = parseInt(range_parts[1], 10);
      var end = (range_parts[2] === '') ? size - 1 : parseInt(range_parts[2], 10);

      end = (end < size) ? end : size-1;

      console.log("Reading '"+file+"' from "+start+" - " + end);
      var stream = fs.createReadStream(file, {start: start, end: end});

      stream.on('open', function() {
        res.writeHead(206, {
          'Content-Length': end - start,
          'Content-Range': "bytes "+start+"-"+end+"/"+size,
          'Content-Type': "bytes "+start+"-"+end+"/"+size,
          'Content-Language': "bytes "+start+"-"+end+"/"+size
        });    
        stream.pipe(res);
      });

      stream.on('error', function(err){
        res.end(err);
      });

    } else {
        //if (next) next(res, req);
        res.sendfile(file);
    }
  });

};

app.options('/', function(req, res){
  console.log("Options request");
});

app.post('/log/', function(req, res) {
  var userAgent = req.userAgent,
  ts = new Date().getTime(),
  logName = Math.ceil(ts/10000).toString(36) + ".log";

  !fs.existsSync('logs') && fs.mkdirSync('logs');
  fs.writeFileSync('logs/'+logName, JSON.stringify(req.body, null, 4)+"\n");
  return res.end(JSON.stringify({url:'logs/'+logName}));
});

app.use("/", myHandler);
//app.use("/", express.static(__dirname + '/'));

module.exports = app;
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));
console.log('Express server started on port %s', app.get('port'));
