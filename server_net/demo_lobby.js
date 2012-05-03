

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

Lobby.prototype.findDesk = function(no){
	for(var i = 0, l = this.desks.length; i < l; i ++){
		if(this.desks[i].no == no){
			return this.desks[i];
		}
	}
	return null;
}


//actions 

Lobby.prototype.userLogin = function(data){
	var u = new User(data.id, data.data.data);
	this.users.push(u);
	var response = {
		'type': 'join',
		'data': data.data.data
	};
	this.except(data.id, response);
	response = {
		'type': 'assigning',
		'data': u.id
	};
	this.sendMsg(data.id, response);
	this.assign(u);
}

Lobby.prototype.assign = function(u){
	for(var i = 0, l = this.users.length; i < l; i ++){
		if(this.users[i].status == 'waiting' && this.users[i].id != u.id){
			var desk = new Desk(this.manager, Math.abs(Math.random() * Math.random() * Date.now() | 0).toString() + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString());
			this.desks.push(desk);
			desk.L = this.users[i].id;
			desk.R = u.id;
			this.users[i].status = 'pending';
			this.users[i].deskno = desk.no;
			this.users[i].side = 'L'
			u.status = 'pending';
			u.deskno = desk.no;
			u.side = 'R'
			var response = {
				'type': 'sitdown',
				'data': {
					'L': {
						'id': this.users[i].id,
						'username': this.users[i].username
					},
					'R': {
						'id': u.id,
						'username': u.username
					}
				}
			};
			desk.broadcast(response);
			break;
		}
	}	
}

Lobby.prototype.logout = function(id){
	var u = this.findUser(id);	
	if(u){
		this.users.splice(this.users.indexOf(u), 1);
		if(u.deskno){
			var desk = this.findDesk(u.deskno);
			if(desk){
				if(desk.game && desk.game.inter){
					clearInterval(desk.game.inter);
					var r;
					if(desk.L == u.id){
						r = this.findUser(desk.R);
					} else {
						r = this.findUser(desk.L);
					}
					r.status = 'waiting';
					r.deskno = '';
					r.side = '';
					r.win += 1;
				}
				this.desks.splice(this.desks.indexOf(desk), 1);
			}
		}
		var response = {
			'type': 'leave',
			'data': {
				'id': u.id,
				'username': u.username
			}
		};
		this.broadcast(response);
	}
}

Lobby.prototype.chat = function(data){
	var u = this.findUser(data.id),
		desk = this.findDesk(u.deskno);
	if(desk){
		var response = {
			'type': 'chat',
			'data': {
				'username': u.username,				
				'msg': data.data.data
			}
		};
		desk.broadcast(response);
	}
}

Lobby.prototype.ready = function(id){
	var u = this.findUser(id),
		desk = this.findDesk(u.deskno),
		otherSide = (u.side == 'L'? 'R' : 'L'),
		rival = this.findUser(desk[otherSide]),
		response = {};
		
	if(rival){
		if(rival.status == 'ready'){
			u.status = 'game';
			rival.status = 'game';
			desk.game = new Game(desk);
			desk.game.init();
			response = {
				'type': 'game',
				'data': desk.game.ps
			}
		} else {
			u.status = 'ready';
			response = {
				'type': 'ready',
				'data': u.id
			}
		}	
		desk.broadcast(response);
	}
}

Lobby.prototype.check = function(id, data){
	var u = this.findUser(id),
		desk = this.findDesk(u.deskno),
		game = desk.game;
	// check turn
	if(game.turn != u.side){
		return;
	}
	var p = game.p(data.x, data.y),
		response = {};
	// unopen -> open
	// open -> opened
	if(p.v == 'f'){
		response = {
			'type': 'check',
			'data': {
				x: data.x,
				y: data.y,
				s: p.side,
				c: p.chess
			}
		};
		p.v = 't';
		game.next();
	} else {
		if(u.check && u.check.canEat(p)){
			response = {
				'type': 'move',
				'data': {
					x: u.check.x,
					y: u.check.y,
					to_x: data.x,
					to_y: data.y,
					s: p.side,
					c: p.chess
				}
			};
			p.chess = u.check.chess;
			p.side = u.check.side;
			u.check.chess = null;
			u.check.side = null;
			u.check = null;
			game.next();
		} else {
			if(p.chess != '' && p.side == u.side){
				response = {
					'type': 'select',
					'data': {
						x: data.x,
						y: data.y,
						s: p.side,
						c: p.chess
					}
				};
				u.check = p;
			} else {
				return;
			}			
		}
	}
	desk.broadcast(response);	
}
