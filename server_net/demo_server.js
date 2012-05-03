
var Lobby = require('./demo_lobby'),
	ws = require("./ws"),
	conns_count = 0,
	lobby = new Lobby();

function sys_log(s){
	console.log(s);
}

ws.createServer(function (socket) {
	socket
		.addListener("connect", function (socketid) { 
			conns_count ++;
			var now = new Date();
			now = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
			console.log('->', "Welcome socketid[", socketid, '] at ', now, ' from ', socket.remoteAddress, ' in Conns[', conns_count, ']');
			lobby.manager[socketid] = socket;
		})
		.addListener("close", function (socketid) { 
			for(var k in lobby.manager){
				if(k == socketid){
					socket.end();
					delete lobby.manager[k];
					conns_count --;
					console.log('<-', k, 'logout');
					break;
				};
			};
			lobby.logout(socketid);
		})
		.addListener("data", function (data) { 
			var get = {
					id: data.socketid,
					data: JSON.parse(data.data)
				};
			console.log(get.id, ' post ', get.data);
			switch(get.data.action){
				case 'login':
					lobby.userLogin(get);								
					break;
				case 'chat':
					lobby.chat(get);
					break;
				case 'ready':
					lobby.ready(get.id);
					break;
				case 'check':
					lobby.check(get.id, get.data.data);
					break;
			}
		});
}).listen(27688);