
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
	for(var i = 0, l = users.length; i < l; i ++){
		if(users[i].conn == conn){
			return users[i];
		}
	}
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

exports.sendMsg = function(conn, msg){
	conn.write("\u0000", "binary");
	conn.write(msg, 'utf8');
	conn.write("\uffff", "binary");
}

exports.deskMsg = function(){
	
}

exports.logout = function(conn){
	connections.splice(connections.indexOf(conn), 1);
	var u = User.find(conn);
	users.splice(users.indexOf(u), 1);
}

exports.sit = function(conn, desk, side){
	var u, user, re = 1;
	for(var i = 0, l = users.length; i < l; i ++){
		user = users[i];
		if(user.desk == desk){
			if(user.side == side){				
				return -1; // have sit someone
			} else {
				if(user.conn != conn){
					re += 1;					
				}
			}
		}
		if(user.conn == conn){
			u = user;
		}
	}
	u.desk = desk;
	u.side = side;
	return re;
}

exports.getup = function(conn){
	var u = User.find(conn);
	var desk = u.desk;
	u.desk = 0;
	u.side = '';
	u.status = '';
	for(var i = 0, l = users.length; i < l; i ++){
		if(users[i].desk == desk){
			return users[i].conn;
		}
	}
	return false;
}
