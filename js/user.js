
function User(){
	this.username = 'null';
	this.win = 0;
	this.lost = 0;
}

User.prototype.login = function(){
	$('#username').html(this.username);
	$('#win').html(this.win);
	$('#lost').html(this.lost);
	$('#info').html('Loading ...').show();
}

var user = {
	init: function(){
		
		
		this.login();
	},
	login: function(){
		
	},
	logout: function(){
		
	}
};