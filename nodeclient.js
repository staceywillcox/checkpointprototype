var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.listen(3000, function(){
	console.log('App running on port 3000');
	
});

app.use(express.static(__dirname))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response){
	response.render('index.html')
});

// app.post('/', function(request, responce){

// })