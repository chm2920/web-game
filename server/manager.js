
var protocolVersions = require('./websocket/');

var WebSocket = function(mng, data, req) {
	var transport
		, version = req.headers['sec-websocket-version'];
	if (typeof version !== 'undefined' && typeof protocolVersions[version] !== 'undefined') {
		transport = new protocolVersions[version](mng, data, req);
	} else {
		transport = new protocolVersions['default'](mng, data, req);
	}
	return transport;
};

exports.listen = function (port, fn) {
	var manager = new Manager(port, fn);
	return manager;
};

var Manager = function(port, fn){
	this.handshaken = {};
	this.transports = {};
	this.sockets = {};
	
	this.settings = {
		origins: '*:*'
	};
		
	var self = this;
	
	var server = require('http').createServer();
	server.listen(port, fn);
	
	server.on('request', function (req, res) {
		res.writeHead(200);
		res.end('Welcome to websocket.');
	});
	
	server.on('upgrade', function (req, socket, head) {
		self.handleUpgrade(req, socket, head);
	});
	
	server.on('close', function () {
		console.log('close');
	});
	
	this.server = server;
};

Manager.prototype.get = function (key) {
	return this.settings[key];
};

Manager.prototype.handleUpgrade = function (req, socket, head) {
	var data = {
        headers: req.headers
		, request: req
		, transport: 'websocket'
		, id: this.generateId()
    };

	req.head = head;
	this.sockets[data.id] = req.socket;
	this.transports[data.id] = new WebSocket(this, data, req);
};

Manager.prototype.generateId = function () {
	return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
		+ Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
};

Manager.prototype.onClientMessage = function (id, packet) {
	var obj = {
		id: id
		, addr : this.sockets[id].remoteAddress
		, data : packet
	};
	this.sockets[id].emit(packet.type, obj);
};

Manager.prototype.onClose = function (id) {
	delete this.transports[id];
	this.sockets[id].emit('logout', id);
};

