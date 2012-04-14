
var User = {
	username: '',
	win: 0, 
	lost: 0, 
	
	deskno: 0, 
	side: null,
	status: '',
	
	dUsername: '', 
	dWin: 0, 
	dLost: 0, 
	dStatus: '',
	
	sitAt: function(deskno, side){
		var data = {
			'type': 'cmd',
			'action': 'sit',
			'data': {
				'deskno': deskno,
				'side': side
			}
		};
		Lobby.send(data);
	},
	getUp: function(){
		var data = {
			'type': 'cmd',
			'action': 'getup'
		};
		Lobby.send(data);
	},
	ready: function(){
		var data = {
			'type': 'cmd',
			'action': 'ready'
		};
		Lobby.send(data);		
	},
	check: function(d){
		var data = {
			'type': 'cmd',
			'action': 'check',
			'data': d
		};
		Lobby.send(data);		
	},
	move: function(x, y){
		var data = {
			'type': 'cmd',
			'action': 'move',
			'data': {
				x: x,
				y: y
			}
		};
		Lobby.send(data);		
	},
	random: function(){
		var data = {
			'type': 'cmd',
			'action': 'random'
		};
		Lobby.send(data);		
	}
};