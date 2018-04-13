var http = require('http');

http.createServer(onRequest).listen(8888);
console.log("server is on");