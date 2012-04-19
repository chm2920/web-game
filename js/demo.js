
$(document).ready(function(){
	var t = (function(){
		
		function bind(){
			$('#create_new').click(function(){
				$('#create_new').hide();
				$('#user_name').hide();
				$('#user_new').show();
			});
			
			$('#opeartion li').click(function(){
				switch(this.id){
					case 'game':
						game();
						break;
					case 'lobby':
						lobby();
						break;
				}
			});
			
			$('#show_game_rule').click(function(){
				$('#GameRule').show();
			});
			$('#GameRule').click(function(){
				$('#GameRule').hide();
			});
		}
		
		function start(){
			reset();
			$('#Login').show();
		}
		
		function loading(){
			reset();
			$('#Connectting').show();
		}
		
		function game(){
			loading();
			setTimeout(function(){
				$('#GameBoard').show();
			}, 600);
		}
		
		function lobby(){
			loading();
		}
		
		function reset(){	
			$('#Connectting').hide();
			$('#Login').hide();
			$('#GameBoard').hide();
			$('#GameRule').hide();		
		}
		
		return {
			init: function(){
				bind();
				start();
			}
		};
	})();
	
	t.init();
});
