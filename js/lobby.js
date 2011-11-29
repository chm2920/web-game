
var Lobby = {
	socket: null,
	server: 'localhost',
	port: 27688,
	
	userList: [],
	
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
							User.username = data.data.username;
							D.setUserName();
							break;
						case 'users':
							Lobby.userList = data.data;
							D.setUserList();
							break;
						case 'tip':
							D.info('tip', data.data);
							break;
						case 'sit':
							if(parseInt(data.data.suc, 10) > 0){
								Lobby.sit(data.data);
							} else {
								window.alert('already in sit');								
							}
							break;
						case 'getup':
							Lobby.getup(data.data);
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
	},
	
	sit: function(data){
		var username = data.username;
		var myUsername = User.username;
		if(username == myUsername){
			User.deskno = data.deskno;
			User.side = data.side;
		}
		if(this.userList[username]){ // on sit clear
			var arr = this.userList[username];
			var win = arr[0], lost = arr[1], deskno = arr[2], side = arr[3];
			if(deskno != 0 && (side == 'L' || side == 'R')){
				$('#desk' + deskno + ' .' + side + ' p').text('');
			}
		}
		$('#desk' + data.deskno + ' .' + data.side + ' p').text(username);
		if(parseInt(data.suc, 10) == 2 && User.deskno == data.deskno){ // two one
			var d;
			if(username != myUsername){ // not self
				User.dUsername = username;
				d = this.userList[User.dUsername];
			} else {
				for(var t in this.userList){
					if(this.userList[t][2] == data.deskno && t != username){
						User.dUsername = t;
						d = this.userList[t];
					}
				}
			}
			User.dWin = d[0];
			User.dLost = d[1];
			$('#d_username').text(User.dUsername);
			$('#d_win').text(User.dWin);
			$('#d_lost').text(User.dLost);
			D.showBoard();
		}
	},
	
	getup: function(data){
		$('#desk' + data.deskno + ' .' + data.side + ' p').text('');
		if(data.username == User.username){
			User.deskno = 0;
			User.side = '';
			User.status = '';
			User.dUsername = '';
			User.dWin = '';
			User.dLost = '';
			User.dStatus = '';
			$('#d_username').text(User.dUsername);
			$('#d_win').text(User.dWin);
			$('#d_lost').text(User.dLost);
			$('#d_status').text(User.dStatus);
			D.showDesks();
		} else {
			if(data.username == User.dUsername){
				User.dUsername = '';
				User.dWin = '';
				User.dLost = '';
				User.dStatus = '';
				$('#d_username').text(User.dUsername);
				$('#d_win').text(User.dWin);
				$('#d_lost').text(User.dLost);
				$('#d_status').text(User.dStatus);
				D.showDesks();
			}
		}
	}
};
