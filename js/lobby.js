
function sit(){
	this.username = null;
};



var hall = (function(){
	function getHallInfo(){
		setDesks();
	}
	
	function setDesks(){
		var arrT = [];
		for(var i = 1; i < 16; i ++ ){
			arrT.push('<li>');
			arrT.push('	<i></i>');
			arrT.push('	<span>' + i + '</span>');
			arrT.push('	<i></i>');
			arrT.push('</li>');
		}
		$('#desks').empty().html(arrT.join(''));
		bind();
	}
	
	function bind(){
		$('#desks i').click(function(){
			hall.sitDown();
		});
	}
	
	function _sit_down(){
		if(user.username){
			
		}
	}
	
	return {
		init: function(){
			getHallInfo();
		},
		sitDown: function(){
			_sit_down();
		}
	}
})();
