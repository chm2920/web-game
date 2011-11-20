
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var util = require('util');

var lobby = require('./lobby');

var assert = require('assert');

var PORT = 27688;

var log = function(msg){
	console.log('=================');
	console.log(msg);
	// console.log('\n');
}

var err_head = function(msg){
	assert.throws(
		function(){
			throw new Error("Wrong value");
		},
		function(err){
			if((err instanceof Error) && /value/.test(err)){
				return true;
			}
		},
		msg
	);
	// throw {name: 'WrongRequestError', message: msg};
};

var handshake = function(sock, data){
	var parse = function(raw_head){
		function err(){
			err_head('Invalid request headers!');
		}
		
		function is_nil(s){return !s;}
		
		var raw = raw_head.split('\r\n');
		var headers = {};
		
		var request_line = raw.shift().split(' '),
			method = request_line[0], path = request_line[1];
		if(request_line.length !== 3 && method !== 'GET'){
			err();
		}
		
		raw.pop();
		
		if(raw.pop() !== '' || raw.length){
			err();
		}
		
		var re = /(^[^:]+)(:\s)(.*)$/;
		raw.forEach(function(line, i){
			var m = line.match(re);
			if(m.length !== 4 || !m[1])
				err();
			headers[m[1].toLowerCase()] = m[3];
		});
		
		if([headers.host, headers.origin].some(is_nil)){
			err();
		}
		return {
			headers: headers,
			url: path
		}
	};
	
	function get_part(key){
		var empty = '',
			spaces = key.replace(/\S/g, empty).length,
			part = key.replace(/\D/g, empty);
		
		if(!spaces) throw {message: 'Wrong key: ' + key, name: 'HandshakeError'};
		
		return get_big_endian(part / spaces);
	}
	
	function get_big_endian(n){
		return String.fromCharCode.apply(null, [3, 2, 1, 0].map(function(i){
			return n >> 8 * i & 0xff
		}));
	}
	
	function challenge(key1, key2, head){
		var sum = get_part(key1) + get_part(key2) + head.toString('binary');
		return crypto.createHash('md5').update(sum).digest('binary');
	}

	var req = parse(data.toString());
	var len = data.length;
	var head = data.slice(len-8, len);
	
	var h = req.headers;
	var headers = [
		'HTTP/1.1 101 WebSocket Protocol Handshake',
		'Upgrade: WebSocket',
		'Connection: Upgrade',
		'Sec-WebSocket-Origin: ' + h.origin,
		'Sec-WebSocket-Location: ws://' + h.host + req.url,
		'Sec-WebSocket-Protocol: ' + h['sec-websocket-protocol']
	];
	
	var prove = challenge(h['sec-websocket-key1'], h['sec-websocket-key2'], head);
		
	var line = '\r\n';
	
	var output = headers.concat(['', prove]).join(line);
	sock.write(output, 'binary');
};

var server = net.createServer(function(conn){
	lobby.connections.push(conn);
	var handshaked = false;
	var response = {}, timer;	
	
	function sendMsg(msg){
		msg = JSON.stringify(msg);
		conn.write("\u0000", "binary");
		conn.write(msg, 'utf8');
		conn.write("\uffff", "binary");
	}
	
	conn
		.on('data', function(data){			
			if(!handshaked){
				handshake(conn, data);
				handshaked = true;
				console.log('Handshaked >>>');				
			} else {
				data = data.toString('utf8');
				data = data.split('\ufffd')[0].slice(1);
				data = JSON.parse(data);
				var t = 'on data: ' + data.type + ' - ' + data.action;
				if(data.data){
					t += ' - ' + data.data;
				}
				log(t);
				
				switch(data.type){
					case 'cmd':
						switch(data.action){
							case 'users':
								sendMsg(lobby.users);
								break;								
						}
						break;
					case 'req':						
						switch(data.action){
							case 'users':
								timer = setInterval(function(){
									response['type'] = 'msg';
									response['action'] = 'users';
									var hsh = {};
									lobby.users.forEach(function(user){
										hsh[user.username] = [user.win, user.lost, user.desk, user.status];
									});
									response['data'] = hsh;
									sendMsg(response);
								}, 1000);
								break;
						}
						break;	
					case 'admin':
						// to console admin
						break;					
					default:
						lobby.broadcast(JSON.stringify(data));
						break;
				}				
			}
		})
		.on('close', function(){
			clearInterval(timer);
			lobby.logout(conn);
			log('sock close');
		})
		.on('error', function(){
			console.log('error');
		})
		.on('timeout', function(){
			console.log('timeout');
		})
		.on('connect', function(){
			lobby.join(conn);
			console.log('connect: ', server.connections);
		});
});

server.listen(PORT, function(){
	console.log('server is running on ', server.address(), PORT);
});

server
	.on('connection', function(e){
		console.log('on connection');
	})
	.on('close', function(e){
		console.log('on close');
	})

	
	
	
	
