

exports = module.exports = P;

function P(s, c){
	this.x = 0;
	this.y = 0;
	this.side = s;
	this.chess = c;
	this.v = 'f';
}

P.prototype.canEat = function(p){
	if(this.side != p.side){
		if(this.next(p)){
			if(this.chess == 1 && p.chess == 6){
				return true;
			}
			if(this.chess >= p.chess){
				if(this.chess == 6 && p.chess == 1){
					return false;
				}
				return true;
			}
		}
	}
	return false;
}

P.prototype.next = function(p){
	if((Math.abs(this.x - p.x) == 1 && (this.y - p.y) == 0) || ((this.x - p.x) == 0 && Math.abs(this.y - p.y) == 1)){
		return true;
	}
	return false;
}