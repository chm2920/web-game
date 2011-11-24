
var connections = [];
var users = [];

function User(conn, username){
	this.conn = conn;
	this.username = username;
	this.win = 0;
	this.lost = 0;
	
	this.desk = 0;
	this.side = '';
	this.status = '';
}

User.find = function(conn){
	users.forEach(function(user){
		if(user.conn == conn){
			return user;
		}
	});
	return null;
}

function except(conn, msg){
	connections.forEach(function(connection){
		if(connection != conn){
			connection.write("\u0000", "binary");
			connection.write(msg, 'utf8');
			connection.write("\uffff", "binary");
		}
	});
}

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
	var response = {};
	response['type'] = 'msg';
	response['action'] = 'tip';
	response['data'] = username + ' join in ';
	except(conn, JSON.stringify(response));
	console.log('connect: ', addr);
	return username;
}

exports.broadcast = function(msg){
	connections.forEach(function(connection){
		connection.write("\u0000", "binary");
		connection.write(msg, 'utf8');
		connection.write("\uffff", "binary");
	});
}

exports.logout = function(conn){
	connections.splice(connections.indexOf(conn), 1);
	var u = User.find(conn);
	users.splice(users.indexOf(u), 1);
}

exports.sit = function(conn, desk, side){
	var u;
	for(var i = 0, l = users.length; i < l; i ++){
		var user = users[i];
		if(user.desk == desk && user.side == side){
			return -1;
		}
		if(user.conn == conn){
			u = user;
		}		
	}
	if(u){
		u.desk = desk;
		u.side = side;
		return 1;		
	} else {
		return -2;
	}
}
