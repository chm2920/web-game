
var Lobby = {
	socket: null,
	server: 'localhost',
	//server: '173.252.248.156',
	port: 27688,
	
	connect: function(){
		socket = new WebSocket('ws://' + this.server + ':' + this.port + '/test', 'nxyouxi-protocol');
		socket.onopen = function(e) {
			Lobby.onConnected();
			var data = {
				'type': 'req',
				'action': 'mine'
			};
			Lobby.send(data);
		}
		socket.onclose = function(e) {
			Lobby.onClosed();
		}
		socket.onmessage = function(e) {
			var data = JSON.parse(e.data);
			//info(e.type, data.type);
			switch(data.type){
				case 'msg':
					switch(data.action){
						case 'mine':
							Manager.setUserName(data.data);
							break;
						case 'users':
							Manager.setUserList(data.data);
							break;
						case 'tip':
							D.info('tip', data.data);
							break;
						case 'sit':
							if(parseInt(data.data.suc, 10) > 0){
								Manager.sit(data.data);
							} else {
								Util.msg('already in sit');								
							}
							break;
						case 'getup':
							Manager.getup(data.data);
							break;
						case 'ready':
							Manager.ready(data.data);
							break;
						case 'game':
							Manager.game(data.data);
							break;
						case 'turn':
							Manager.turn(data.data);
							break;
						case 'check':
							Manager.check(data.data);
							break;
						case 'op':
							Manager.op(data.data);
							break;
						case 'move':
							Manager.move(data.data);
							break;
						case 'over':
							Manager.over(data.data);
							break;
						case 'desks':
							D.debug(data.data);
							break;
						default:
							D.info(e.type, e.data);
							break;
					}
					break;
				default:
					D.info(e.type, e.data);
					break;
			}
		}
	},
	
	send: function(data){
		socket.send(JSON.stringify(data));
	},
	
	onConnected: function(){
		D.info('system', 'connection successed');
		$('#users').show();
	},
	
	onClosed: function(){
		D.info('system', 'connection closed');
		$('#users').hide();
	}
	
};
