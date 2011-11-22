
function sit(){
	this.username = null;
};



var hall = (function(){
	function getHallInfo(){
		setDesks();
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
