
var net = require('net');
var sha1 = require("crypto").createHash("sha1");
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
	function parse(raw_head){
		function err(){
			err_head('Invalid request headers!');
		}
		
		function is_nil(s){return !s;}
		
		log(raw_head);
		
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
	
	function challenge(key){
		key += '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
		key = sha1.update(key).digest("base64");
		return key;
	}

	var req = parse(data.toString());
	var h = req.headers;
	var accept = challenge(h['sec-websocket-key']);
	var headers = [
		'HTTP/1.1 101 Switching Protocols',
		'Upgrade: websocket',
		'Connection: Upgrade',
		'Sec-WebSocket-Accept: ' + accept,
		'Sec-WebSocket-Protocol: ' + h['sec-websocket-protocol']
	];
	var line = '\r\n';	
	var output = headers.join(line);
	log(output);
	sock.write(output, 'binary');
};

var server = net.createServer(function(conn){
	lobby.connections.push(conn);
	var handshaked = false;
	var response = {}, timer;
	var username;
	
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
				response = {};
				response['type'] = 'msg';
				response['action'] = 'sit';
				response['data'] = {
					'a': 'a'
				};
				sendMsg(response);				
			} else {
				data = data.toString('utf8');
				log(data);
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
							case 'sit':
								response = {};
								response['type'] = 'msg';
								response['action'] = 'sit';
								response['data'] = {
									'username': username,
									'desk': data.data.desk,
									'a': data.data.a
								};
								log(data.data.desk);
								log(username);
								log(data.data.a);
								sendMsg(response);
								break;								
						}
						break;
					case 'req':						
						switch(data.action){
							case 'users':
								timer = setInterval(function(){
									response = {};
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
			username = lobby.join(conn);
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

	
	
	
	
