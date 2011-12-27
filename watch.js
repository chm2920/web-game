var spawn = require('child_process').spawn;
var tail = spawn("tail", ['-f', 'tail.html']);
  
console.log('starting');


var net = require("net");
var server = net.createServer();
server.addListener("connection", function(connection){
	tail.stdout.on('data',function(data) {
		server.broadcast(data);
	});
});
server.listen(8001, "127.0.0.1");
