
var Lobby = require('./lobby');
var	ws = require("./ws"),
	cnt = 0;
	
var manager = function(){
	this.transports = {};
};
var lobby = new Lobby(manager);

console.log('a');

ws.createServer(function (emitter) {
	emitter
		.addListener("connect", function (socketid) { 
			cnt ++;
			console.log("Welcome socketid[" + socketid + '] in Conns[' + cnt + ']');
			manager.transports[socketid] = emitter;
		})
		.addListener("data", function (data) { 
			switch(data.type){
				case 'req':
					switch(data.data.action){
						case 'mine':
							lobby.getUInfo(data);								
							break;
					}
					break;
				case 'cmd':
					switch(data.data.action){
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
			}
		})
		.addListener("close", function (socketid) { 
			for(var key in manager.transports){
				if(key==socketid){
					emitter.end();
					console.log("delete " + key);
					delete manager.transports[key];
					cnt--;
					break;
				};
			};
			lobby.logout(socketid);
			console.log(cnt);
		});
}).listen(27688);