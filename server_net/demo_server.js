
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
			sys_log("Welcome socketid[" + socketid + '] in Conns[' + conns_count + ']');
			lobby.manager[socketid] = socket;
		})
		.addListener("close", function (socketid) { 
			for(var k in lobby.manager){
				if(k == socketid){
					socket.end();
					delete lobby.manager[k];
					conns_count --;
					sys_log("delete " + k);
					break;
				};
			};
			//lobby.logout(socketid);
		})
		.addListener("data", function (data) { 
			var get = {
					id: d.socketid,
					data: JSON.parse(d.data)
				};
			console.log(get);
			switch(get.data.action){
				case 'login':
					lobby.userLogin(get);								
					break;
				case 'sit':
					lobby.sit(data.id, data.data.data.deskno, data.data.data.side);
					break;
				case 'getup':
					lobby.getup(data.id);
					break;
				case 'ready':
					lobby.ready(data.id);
					break;
				case 'game':
					lobby.game(data.id);
					break;
				case 'check':
					lobby.check(data.id, data.data.data);
					break;
				case 'move':
					lobby.move(data.id, data.data);
					break;
				case 'random':
					lobby.random(data.id);
					break;
			}
		});
}).listen(27688);