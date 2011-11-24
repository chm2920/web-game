
var Util = (function(){
	var socket;
	var server = 'localhost';
	var port = 27688;
	
	var userList;
	
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
	
	function setUserList(){
		var users = [], desk = {};
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
		$('#desk' + data.desk + ' .' + data.side + ' p').text(data.username);
		showBoard();
	}
	
	return {
		connect: function(cmd){
			socket = new WebSocket('ws://' + server + ':' + port + '/' + cmd, 'nxyouxi-protocol');
			socket.onopen = function(e) {
				onConnected();
				var data = {
					'type': 'req',
					'action': 'users'
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
							case 'users':
								userList = data.data;
								setUserList();
								break;
							case 'tip':
								info('tip', data.data);
								break;
							case 'sit':
								info('tip', data.data.re);
								if(parseInt(data.data.re, 10) > 0){
									sit(data.data);
								} else {
									window.alert('have in sit');
								}
								break;
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
		}
	}
})();