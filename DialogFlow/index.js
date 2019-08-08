//creating a index.js file to handle all incoming http requests
var http = require('http');

//define the port exposed to the internet
const PORT = 5000;

//function which handles incoming requests and prints a reponse
function handleRequest(request, response){
  response.end('Ngrok is working! -  Path Hit: ' + request.url);
}

//creating a web sever using the createServer function
var server = http.createServer(handleRequest);

//call to start the server
server.listen(PORT, function(){
  // Callback triggered when server is successfully listening
  console.log("Server listening on: http://localhost:%s", PORT);
});
