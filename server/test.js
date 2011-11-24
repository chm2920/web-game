
var log = function(msg){
	console.log('=================');
	console.log(msg);
	// console.log('\n');
}

var key = 'dGhlIHNhbXBsZSBub25jZQ==';

key += '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

log('s3pPLMBiTxaQ9kYGzzhZRbK+xOo=');

var sha1 = require("crypto").createHash("sha1");

var val = sha1.update(key).digest("base64");

log(val);

//var crypto = require("crypto");
//var hmac = crypto.createHmac("sha1", key);
//var hash2 = hmac.update(data);
//var digest = hmac.digest(encoding="base64");