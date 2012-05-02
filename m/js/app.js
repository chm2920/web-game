
var controller = (function(){
	var socket,
		server = document.location.host == 'localhost' ? 'localhost' : '173.252.248.156',
		port = 27688;
	
	function sendData(data){
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
				sendData(data);
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
					case 'join':
						g.on('join', data.data);
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
					case 'turn':
						g.on('turn', data.data);
						break;
					case 'check':
						g.on('check', data.data);
						break;
					case 'select':
						g.on('select', data.data);
						break;
					case 'move':
						g.on('move', data.data);
						break;
					case 'over':
						g.on('over', data.data);
						break;
					case 'leave':
						g.on('leave', data.data);
						break;
				}
			}
		},
		
		op: function(type, data){
			var p = {};
			switch(type){
				case 'logout':
					socket.close();
					break;
				case 'chat':
					p = {
						'action': 'chat',
						'data': data
					};
					sendData(p);
					break;
				case 'ready':
					p = {
						'action': 'ready'
					};
					sendData(p);
					break;
				case 'check':
					p = {
						'action': 'check',
						'data': data
					};
					sendData(p);
					break;
			}
		}
	}
})();

function P(x, y){
	this.id = 'd_' + x + '_' + y;
	this.x = x;
	this.y = y;
	this.side = null;
	this.chess = null;
	this.v = false;
}

P.prototype = {
	getSbilings: function(){
		var arr = [], ps = [], p;
		if(this.x != 1){
			p = g.findP(this.x - 1, this.y);
			ps.push(p);
		}
		if(this.x != 6){
			p = g.findP(this.x + 1, this.y);
			ps.push(p);
		}
		if(this.y != 1){
			p = g.findP(this.x, this.y - 1);
			ps.push(p);
		}
		if(this.y != 6){
			p = g.findP(this.x, this.y + 1);
			ps.push(p);
		}
		for(var i = 0, l = ps.length; i < l; i ++){
			// pan duan da xiao
			if(!ps[i].chess && ps[i].v){
				arr.push(ps[i]);
			} else {
				if(ps[i].chess && ps[i].side != this.side){
					if(ps[i].chess == 6 && this.chess == 1){
						arr.push(ps[i]);
					}
					if(this.chess >= ps[i].chess){
						if(ps[i].chess == 1 && this.chess == 6){
							continue;
						}
						arr.push(ps[i]);
					}
				}
			}
		}
		return arr;
	},
	selected: function(){
		var arr = this.getSbilings();
		for(var i = 0, l = arr.length; i < l; i ++){
			$('#' + arr[i].id).addClass('mrange');
		}
		$('#' + this.id).addClass('selected');
	},
	onClick: function(){
		controller.op('check', {x: this.x, y: this.y});
	},
	clear: function(){
		this.side = null;
		this.chess = null;		
	}
}

var g = (function(){	
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
		$('#username').keydown(function(){
			if(event.keyCode == 13){
				$('#btn-login').trigger('click');
			}
		});
		$('#btn-login').click(function(){
			if(!$.cookie('username')){
				$.cookie('username', $('#username').val());
			}
			loading();
			controller.connect();
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
	
	function initGameBoard(data){	
		$('#game-waitting').hide();
		$('#game-main').show();
		
		$('#ready').show();
		$('#logout').hide();
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
		
		if(data.L.id == g.userid){
			g.side = 'L';
			g.rivalId = data.R.id;
			$('#game-rival-name').html(data.R.username).removeClass().addClass('R');
			$('#game-self-name').html(data.L.username).removeClass().addClass('L');
		} else {
			g.side = 'R';
			g.rivalId = data.L.id;
			$('#game-rival-name').html(data.L.username).removeClass().addClass('L');
			$('#game-self-name').html(data.R.username).removeClass().addClass('R');	
		}
		$('#game-rival-state').empty();
		$('#game-self-state').empty();		
		
		$('#ready').unbind().click(function(event){
			event.preventDefault();		
			controller.op('ready');	
		});
	}
	
	function game(data){
		$('#ready').hide();
		$('#draw').hide();
		$('#lost').hide();
		$('#game-rival-state').empty();
		$('#game-self-state').empty();
		
		var arrT = [];
		arrT.push('<table class="gaming">');
		for(var i = 1; i < 7; i ++){
			arrT.push('<tr>');
			for(var j = 1; j < 7; j ++){
				g.nodes.push(new P(j, i));
				arrT.push('	<td id="d_' + j + '_' + i + '">');
				arrT.push(' </td>');
			}
			arrT.push('</tr>');
		}
		arrT.push('</table>');
		$('#gameboard').html(arrT.join(''));
		
		for(var i = 0, l = data.length; i < l; i ++){
			$('#d_' + data[i].x + '_' + data[i].y).html('<img src="../images/headpic/g02.jpg" title="' + data[i].side + '_' + data[i].chess + '" />');
		}
		var self = this;
		$('#gameboard td').unbind().click(function(e){
			e.preventDefault();
			var arr = this.id.split('_');
			var p = g.findP(arr[1], arr[2]);
			p.onClick();
		});
	}
	
	function turn(data){
		$('#game-rival-state').empty();
		$('#game-self-state').empty();
		if(g.side == data.side){			
			$('#game-self-state').html(data.seconds);
		} else {
			$('#game-rival-state').html(data.seconds);
		}
	}
	
	function onCheck(data){
		$('#gameboard td').removeClass();
		var p = g.findP(data.x, data.y);
		p.chess = data.c;
		p.side = data.s;
		p.v = true;
		$('#d_' + data.x + '_' + data.y + ' img').attr('src', '../images/src/' + data.s + '_' + data.c + '.png');
	}
	
	function onSelect(data){
		$('#gameboard td').removeClass();
		var p = g.findP(data.x, data.y);
		p.selected();
	}
	
	function onMove(data){
		$('#gameboard td').removeClass();
		var p1 = g.findP(data.x, data.y);
		var p2 = g.findP(data.to_x, data.to_y);
		$('#' + p2.id).html('<img src="../images/src/' + p1.side + '_' + p1.chess + '.png" title="' + p1.side + '_' + p1.chess + '" />');
		$('#' + p1.id).html('');
		p2.chess = p1.chess;
		p2.side = p1.side;
		p1.clear();
	}
	
	function onOver(data){
		if(data.winSide == g.side){
			$('#game-rival-state').html('失败');
			$('#game-self-state').html('胜利');
		} else {
			$('#game-rival-state').html('胜利');
			$('#game-self-state').html('失败');
		}
		$('#ready').show();
		g.nodes = [];
	}
	
	function onLeave(data){
		if(data.id == g.rivalId){
			reset();
			$('#Game').show();	
			$('#game-waitting').html('正在配桌 ...').show();
			$('#game-main').hide();
		}
	}
	
	return {		
		userid : '',
		side : '',
		nodes : [],
		rivalId: '',
		
		init: function(){
			init();
		},
		
		findP: function(x, y){
			for(var i = 0, l = g.nodes.length; i < l;i ++){
				if(g.nodes[i].id == 'd_' + x + '_' + y){
					return g.nodes[i];
				}
			}
		},
		
		on: function(status, data){
			switch(status){
				case 'msg':
					break;
				case 'join':
					break;
				case 'closed':
					reset();
					$('#Connecting').html('<p>连接服务器失败</p>').show();
					break;
				case 'connected':
					reset();
					$('#Connecting').html('<p>已连接服务器 ...</p>').show();
					break;
				case 'assigning':
					reset();
					$('#Game').show();	
					$('#game-waitting').html('正在配桌 ...').show();
					$('#game-main').hide();
					
					g.userid = data;
					break;
				case 'desks-users':
					break;
				case 'sitdown':
					initGameBoard(data);
					break;
				case 'chat':
					break;
				case 'ready':
					if(data == g.userid){	
						$('#ready').hide();
						$('#draw').hide();
						$('#lost').hide();
						$('#game-self-state').html('准备');
					} else {
						$('#game-rival-state').html('准备');
					}
					break;
				case 'game':
					game(data);
					break;
				case 'turn':
					turn(data);
					break;
				case 'check':
					onCheck(data);
					break;
				case 'select':
					onSelect(data);
					break;
				case 'move':
					onMove(data);
					break;
				case 'over':
					onOver(data);
					break;
				case 'leave':
					onLeave(data);
					break;
			}
		}
	}
})();

$(document).ready(function(){	
	g.init();
});
