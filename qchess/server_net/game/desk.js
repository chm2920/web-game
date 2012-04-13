
exports = module.exports = Desk;

// status
// 0: kong
// 1: one p
// 2: two ps
// 5: over

// connections 
// {'L': conn, 'R': conn}

function Desk(manager, no){
	this.manager = manager;
	this.no = no;
	this.L = null;
	this.R = null;
	this.status = 0;
	this.connections = {};
	
	this.game = null;
}

Desk.find = function(no){
	return desks[no-1];
}

Desk.prototype.broadcast = function(data){
	data = JSON.stringify(data);
	var transport = this.manager.transports[this.connections['L']];
	try{
		transport.write(data);
	} catch(e) {
		console.log('error L: ', data);
	}
	transport = this.manager.transports[this.connections['R']];
	try{
		transport.write(data);
	} catch(e) {
		console.log('error R: ', data);
	}
}