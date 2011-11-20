

var files = ['util', 'user', 'lobby', 'chat'];
//var files = ['util'];
var arrT = [];
for(var i = 0, l = files.length; i < l; i ++){
	arrT.push('<script type="text/javascript" src="js/' + files[i] + '.js"></script>');
}
$('head').append(arrT.join(''));

$(document).ready(function(){
	Util.connect('lobby');
	//user.init();
	//hall.init();
	//chat.init();
});

$(window).unload(function () {
	//jQuery.get("/part", {id: CONFIG.id}, function (data) { }, "json");
});