
var User = {
	username: '',
	win: 0, 
	lost: 0, 
	
	deskno: 0, 
	side: null,
	status: '',
	
	dUsername: '', 
	dWin: '', 
	dLost: '', 
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
	}
};