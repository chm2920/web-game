

exports = module.exports = Transport;


function Transport (mng, data, req) {
	this.manager = mng;
	this.id = data.id;
	this.disconnected = false;
	this.drained = true;
	this.open = true;
	this.req = req;
	this.socket = req.socket;
	this.log = new Log();
	this.onSocketConnect();
};

Transport.prototype.end = function (reason) {
	console.log('----', this.id);
	this.manager.onClose(this.id);
	this.log.info('transport end');
};

Transport.prototype.onMessage = function (packet) {
	this.manager.onClientMessage(this.id, JSON.parse(packet));
};

function Log(){
}

Log.prototype.info = function(msg){
	console.log(msg);
}

Log.prototype.warn = function(msg){
	console.log(msg);
}

Log.prototype.debug = function(key, val){
	console.log(key, ' : ', val);
}
