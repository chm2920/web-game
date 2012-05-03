

var spawn = require('child_process').spawn,
	tail = spawn("tail", ['-f', 'nohup.out']),
	ws = require("./ws");

ws.createServer(function (socket) {
	tail.stdout.on('data', function(data) {
		try{
			socket.write(data);
		} catch(e) {
			console.log(e);
		}
	});
	socket
		.addListener("connect", function (socketid) { 
		})
		.addListener("close", function (socketid) { 
			socket.end();
		})
		.addListener("data", function (data) { 
		});
}).listen(27689);
		