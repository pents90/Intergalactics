var galaxy = [
{name: 'A',
ships: 20,
production: 10,
owner: 'Matt2000',
x: 15,
y: 8}
,
{name: 'B',
ships: 10,
production: 12,
owner: 'Pents90',
x: 10,
y: 2}
,
{name: 'C',
ships: 5,
production: 1,
owner: 'Pents90',
x: 3,
y: 7}
,
{name: 'D',
ships: 22,
production: 4,
owner: 'Matt2000',
x: 9,
y: 11}
];

console.log(galaxy);

////

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

everyone.now.joinGame = function(msg){
    console.log(msg);
	everyone.now.receiveUpdate(galaxy);
}

setInterval(function() {
	console.log("Update turn.");
	for (var i = 0; i < galaxy.length; i++) {
		galaxy[i].ships += galaxy[i].production;		 
	}
	everyone.now.receiveUpdate(galaxy);
}, 2500);