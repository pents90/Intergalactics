var fs = require('fs');
var httpServer = require('http').createServer(function(req, response){ 
	fs.readFile('index.html', function(err, data) {
	response.writeHead(200, {'Content-Type':'text/html'});
	response.write(data);
	response.end();
	});
});
console.log("( ( I N T E R G A L A C T I C S ) )");
httpServer.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

everyone.now.logStuff = function(msg){
    console.log(msg);
	everyone.now.blam();
}