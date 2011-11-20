
var connections = [];
var users = [];

function User(conn, username){
	this.conn = conn;
	this.username = username;
	this.win = 0;
	this.lost = 0;
	
	this.desk = 0;
	this.status = '';
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
	var u;
	users.forEach(function(user){
		if(user.conn == conn){
			u = user;
		}
	});
	users.splice(users.indexOf(u), 1);
}
