
var connections = [];
var users = [];

exports.connections = connections;
exports.users = users;

exports.broadcast = function(msg){
	connections.forEach(function(connection){
		connection.write("\u0000", "binary");
		connection.write(msg, 'utf8');
		connection.write("\uffff", "binary");
	});
}

exports.except = function(conn, msg){
	connections.forEach(function(connection){
		if(connection != conn){
			connection.write("\u0000", "binary");
			connection.write(msg, 'utf8');
			connection.write("\uffff", "binary");
		}
	});
}

exports.logout = function(conn){
	var addr = conn.remoteAddress;
	var username = addr.replace(/\./g, '_');
	users.splice(users.indexOf(username), 1);
	connections.splice(connections.indexOf(conn), 1);
}
