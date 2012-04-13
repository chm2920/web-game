

exports = module.exports = Lobby;


var User = require('./game/user')
	, Desk = require('./game/desk')
	, Game = require('./game/game');

	
function Lobby(manager){
	this.manager = manager;
	
	this.users = [];
	this.desks = [];
	
	this.timer = null;
	
	for(var i = 0; i < 15; i ++){
		this.desks.push(new Desk(manager, i + 1));
	}
	
	this.heartBeat();
}

var log = function(msg){
	console.log('=================');
	console.log(msg);
	// console.log('\n');
}
	
Lobby.prototype.sendMsg = function(id, msg){
	var transport = this.manager.transports[id];
	msg = JSON.stringify(msg);
	try{
		transport.write(msg);
	} catch(e) {
		console.log('error: ', msg);
	}
}

Lobby.prototype.heartBeat = function(){
	var self = this;
	setInterval(function(){
			var response = {};
			response['type'] = 'msg';
			response['action'] = 'users';
			var hsh = {};
			self.users.forEach(function(user){
				hsh[user.username] = [user.win, user.lost, user.deskno, user.side];
			});
			response['data'] = hsh;
			self.broadcast(response);
		}, 1000);
		
	setInterval(function(){
			var response = {};
			response['type'] = 'msg';
			response['action'] = 'desks';
			var hsh = {};
			self.desks.forEach(function(desk){
				hsh[desk.no] = [desk.L, desk.R, desk.status];
			});
			response['data'] = hsh;
			self.broadcast(response);
		}, 3000);
}

Lobby.prototype.except = function(id, msg){
	for(var t in this.manager.transports){
		if(t != id){
			msg = JSON.stringify(msg);
			this.manager.transports[t].write(msg);
		}
	}
}

Lobby.prototype.broadcast = function(msg){
	msg = JSON.stringify(msg);
	for(var t in this.manager.transports){
		this.manager.transports[t].write(msg);
	}
}

Lobby.prototype.findUser = function(id){
	for(var i = 0, l = this.users.length; i < l; i ++){
		if(this.users[i].id == id){
			return this.users[i];
		}
	}
	return null;
}

Lobby.prototype.getUInfo = function(data){
	var username = data.addr.replace(/\./g, '_') + '_' + (function(){
			var date = new Date();
			return date.getHours() + '_' + date.getMinutes() + '_' + Math.round(Math.random() * 1000);
		})();
	username = username.replace(/_/g, '');
	
	this.users.push(new User(data.id, username));
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'tip';
	response['data'] = username + ' join in ';
	this.except(data.id, response);
	console.log('connect: ', data.addr);
	response = {};
	response['type'] = 'msg';
	response['action'] = 'mine';
	response['data'] = {
		'username': username
	};
	this.sendMsg(data.id, response);
}

Lobby.prototype.leaveDesk = function(user){
	if(user.deskno != 0){
		var desk = this.desks[user.deskno-1];
		var otherSide;
		desk[user.side] = null;
		if(user.side == 'L'){
			otherSide = 'R';
		} else {
			otherSide = 'L';
		}
		if(desk[otherSide] != ''){
			desk.status = 1;
		} else {
			desk.status = 0;
		}
		desk.connections[user.side] = '';
		desk.game && desk.game.inter && clearInterval(desk.game.inter);
	}
}

Lobby.prototype.logout = function(id){
	var u = this.findUser(id);
	this.leaveDesk(u);
	this.users.splice(this.users.indexOf(u), 1);
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'getup';
	response['data'] = {
		'username': u.username,
		'deskno': u.deskno,
		'side': u.side
	};
	this.broadcast(response);
}

Lobby.prototype.sit = function(id, deskno, side){
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'sit';
	var user = this.findUser(id);
	var desk = this.desks[deskno-1];
	if(desk.status > 2 || desk[side] != null){		
		response['data'] = {
			'suc': '-1'
		};
		this.sendMsg(id, response);
	} else {
		this.leaveDesk(user);
		user.deskno = deskno;
		user.side = side;
		desk[side] = user;
		desk.status += 1;
		desk.connections[side] = id;
		response['data'] = {
			'username': user.username,
			'deskno': deskno,
			'side': side,
			'suc': desk.status
		};
		this.broadcast(response);
	}
}

Lobby.prototype.getup = function(id){
	var u = this.findUser(id);
	this.leaveDesk(u);
	u.deskno = 0;
	u.side = '';
	u.status = '';
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'getup';
	response['data'] = {
		'username': u.username,
		'deskno': u.deskno,
		'side': u.side,
		'suc': '1'
	};
	this.broadcast(response);
}

Lobby.prototype.ready = function(id){
	var u = this.findUser(id);
	var desk = this.desks[u.deskno-1];
	var otherSide = (u.side == 'L'? 'R' : 'L');
	var d = desk[otherSide];
	var response = {};
	if(d){
		if(d.status == 'ready'){
			u.status = 'game';
			d.status = 'game';
			desk.game = new Game(desk);
			desk.game.init();			
			response['type'] = 'msg';
			response['action'] = 'game';
			response['data'] = desk.game.ps;
		} else {
			u.status = 'ready';
			response['type'] = 'msg';
			response['action'] = 'ready';
			response['data'] = {
				'username': u.username
			};
		}	
		desk.broadcast(response);
	} else {
		u.status = 'ready';
		response['type'] = 'msg';
		response['action'] = 'ready';
		this.sendMsg(id, response);
	}
}

Lobby.prototype.random = function(id){
	var u = this.findUser(id);
	var desk = this.desks[u.deskno-1];
	desk.game.random();
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'game';
	response['data'] = desk.game.ps;
	desk.broadcast(response);
}

Lobby.prototype.check = function(id, data){
	var u = this.findUser(id);
	var desk = this.desks[u.deskno-1];
	var game = desk.game;
	// check turn
	if(game.turn != u.side){
		return;
	}
	var p = game.p(data.x, data.y);
	var d;
	
	var response = {};
	response['type'] = 'msg';
	// unopen -> open
	// open -> opened
	if(p.v == 'f'){
		p.v = 't';
		response['action'] = 'check';
		d = {
			x: data.x,
			y: data.y,
			s: p.side,
			c: p.chess
		};
		game.next();
	} else {
		if(u.check && u.check.canEat(p)){
			response['action'] = 'move';
			d = {
				x: u.check.x,
				y: u.check.y,
				to_x: data.x,
				to_y: data.y,
				s: p.side,
				c: p.chess,
			};
			p.chess = u.check.chess;
			p.side = u.check.side;
			u.check.chess = null;
			u.check.side = null;
			u.check = null;
			game.next();
		} else {
			if(p.chess != '' && p.side == u.side){
				console.log(p.chess);
				console.log(p.side);
				console.log(u.side);
				response['action'] = 'op';
				d = {
					x: data.x,
					y: data.y,
					s: p.side,
					c: p.chess
				};
				u.check = p;
			} else {
				return;
			}			
		}
	}
	response['data'] = d;
	desk.broadcast(response);	
}

Lobby.prototype.move = function(id, data){
	var u = this.findUser(id);
	var desk = this.desks[u.deskno-1];
	var game = desk.game;
}

Lobby.prototype.game = function(id){
	var u = this.findUser(id);
	var desk = this.desks[u.deskno-1];
	var game = desk.game;
}
