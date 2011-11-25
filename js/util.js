
var Util = (function(){
	var socket;
	var server = 'localhost';
	var port = 27688;
	
	var userList;
	var myUsername, myWin = 0, myLost = 0, myDesk, mySide, myStatus = '', 
		dUsername = '', dWin = '', dLost = '', dStatus = '';
	
	function alert(type, msg){
		
	}
	
	function info(type, msg){
		var txt = $('#chatList').val();
		$('#chatList').val(txt + '> ' + type + ' : ' + msg + '\n');
	}
	
	function bind(){
		$('#txt').keydown(function(e){
			if(e.keyCode==13){
				e.preventDefault();
				$('#send').trigger('click');
				$('#txt').val('');
			}
		});
		$('#send').click(function(){
			var data = {
				'type': 'msg',
				'action': 'msg',
				'data': $('#txt').val()
			};
			socket.send(JSON.stringify(data));
		})
	}
	
	function onConnected(){
		info('system', 'connection successed');
		$('#users').show();
	}
	
	function onClosed(){
		info('system', 'connection closed');
		$('#users').hide();
	}
	
	function setUserName(){
		$('#username').text(myUsername);
		$('#win').text(myWin);
		$('#lost').empty().html(myLost);
		$('#status').text(myStatus);
		$('#d_username').text(dUsername);
		$('#d_win').text(dWin);
		$('#d_lost').text(dLost);
		$('#d_status').text(dStatus);
		$('#uInfo').show();
	}
	
	function setUserList(){
		var users = [];
		$('#desks p').empty();
		for(var u in userList){
			var arr = userList[u];
			var win = arr[0], lost = arr[1], desk = arr[2], side = arr[3];
			if(desk == 0){
				users.push(u + ' : ' + win + ' / ' + lost);
			} else {
				users.push(u + ' : ' + win + ' / ' + lost + ' at ' + desk + ' ' + side);
			}			
			if(desk != 0 && (side == 'L' || side == 'R')){
				$('#desk' + desk + ' .' + side + ' p').text(u);
			}
		}
		$('#userList').empty().html(users.join('\n'));
	}
	
	function sit(data){
		var username = data.username;
		if(username == myUsername){
			myDesk = data.desk;
			mySide = data.side;
		}
		if(userList[username]){ // on sit clear
			var arr = userList[username];
			var win = arr[0], lost = arr[1], desk = arr[2], side = arr[3];
			if(desk != 0 && (side == 'L' || side == 'R')){
				$('#desk' + desk + ' .' + side + ' p').text('');
			}
		}
		$('#desk' + data.desk + ' .' + data.side + ' p').text(username);
		if(data.re == 2 && myDesk == data.desk){ // two one
			var d;
			if(username != myUsername){ // not self
				dUsername = username;
				d = userList[dUsername];
			} else {
				var d;
				for(var t in userList){
					if(userList[t][2] == data.desk && t != username){
						dUsername = t;
						d = userList[t];
					}
				}
			}
			dWin = d[0];
			dLost = d[1];
			$('#d_username').text(dUsername);
			$('#d_win').text(dWin);
			$('#d_lost').text(dLost);
			showBoard();
		}
	}
	
	function getup(re){
		if(re == 'left'){
			// to do
		} else {
			myDesk = 0;
			mySide = '';
			myStatus = '';
		}
		var d = userList[dUsername];
		dUsername = '';
		dWin = '';
		dLost = '';
		dStatus = ''
		$('#d_username').text(dUsername);
		$('#d_win').text(dWin);
		$('#d_lost').text(dLost);
		$('#d_status').text(dStatus);
		showDesks();
	}
	
	return {
		connect: function(cmd){
			socket = new WebSocket('ws://' + server + ':' + port + '/' + cmd, 'nxyouxi-protocol');
			socket.onopen = function(e) {
				onConnected();
				var data = {
					'type': 'req',
					'action': 'mine'
				};
				socket.send(JSON.stringify(data));
			}
			socket.onclose = function(e) {
				onClosed();
			}
			socket.onmessage = function(e) {
				var data = JSON.parse(e.data);
				//info(e.type, data.type);
				switch(data.type){
					case 'msg':
						switch(data.action){
							case 'mine':
								myUsername = data.data.username;
								setUserName();
								break;
							case 'users':
								userList = data.data;
								setUserList();
								break;
							case 'tip':
								info('tip', data.data);
								break;
							case 'sit':
								if(parseInt(data.data.re, 10) > 0){
									sit(data.data);
								} else {
									if(data.data.username == myUsername){
										window.alert('already in sit');
									}									
								}
								break;
							case 'getup':
								getup(data.date.re);
							default:
								info(e.type, e.data);
								break;
						}
						break;
					default:
						info(e.type, e.data);
						break;
				}
			}
			bind();
		},
		send: function(data){
			socket.send(JSON.stringify(data));
		},
		sitDown: function(desk, side){
			var data = {
				'type': 'cmd',
				'action': 'sit',
				'data': {
					'desk': desk,
					'side': side
				}
			};
			socket.send(JSON.stringify(data));
		},
		getUp: function(){
			var data = {
				'type': 'cmd',
				'action': 'getup',
				'data': {}
			};
			socket.send(JSON.stringify(data));
		}
	}
})();