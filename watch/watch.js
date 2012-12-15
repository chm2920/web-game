

var spawn = require('child_process').spawn,
	ws = require("./ws");

ws.createServer(function (socket) {
	var tail;
	socket
		.addListener("connect", function (socketid) { 
			tail = spawn("tail", ['-f', 'nohup.out']);
			tail.stdout.on('data', function(data) {
				try{
					socket.write(data);
				} catch(e) {
					console.log(e);
				}
			});
		})
		.addListener("close", function (socketid) { 
			socket.end();
			tail.kill();
		})
		.addListener("data", function (data) { 
		});
}).listen(27689);
		


