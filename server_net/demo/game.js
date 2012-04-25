

exports = module.exports = Game;

var P = require('../demo/p');

function Game(desk){
	this.ps = [];
	this.turn = '';
	
	this.desk = desk;
	this.inter = null;
}

Game.prototype.init = function(){
	this.random();
	this.turn = (Math.round(Math.random()) == 1) ? 'L' : 'R';
	this.run();
}

Game.prototype.random = function(){
	this.ps = [];
	var p, s, cs = [];
	for(var i = 0; i < 6; i ++){
		cs.push(1);
	}
	for(var i = 0; i < 4; i ++){
		cs.push(2);
	}
	for(var i = 0; i < 4; i ++){
		cs.push(3);
	}
	for(var i = 0; i < 2; i ++){
		cs.push(4);
	}
	cs.push(5);
	cs.push(6);
	
	for(var i = 0, m = 0, n = 0; i < 36;i ++){
		if(i % 2 == 0){
			p = new P('L', cs[m++]);
		} else {
			p = new P('R', cs[n++]);
		}
		this.ps.push(p);
	}
	this.ps = this.ps.sort(function(){
		return Math.round(Math.random());
	});
	for(var i = 0; i < 6; i ++){
		for(var j = 0; j < 6; j ++){
			s = this.ps[i * 6 + j];
			s.x = i + 1;
			s.y = j + 1;
		}
	}
}

Game.prototype.p = function(x, y){
	var p;
	for(var i = 0; i < 36; i ++){
		p = this.ps[i];
		if(p.x == x && p.y == y){
			return p;
		}
	}
}

Game.prototype.run = function(){
	var self = this;
	var seconds = 30;
	this.inter = setInterval(function(){
		if(seconds == 0){
			self.over();
			return;
		}
		seconds -= 1;
		var response = {
			'type': 'turn',
			'data': {
				'side': self.turn,
				'seconds': seconds
			}
		};
		self.desk.broadcast(response);
	}, 1000);
}

Game.prototype.next = function(){
	clearInterval(this.inter);
	this.turn = (this.turn == 'L' ? 'R' : 'L');
	this.run();
}

Game.prototype.over = function(){
	clearInterval(this.inter);
	var desk = this.desk;
	desk.status = 5;
	
	var winSide, lostSide, user;
	if(this.turn == 'L'){
		winSide = 'R';
		lostSide = 'L';
	} else {
		winSide = 'L';
		lostSide = 'R';
	}
	user = desk[winSide];
	user.win += 1;
	user.status = '';
	user = desk[lostSide];
	user.lost += 1;
	user.status = '';
	
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'over';
	response['data'] = {
		'side': winSide
	};
	desk.broadcast(response);
}
