
var controller = (function(){
	var socket,
		server = 'localhost',
		port = 27688;
	
	function sendMsg(data){
		socket.send(JSON.stringify(data));
	}
		
	return {
		connect: function(){
			socket = new WebSocket('ws://' + server + ':' + port + '/test', 'nxyouxi-protocol');
			socket.onopen = function(e) {
				var data = {
					'action': 'login',
					'data': $.cookie('username')
				};
				sendMsg(data);
				g.on('connected');
			}
			socket.onclose = function(e) {
				g.on('closed');
			}
			socket.onmessage = function(e) {
				var data = JSON.parse(e.data);
				//g.on(data.type, data.data);
				switch(data.type){
					case 'desks-users':
						g.on('desks-users', data.data);
						break;
					case 'msg':
						g.on('msg', data.data);
						break;
					case 'assigning':
						g.on('assigning', data.data);
						break;
					case 'sitdown':
						g.on('sitdown', data.data);
						break;
					case 'chat':
						g.on('chat', data.data);
						break;
					case 'ready':
						g.on('ready', data.data);
						break;
					case 'game':
						g.on('game', data.data);
						break;
				}
			}
		},
		
		op: function(type, msg){
			var data = {};
			switch(type){
				case 'logout':
					//socket.close();
					break;
				case 'chat':
					data = {
						'action': 'chat',
						'data': msg
					};
					sendMsg(data);
					break;
				case 'ready':
					data = {
						'action': 'ready'
					};
					sendMsg(data);
					break;
			}
		}
	}
})();

var g = (function(){
	
	this.userid = '';
	
	function init(){
		reset();
		$('#Login').show();
		if(window.WebSocket){
			$('#init').show();
		} else {
			$('#not-support').show();
			return;
		}
		if($.cookie('username')){
			$('#change_account').show();
			$('#user-name').show();
			$('#user-name').find('span').html($.cookie('username'));
			$('#user-new').hide();
		} else {
			$('#change_account').hide();
			$('#user-name').hide();
			$('#user-new').show();
			$('#username').focus();				
		}
		
		$('#change_account').click(function(){
			$.cookie('username', '');
			$('#change_account').hide();
			$('#user-name').hide();
			$('#user-new').show();
			$('#username').focus();
		});
		
		$('#btn-login').click(function(){
			if(!$.cookie('username')){
				$.cookie('username', $('#username').val());
			}
			loading();
			controller.connect();
		});
		
		$('#game-list-ul li').click(function(){
			$('#game-list-ul li').removeClass('cur');
			$(this).addClass('cur');
			switch(this.id){
				case 'sub-game-list':
					$('#game-desk-tb').show();
					$('#game-user-tb').hide();
					break;
				case 'sub-user-list':
					$('#game-desk-tb').hide();
					$('#game-user-tb').show();
					break;
			}
		});
		
		$('#logout').click(function(event){
			event.preventDefault();
			controller.op('logout');
			reset();
			$('#Login').show();
			$('#change_account').show();
			$('#user-name').show();
			$('#user-name').find('span').html($.cookie('username'));
			$('#user-new').hide();
		});
	}
	
	function loading(){
		reset();
		$('#Connecting').html('<p>正在连接服务器 ...</p>').show();
	}
	
	function reset(){
		$('#Login').hide();
		$('#Connecting').hide();
		$('#Game').hide();
	}
	
	function appendSysMsg(data){
		$('#game-msgs-con').append('<p>' + data + '</p>');
	}
		
	function appendChatMsg(data){
		$('#game-chat-box').val($('#game-chat-box').val() + '\n' + data);
	}
		
	function setDesksUsersList(data){
		var arrT = [], i = 0;
		for(var t in data['desks']){
			arrT.push('<tr>');
			arrT.push('	<td class="a">' + data['desks'][t].L + '</td>');
			arrT.push('	<td class="b">vs</td>');
			arrT.push('	<td class="c">' + data['desks'][t].R + '</td>');
			arrT.push('</tr>');
		}
		$('#game-desk-tb tbody').empty().html(arrT.join(''));
		arrT = [];
		for(var t in data['users']){
			arrT.push('<tr>');
			arrT.push('	<td class="a">' + data['users'][t].sn + '</td>');
			arrT.push('	<td class="b">' + data['users'][t].w + '</td>');
			arrT.push('	<td class="b">' + data['users'][t].d + '</td>');
			arrT.push('	<td class="b">' + data['users'][t].l + '</td>');
			arrT.push('</tr>');
			i ++;
		}
		$('#game-user-tb tbody').empty().html(arrT.join(''));
		$('#gameusers-online-num').html(i);
	}
	
	function initGameBoard(data){	
		$('#game-waitting').hide();
		$('#game-main').show();
		$('#game-chat').show();
		
		$('#ready').show();
		$('#draw').hide();
		$('#lost').hide();	
		
		var arrT = [];
		arrT.push('<table>');
		for(var i = 0; i < 6; i ++){
			arrT.push('<tr>');
			for(var j = 0; j < 6; j ++){
				arrT.push('<td>' + j + '</td>');
			}
			arrT.push('</tr>');
		}
		arrT.push('</table>');
		$('#gameboard').html(arrT.join(''));
		
		$('#game-rival-name').html(data.L);
		$('#game-rival-state').empty();
		$('#game-self-name').html(data.R);
		$('#game-self-state').empty();		
		
		$('#ready').unbind().click(function(event){
			event.preventDefault();		
			controller.op('ready');	
		});
		
		$('#draw, #lost').unbind().click(function(event){
			event.preventDefault();
			$('#ready').show();
			$('#draw').hide();
			$('#lost').hide();
		});
		
		$('#game-chat-input').unbind().keydown(function(event){
			if(event.keyCode == 13){
				controller.op('chat', $(this).val());
			}
		});
		
		$('#game-chat-submit').unbind().click(function(event){
			if(event.keyCode == 13){
				controller.op('chat', $('#game-chat-input').val());
			}
		});
	}
	
	return {
		init: function(){
			init();
		},
		
		on: function(status, data){
			switch(status){
				case 'msg':
					appendSysMsg(data);
					break;
				case 'closed':
					reset();
					$('#Connecting').html('<p>连接服务器失败</p>').show();
					break;
				case 'connected':
					reset();
					$('#Connecting').html('<p>已连接服务器 ...</p>').show();
					$('#user-bar-username').html($.cookie('username'));
					break;
				case 'assigning':
					reset();
					$('#Game').show();	
					$('#game-waitting').html('正在配桌 ...').show();
					$('#game-main').hide();
					$('#game-chat').hide();
					this.userid = data;
					
					$('#game-msgs-con').empty();
					appendSysMsg('您已成功登录。');
					break;
				case 'desks-users':
					setDesksUsersList(data);
					break;
				case 'sitdown':		
					appendSysMsg('新对决: ' + data.L + ' vs ' + data.R);
					initGameBoard(data);
					break;
				case 'chat':
					$('#game-chat-box').val($('#game-chat-box').val() + '\n' + data.username + ' 说： ' + data.msg);
					break;
				case 'ready':	
					if(data.id == this.userid){	
						$('#ready').hide();
						$('#peace').show();
						$('#lost').show();
						$('#game-self-state').html('准备');
					} else {
						$('#game-rival-state').html('准备');
					}
					break;
				case 'game':
						
					break;
			}
		}
	}
})();

$(document).ready(function(){	
	g.init();
});
