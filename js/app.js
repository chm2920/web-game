

//var files = ['util', 'user', 'lobby', 'chat'];
var files = ['util'];
var arrT = [];
for(var i = 0, l = files.length; i < l; i ++){
	arrT.push('<script type="text/javascript" src="js/' + files[i] + '.js"></script>');
}
$('head').append(arrT.join(''));

function showDesks(){
	$('#desks').animate({
		'left': '0'
	});
	$('#board').animate({
		'left': '720px',
	});
}

function showBoard(){
	$('#desks').animate({
		'left': '-720px'
	});
	$('#board').animate({
		'left': '0',
	});
}

function setDesks(){
	var arrT = [];
	for(var i = 1; i < 16; i ++ ){
		arrT.push('<li id="desk' + i + '">');
		arrT.push('	<div class="L">');
		arrT.push('	<i></i>');
		arrT.push('	<p></p>');
		arrT.push('	</div>');
		arrT.push('	<span>' + i + '</span>');
		arrT.push('	<div class="R">');
		arrT.push('	<i></i>');
		arrT.push('	<p></p>');
		arrT.push('	</div>');
		arrT.push('</li>');
	}
	$('#desks').empty().html(arrT.join(''));
	$('#desks i').click(function(){
		// var p = $(this).parent();
		// var desk = p.parent().attr('id').replace('desk', '');
		// var a = p[0].className;
		// Util.sitDown(desk, a);
	// });
	// $('#ready').click(function(){
		showBoard();
		$('#ready').show();
		$('#leave').show();
		$('#lost').hide();
		$('#peace').hide();
	});
	$('#ready').click(function(){
		$('#ready').hide();
		$('#leave').hide();
		$('#lost').show();
		$('#peace').show();
	});
	$('#leave').click(function(){
		showDesks();
	});
	$('#peace').click(function(){
		showDesks();
	});
}

function setGameTable(){
	var arrT = [];
	for(var i = 1; i < 7; i ++){
		arrT.push('<tr>');
		for(var j = 1; j < 7; j ++){
			arrT.push('	<td>');
			arrT.push(' </td>');
		}
		arrT.push('</tr>');
	}
	$('#gameTB').empty().html(arrT.join(''));
}

$(document).ready(function(){
	setDesks();
	setGameTable();
	Util.connect('lobby');
	//user.init();
	//hall.init();
	//chat.init();
});

$(window).unload(function () {
	//jQuery.get("/part", {id: CONFIG.id}, function (data) { }, "json");
});