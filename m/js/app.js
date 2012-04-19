
$(document).ready(function(){
	var m = (function(){
		function bind(){
			$('#change_account').click(function(){
				$('#change_account').hide();
				$('#user-name').hide();
				$('#user-new').show();
				$('#username').focus();
			});
			
			$('#btn-login').click(function(){
				loading();
				setTimeout(function(){
					game();
				}, 600);
			});
		}
		
		function init(){
			reset();
			$('#Login').show();
		}
		
		function loading(){
			reset();
			$('#Connecting').show();
		}
		
		function game(){
			reset();
			var arrT = [];
			arrT.push('<table>');
			for(var i = 0; i < 6; i ++){
				arrT.push('<tr>');
				for(var j = 0; j < 6; j ++){
					arrT.push('<td>' + j + '</td>');
				}
				arrT.push('</tr>');
			}
			arrT.push('</table>');
			$('#gameboard').html(arrT.join(''));
			$('#Game').show();
			
			$('#ready').show();
			$('#logout').show();
			$('#peace').hide();
			$('#lost').hide();
			
			$('#ready').click(function(event){
				event.preventDefault();
				$('#ready').hide();
				$('#logout').hide();
				$('#peace').show();
				$('#lost').show();				
			});
			
			$('#logout').click(function(event){
				event.preventDefault();
				loading();
				setTimeout(function(){
					init();
				}, 600);
			});
			
			$('#peace, #lost').click(function(event){
				event.preventDefault();
				$('#ready').show();
				$('#logout').show();
				$('#peace').hide();
				$('#lost').hide();
			});
		}
		
		function reset(){
			$('#Login').hide();
			$('#Connecting').hide();
			$('#Game').hide();
		}
		
		return {
			init: function(){
				bind();
				init();
			}
		}
	})();
	m.init();
});
