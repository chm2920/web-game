
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
					'type': 'req',
					'action': 'login',
					'data': $.cookie('username')
				};
				sendMsg(data);
				g.onConnected();
			}
			socket.onclose = function(e) {
				g.onClosed();
			}
			socket.onmessage = function(e) {
				var data = JSON.parse(e.data);
				switch(data.type){
					
				}
			}
		}
	}
})();

var g = (function(){
	function bind(){
		$('#change_account').click(function(){
			$.cookie('username', '');
			$('#change_account').hide();
			$('#user-name').hide();
			$('#user-new').show();
			$('#username').focus();
		});
		
		$('#btn-login').click(function(){
			login();
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
	}
	
	function init(){
		bind();
		reset();
		$('#Login').show();
		if(window.WebSocket){
			$('#init').show();
		} else {
			$('#not-support').show();
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
	}
	
	function login(){	
		if(!$.cookie('username')){
			$.cookie('username', $('#username').val());
		}
		loading();
		controller.connect();
	}
	
	function game(){
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
		
		$('#ready').click(function(event){
			event.preventDefault();
			$('#ready').hide();
			$('#logout').hide();
			$('#peace').show();
			$('#lost').show();				
		});
		
		$('#logout').click(function(event){
			event.preventDefault();
			loading();
			setTimeout(function(){
				init();
			}, 600);
		});
		
		$('#draw, #lost').click(function(event){
			event.preventDefault();
			$('#ready').show();
			$('#draw').hide();
			$('#lost').hide();
		});
	}
	
	function loading(){
		reset();
		$('#Connecting').show();
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
	
	return {
		init: function(){
			init();
		},

		onConnected: function(){
			reset();
			$('#Game').show();			
			$('#ready').show();
			$('#draw').hide();
			$('#lost').hide();
						
			$('#game-desk-tb tbody').empty();
			$('#game-user-tb tbody').empty();
			
			$('#game-msgs-con').empty()
			appendSysMsg('您已成功登录。');
		},
		
		onClosed: function(){
			reset();
			$('#Connecting').html('<p>连接服务器失败</p>').show();
		},
		
		setDeskList: function(data){
			var arrT = [];
			arrT.push('<tr>');
			arrT.push('	<td class="a">Chm2920</td>');
			arrT.push('	<td class="b">vs</td>');
			arrT.push('	<td class="c">abcd</td>');
			arrT.push('</tr>');
			$('#game-desk-tb tbody').html(arrT.join(''));
		},
		
		setUserList: function(data){
			var arrT = [];
			arrT.push('<tr>');
			arrT.push('	<td class="a">chm2920</td>');
			arrT.push('	<td class="b">0</td>');
			arrT.push('	<td class="b">0</td>');
			arrT.push('	<td class="b">0</td>');
			arrT.push('</tr>');
			$('#game-user-tb tbody').html(arrT.join(''));
		},
		
		gameStart: function(data){
			$('#gameusers-online-num').html(data.total);
		}
	}
})();

$(document).ready(function(){	
	g.init();
});
