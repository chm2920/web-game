
exports = module.exports = Desk;

// status
// 0: kong
// 1: one p
// 2: two ps
// 5: over

// connections 
// {'L': userid, 'R': userid}

function Desk(manager, no){
	this.manager = manager;
	this.no = no;
	this.L = null;
	this.R = null;
	this.status = 0;
	
	this.game = null;
}

Desk.prototype.broadcast = function(data){
	data = JSON.stringify(data);
	try{
		this.manager[this.L].write(data);
	} catch(e) {
		console.log('error L: ', data);
	}
	try{
		this.manager[this.R].write(data);
	} catch(e) {
		console.log('error R: ', data);
	}
}