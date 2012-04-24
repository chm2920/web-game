
exports = module.exports = User;

function User(id, username){
	this.id = id;
	this.username = username;
	this.status = 'waiting';
	
	this.win = 0;
	this.draw = 0;
	this.lost = 0;
	
	this.deskno = 0;
	this.side = '';
	
	this.check = null;
}