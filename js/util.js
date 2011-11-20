
var Util = (function(){
	var socket;
	var server = 'localhost';
	var port = 27688;
	
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
	
	function setUserList(users){
		var userList = [];
		for(var u in users){
			userList.push(u);
		}
		$('#userList').empty().html(userList.join('\n'));
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
								setUserList(data.data);
								break;
							case 'tip':
								info('tip', data.data);
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
		}
	}
})();