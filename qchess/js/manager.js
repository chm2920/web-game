
var Manager = {	
	userList: [],
	
	setUserName: function(data){
		User.username = data.username;
		D.setUserName();
	},
	
	setUserList: function(data){
		this.userList = data;
		D.setUserList();
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
			alert('a');
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
	},
	
	ready: function(data){
		if(data.username == User.username){
			$('#doReady').hide();
			$('#doLeave').show();
			$('#doLost').hide();
			$('#doPeace').hide();
			User.status = 'Ready';	
			$('#status').text(User.status);		
		} else {
			User.dStatus = 'Ready';
			$('#d_status').text(User.dStatus);
		}
	},
	
	game: function(data){		
		User.status = 'Game';	
		User.dStatus = 'Game';
		$('#status').text('');
		$('#d_status').text('');
		$('#doReady').hide();
		$('#doLeave').hide();
		$('#doLost').show();
		$('#doPeace').show();
		D.showPs(data);
	},
	
	turn: function(data){
		D.showTurn(data);
	},
	
	check: function(data){
		D.check(data);
	},
	
	op: function(data){
		D.selected(data);
	},
	
	move: function(data){
		D.move(data);
	},
	
	over: function(data){
		D.showResult(data);
	}
};