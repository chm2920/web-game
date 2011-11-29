
var connections = [];
var users = [];
var desks = [];

var response = {}, timer;

function User(conn, username){
	this.conn = conn;
	this.username = username;
	this.win = 0;
	this.lost = 0;
	
	this.deskno = 0;
	this.side = '';
	this.status = '';
}

User.find = function(conn){
	for(var i = 0, l = users.length; i < l; i ++){
		if(users[i].conn == conn){
			return users[i];
		}
	}
	return null;
}

function Desk(no){
	this.no = no;
	this.L = '';
	this.R = '';
	this.status = 0;
	this.connections = {};
}

for(var i = 0; i < 15; i ++){
	desks.push(new Desk(i + 1));
}

Desk.find = function(no){
	return desks[no-1];
}

Desk.prototype = {
	broadcast : function(data){
	}
}
	
function sendMsg(conn, msg){
	msg = JSON.stringify(msg);
	conn.write("\u0000", "binary");
	conn.write(msg, 'utf8');
	conn.write("\uffff", "binary");
}

function except(conn, msg){
	connections.forEach(function(connection){
		if(connection != conn){
			msg = JSON.stringify(msg);
			connection.write("\u0000", "binary");
			connection.write(msg, 'utf8');
			connection.write("\uffff", "binary");
		}
	});
}

function broadcast(msg){
	msg = JSON.stringify(msg);
	connections.forEach(function(connection){
		connection.write("\u0000", "binary");
		connection.write(msg, 'utf8');
		connection.write("\uffff", "binary");
	});
}

function leaveDesk(user){
	if(user.deskno != 0){
		var desk = Desk.find(user.deskno);
		var otherSide;
		desk[user.side] = '';
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
	}
}

setInterval(function(){
		response = {};
		response['type'] = 'msg';
		response['action'] = 'users';
		var hsh = {};
		users.forEach(function(user){
			hsh[user.username] = [user.win, user.lost, user.deskno, user.side];
		});
		response['data'] = hsh;
		broadcast(response);
	}, 1000);
	
setInterval(function(){
		response = {};
		response['type'] = 'msg';
		response['action'] = 'desks';
		var hsh = {};
		desks.forEach(function(desk){
			hsh[desk.no] = [desk.L, desk.R, desk.status];
		});
		response['data'] = hsh;
		broadcast(response);
	}, 3000);

exports.connections = connections;
exports.users = users;

exports.join = function(conn){	
	var addr = conn.remoteAddress;
	var username = addr.replace(/\./g, '_') + '_' + (function(){
			var date = new Date();
			return date.getHours() + '_' + date.getMinutes() + '_' + Math.round(Math.random() * 1000);
		})();
	username = username.replace(/_/g, '');
	users.push(new User(conn, username));
	response = {};
	response['type'] = 'msg';
	response['action'] = 'tip';
	response['data'] = username + ' join in ';
	except(conn, response);
	console.log('connect: ', addr);
}

exports.logout = function(conn){
	connections.splice(connections.indexOf(conn), 1);
	var u = User.find(conn);
	leaveDesk(u);
	users.splice(users.indexOf(u), 1);
	response = {};
	response['type'] = 'msg';
	response['action'] = 'getup';
	response['data'] = {
		'username': u.username,
		'deskno': u.deskno,
		'side': u.side,
		'suc': '1'
	};
	broadcast(response);
}

exports.getUInfo = function(conn){
	var user = User.find(conn);
	response = {};
	response['type'] = 'msg';
	response['action'] = 'mine';
	response['data'] = {
		'username': user.username
	};
	sendMsg(conn, response);
}

exports.deskMsg = function(){
	
}

exports.sit = function(conn, deskno, side){
	response = {};
	response['type'] = 'msg';
	response['action'] = 'sit';
	var user = User.find(conn);
	var desk = Desk.find(deskno);
	if(desk.status > 2 || desk[side] != ''){		
		response['data'] = {
			'suc': '-1'
		};
		sendMsg(conn, response);
	} else {
		leaveDesk(user);
		user.deskno = deskno;
		user.side = side;
		desk[side] = user.username;
		desk.status += 1;
		desk.connections[side] = conn;
		response['data'] = {
			'username': user.username,
			'deskno': deskno,
			'side': side,
			'suc': desk.status
		};
		broadcast(response);
	}
}

exports.getup = function(conn){
	var u = User.find(conn);
	leaveDesk(u);
	u.deskno = 0;
	u.side = '';
	u.status = '';
	response = {};
	response['type'] = 'msg';
	response['action'] = 'getup';
	response['data'] = {
		'username': u.username,
		'deskno': u.deskno,
		'side': u.side,
		'suc': '1'
	};
	broadcast(response);
}

