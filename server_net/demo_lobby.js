

exports = module.exports = Lobby;


var User = require('./demo/user')
	, Desk = require('./demo/desk')
	, Game = require('./demo/game');

	
function Lobby(){
	this.manager = {};
	
	this.users = [];
	this.desks = [];
	
	this.timer = null;
	
	this.heartBeat();
}

var log = function(msg){
	console.log('=================');
	console.log(msg);
}
	
Lobby.prototype.sendMsg = function(id, msg){
	msg = JSON.stringify(msg);
	try{
		this.manager[id].write(msg);
	} catch(e) {
		console.log('error: ', msg);
	}
}

Lobby.prototype.heartBeat = function(){
	var self = this;		
	setInterval(function(){
			var response = {};
			response['type'] = 'desks-users';
			var hsh = {
				'desks': {},
				'users': {}
			};
			self.users.forEach(function(u){
				hsh['users'][u.id] = {
					sn: u.username,
					w: u.win,
					d: u.draw,
					l: u.lost, 
					n: u.deskno, 
					s: u.side
				};
			});
			self.desks.forEach(function(desk){
				hsh['desks'][desk.no] = {
					L: hsh['users'][desk.L].sn, 
					R: hsh['users'][desk.R].sn, 
					s: desk.status
				};
			});
			response['data'] = hsh;
			self.broadcast(response);
		}, 1000);
}

Lobby.prototype.except = function(id, msg){
	for(var t in this.manager){
		if(t != id){
			msg = JSON.stringify(msg);
			this.manager[t].write(msg);
		}
	}
}

Lobby.prototype.broadcast = function(msg){
	msg = JSON.stringify(msg);
	for(var t in this.manager){
		try{
			this.manager[t].write(msg);
		} catch(e){
			// delete users[t]
		}
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


//actions 

Lobby.prototype.userLogin = function(data){
	var u = new User(data.id, data.data.data);
	this.users.push(u);
	var response = {};
	response['type'] = 'msg';
	response['data'] = data.data.data + ' join in ';
	this.except(data.id, response);
	response = {};
	response['type'] = 'assigning';
	response['data'] = this.users.length;
	this.sendMsg(data.id, response);
	this.assign(u);
}

Lobby.prototype.assign = function(u){
	for(var i = 0, l = this.users.length; i < l; i ++){
		if(this.users[i].status == 'waiting' && this.users[i].id != u.id){
			this.users[i].status = 'pending';
			u.status = 'pending';
			var desk = new Desk(this.manager, Math.abs(Math.random() * Math.random() * Date.now() | 0).toString() + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString());
			this.desks.push(desk);
			desk.L = this.users[i].id;
			desk.R = u.id;
			response = {};
			response['type'] = 'sitdown';
			response['data'] = {
				'L': this.users[i].username,
				'R': u.username
			};
			desk.broadcast(response);
			break;
		}
	}	
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
