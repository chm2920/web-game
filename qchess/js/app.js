
function P(x, y){
	this.id = 'd_' + x + '_' + y;
	this.x = x;
	this.y = y;
	this.side = null;
	this.chess = null;
	this.v = false;
}

P.find = function(x, y){
	for(var i = 0, l = D.nodes.length; i < l;i ++){
		if(D.nodes[i].id == 'd_' + x + '_' + y){
			return D.nodes[i];
		}
	}
}

P.prototype = {
	getSbilings: function(){
		var arr = [], ps = [], p;
		if(this.x != 1){
			p = P.find(this.x - 1, this.y);
			ps.push(p);
		}
		if(this.x != 6){
			p = P.find(this.x + 1, this.y);
			ps.push(p);
		}
		if(this.y != 1){
			p = P.find(this.x, this.y - 1);
			ps.push(p);
		}
		if(this.y != 6){
			p = P.find(this.x, this.y + 1);
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
			$('#' + arr[i].id).addClass('op');
		}
		$('#' + this.id).addClass('selected');
	},
	click: function(){
		User.check({x: this.x, y: this.y});
	},
	clear: function(){
		this.side = null;
		this.chess = null;		
	}
}

var D = {
	nodes: [],
	load: function(){
		var files = ['util', 'lobby', 'user', 'manager'];
		var arrT = [];
		for(var i = 0, l = files.length; i < l; i ++){
			arrT.push('<script type="text/javascript" src="js/' + files[i] + '.js"></script>');
		}
		$('head').append(arrT.join(''));
	},
	
	init: function(){
		this.dAlert = $('#splider');
		this.dTimeout = $('#timeout');
		this.dDTimeout = $('#d_timeout');
		
		this.setDesks();
		this.setGameTable();
		this.bind();
	},
	
	bind: function(){
		var self = this;
		$('#doReady').click(function(){
			User.ready();
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
		});
		$('#doRandom').click(function(){
			User.random();
		});
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
			arrT.push(msg[t].join('-'));
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
				this.nodes.push(new P(j, i));
				arrT.push('	<td id="d_' + j + '_' + i + '">');
				arrT.push(' </td>');
			}
			arrT.push('</tr>');
		}
		$('#gameTB').empty().html(arrT.join(''));
	},
	
	setUserList: function(){
		var userList = Manager.userList;
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
	},
	
	showPs: function(data){
		this.dAlert.html('Beginning').show().delay(200).fadeOut();
		for(var i = 0, l = data.length; i < l; i ++){
			$('#d_' + data[i].x + '_' + data[i].y).html('<img src="images/headpic/g02.jpg" title="' + data[i].side + '_' + data[i].chess + '" width="80" height="80">');
		}
		var self = this;
		$('#gameTB td').click(function(e){
			//e.preventDefault();
			//e.stopPropration();
			self.clickNode(this);
		});
		// for(var i = 0; i < 6; i ++ ){
			// for(var j = 0; j < 6; j ++){
				// $('#d_' + j + '_' + i).html('<img src="/images/headpic/g02.jpg" width="80" height="80">');
			// }
		// }
	},
	
	clickNode: function(node){
		var arr = $(node).attr('id').split('_');
		var p = P.find(arr[1], arr[2]);
		p.click();
	},
	
	check: function(data){
		this.removeSelected();
		var p = P.find(data.x, data.y);
		p.chess = data.c;
		p.side = data.s;
		p.v = true;
		$('#d_' + data.x + '_' + data.y + ' img').attr('src', 'images/src/' + data.s + '_' + data.c + '.png');
	},
	
	selected: function(data){
		this.removeSelected();
		var p = P.find(data.x, data.y);
		p.selected();		
	},
	
	removeSelected: function(){
		$('#gameTB td').removeClass();
	},
	
	move: function(data){
		var p1 = P.find(data.x, data.y);
		var p2 = P.find(data.to_x, data.to_y);
		this.removeSelected();
		$('#' + p2.id).html('<img src="images/src/' + p1.side + '_' + p1.chess + '.png" title="' + p1.side + '_' + p1.chess + '" width="80" height="80">');
		$('#' + p1.id).html('');
		p2.chess = p1.chess;
		p2.side = p1.side;
		p1.clear();
	},
	
	showTurn: function(data){
		this.dTimeout.hide();
		this.dDTimeout.hide();
		if(User.side == data.side){			
			this.dTimeout.text(data.seconds).show().addClass(data.side);
		} else {
			this.dDTimeout.text(data.seconds).show().addClass(data.side);
		}
	},
	
	showResult: function(data){
		var winner;
		if(data.side == User.side){
			winner = User.username;
			User.win += 1;
			User.dLost += 1;
		} else {
			winner = User.dUsername;
			User.dWin += 1;
			User.lost += 1;
		}
		User.status = '';
		User.dStatus = '';
		this.dAlert.html('winner is ' + winner).fadeIn().delay(3000).fadeOut();
		this.reset();
	},
	
	reset: function(){
		this.setUserName();
		$('#doReady').show();
		$('#doLeave').show();
		$('#doLost').hide();
		$('#doPeace').hide();
	}
};

D.load();

$(document).ready(function(){
	D.init();
	Lobby.connect();
});

$(window).unload(function(){
	
});