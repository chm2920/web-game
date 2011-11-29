
var D = {
	load: function(){
		var files = ['util', 'lobby', 'user'];
		var arrT = [];
		for(var i = 0, l = files.length; i < l; i ++){
			arrT.push('<script type="text/javascript" src="js/' + files[i] + '.js"></script>');
		}
		$('head').append(arrT.join(''));
	},
	
	init: function(){
		this.setDesks();
		this.setGameTable();
		this.bind();
	},
	
	bind: function(){
		var self = this;
		$('#doReady').click(function(){
			$('#doReady').hide();
			$('#doLeave').hide();
			$('#doLost').show();
			$('#doPeace').show();
		});
		$('#doLeave').click(function(){
			User.getUp();
		});
		$('#doPeace').click(function(){
			self.showDesks();
		});
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
			Lobby.send(data);
		})
	},
	
	info: function(type, msg){
		var txt = $('#chatList').val();
		$('#chatList').val(txt + '> ' + type + ' : ' + msg + '\n');
	},
	
	debug: function(msg){
		var arrT = [];
		for(var t in msg){
			arrT.push(t);
			arrT.push(': ');
			arrT.push(msg[t]);
			arrT.push('\n');
		}
		$('#debugInfo').val(arrT.join(''));
	},
	
	showDesks: function(){
		$('#desks').animate({
			'left': '0'
		});
		$('#board').animate({
			'left': '720px',
		});
	},
	showBoard: function(){
		$('#desks').animate({
			'left': '-720px'
		});
		$('#board').animate({
			'left': '0',
		});
		$('#doReady').show();
		$('#doLeave').show();
		$('#doLost').hide();
		$('#doPeace').hide();
	},
	
	setDesks: function(){
		var arrT = [];
		for(var i = 1; i < 16; i ++ ){
			arrT.push('<li id="desk' + i + '">');
			arrT.push('	<div class="L">');
			arrT.push('	<i></i>');
			arrT.push('	<p></p>');
			arrT.push('	</div>');
			arrT.push('	<span>' + i + '</span>');
			arrT.push('	<div class="R">');
			arrT.push('	<i></i>');
			arrT.push('	<p></p>');
			arrT.push('	</div>');
			arrT.push('</li>');
		}
		$('#desks').empty().html(arrT.join(''));
		$('#desks i').click(function(){
			var p = $(this).parent();
			var deskno = p.parent().attr('id').replace('desk', '');
			var side = p[0].className;
			User.sitAt(deskno, side);
		});
	},	
	setGameTable: function(){
		var arrT = [];
		for(var i = 1; i < 7; i ++){
			arrT.push('<tr>');
			for(var j = 1; j < 7; j ++){
				arrT.push('	<td>');
				arrT.push(' </td>');
			}
			arrT.push('</tr>');
		}
		$('#gameTB').empty().html(arrT.join(''));
	},
	
	setUserList: function(){
		var userList = Lobby.userList;
		var users = [];
		$('#desks p').empty();
		for(var u in userList){
			var arr = userList[u];
			var win = arr[0], lost = arr[1], deskno = arr[2], side = arr[3];
			if(deskno == 0){
				users.push(u + ' : ' + win + ' / ' + lost);
			} else {
				users.push(u + ' : ' + win + ' / ' + lost + ' at ' + deskno + ' ' + side);
			}			
			if(deskno != 0 && (side == 'L' || side == 'R')){
				$('#desk' + deskno + ' .' + side + ' p').text(u);
			}
		}
		$('#userList').empty().html(users.join('\n'));
	},
	
	setUserName: function(){
		$('#username').text(User.username);
		$('#win').text(User.win);
		$('#lost').text(User.lost);
		$('#status').text(User.status);
		$('#d_username').text(User.dUsername);
		$('#d_win').text(User.dWin);
		$('#d_lost').text(User.dLost);
		$('#d_status').text(User.dStatus);
		$('#uInfo').show();
	}
};

D.load();

$(document).ready(function(){
	D.init();
	Lobby.connect();
});

$(window).unload(function(){
	
});