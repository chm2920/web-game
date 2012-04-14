
var chat = {
	init: function(){
		$('#send').click(function(){
			$('#chatList').append('<p><span>Me:</span>' + $('#speak').val() + '</p>');
		});
	}
};