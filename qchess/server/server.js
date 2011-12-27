
var Lobby = require('./lobby');

var manager = require('./manager').listen(27688, function(){
	console.log(manager.server.address());
});

var lobby = new Lobby(manager);

manager.server
	.on('connection', function(socket){
		console.log('on connection');
		
		socket
			.on('req', function(data){				
				switch(data.data.action){
					case 'mine':
						lobby.getUInfo(data);								
						break;
				}
			})
			.on('cmd', function(data){				
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
				console.log('begin');
			})
			.on('error', function(){
				console.log('error');
			})
			.on('connect', function(){
				console.log('connect: ', manager.server.connections);
			})
			.on('logout', function(id){
				lobby.logout(id);
				console.log('close');
			});
	})
	.on('close', function(e){
		console.log('on close');
	});
	