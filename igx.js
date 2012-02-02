var TURN_SPEED = 2000;
var FLEET_SPEED = 0.2;
var NEUTRAL = -1;
var GALAXY_SIZE = 16;
var PLANET_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var galaxy = [
{name: 'A',
ships: 20,
production: 10,
owner: 1,
x: 15,
y: 8}
,
{name: 'B',
ships: 10,
production: 12,
owner: 0,
x: 10,
y: 2}
,
{name: 'C',
ships: 5,
production: 1,
owner: 0,
x: 3,
y: 7}
,
{name: 'D',
ships: 22,
production: 4,
owner: 1,
x: 9,
y: 11}
];

// Create galaxy
new function() {
	galaxy = [];
	for (var i = 0; i < 26; i++) {
		var name = PLANET_NAMES.charAt(i);
		var production = Math.floor(Math.random() * 11);
		var ships = Math.floor(Math.random() * 11);
		var x, y;
		do {
			x = Math.floor(Math.random() * GALAXY_SIZE);
			y = Math.floor(Math.random() * GALAXY_SIZE);
			var conflict = false;
			for (var j = 0; j < i; j++) {
				if (galaxy[j].x == x && galaxy[j].y == y) {
					conflict = true;
				}
			}
		} while (conflict);
		galaxy.push({name: name, ships: ships, production: production, owner: NEUTRAL, x: x, y: y});
	}
	// Set up home planets
	for (var i = 0; i < 2; i++) {
		galaxy[i].ships = 20;
		galaxy[i].production = 10;
		galaxy[i].owner = i;
	}
}();

console.log(galaxy);

var turn = 0;
var fleets = [
{
	source:1,
	destination:0,
	owner:0,
	ships:30,
	x:10,
	y:2
}
];

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
var port = process.env.PORT || 8080;
httpServer.listen(port);

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

everyone.now.joinGame = function(msg){
    console.log(msg);
	everyone.now.receiveUpdate(galaxy);
}

everyone.now.sendFleet = function(fromPlanet, toPlanet, ships) {
	// todo - check for fleet owner other than just neutral	
	var source = galaxy[fromPlanet];
	if (source.owner == NEUTRAL) {
		return;
	}
	var destination = galaxy[toPlanet];
	var sent = Math.min(ships, source.ships);
	fleets.push({source: fromPlanet, destination: toPlanet, owner: fromPlanet.owner, ships: sent, x:source.x, y:source.y});
	source.ships -= sent;
}

setInterval(function() {
	turn++;
	console.log("Update turn: " + turn + ".");
	// Planets produce
	if (turn % 20 == 0) {
		for (var i = 0; i < galaxy.length; i++) {
			if (galaxy[i].owner != NEUTRAL) {
				galaxy[i].ships += galaxy[i].production;		 
			}
		}
	}
	// Fleets move
	for (var i = 0; i < fleets.length; i++) {
		var planet = galaxy[fleets[i].destination];
		var distance = Math.sqrt((fleets[i].x - planet.x) ^ 2 + (fleets[i].y - planet.y) ^ 2);
		if (distance < FLEET_SPEED) {
			// Arrives
			console.log("Fleet arrives!");
			// Super-simple combat
			if (fleets[i].owner == planet.owner) {
				console.log("Planet reinforced.");
				planet.ships += fleets[i].ships;
			} else if (fleets[i].ships > planet.ships) {
				console.log("Planet invaded.");
				planet.owner = fleets[i].owner;
				planet.ships = fleets[i].ships;
			} else {
				console.log("Fleet repelled.");				
			}
			fleets.splice(i, 1);
			i--;
		} else {
			var angle = Math.atan2(planet.y - fleets[i].y, planet.x - fleets[i].x);
			fleets[i].x += Math.cos(angle) * FLEET_SPEED;
			fleets[i].y += Math.sin(angle) * FLEET_SPEED;
			console.log("  Fleet " + i + " now at (" + fleets[i].x + ", " + fleets[i].y + ").")
		}
	}
	everyone.now.receiveUpdate(galaxy);
}, TURN_SPEED);