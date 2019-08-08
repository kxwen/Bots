
//defining express and listening to open port 5000
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

//used for facebook app verfication
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});



//default post route
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

	   
           

//post route for weather
app.post('/ai', (req, res) => {
       if (req.body.queryResult.action === 'weather') {
          let city = req.body.queryResult.parameters['geo-city'];
          let restUrl = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&APPID='+'2fa935fc2ea810e4b66c925a572215c5'+'&q='+city;

         request.get(restUrl, (error, response, body) => {
         if (!error && response.statusCode == 200) {
           let json = JSON.parse(body);
           let msg = 'The current condition in '+ city + ' is ' + json.weather[0].description + ' and the Temperature is ' + json.main.temp + ' ℉, ' + 'Humidity is at ' + json.main.humidity +'% ' + ', Windspeed is at ' + json.wind.speed + '/mph'; 
           return res.json({
             fulfillmentText: msg,
	     source:'api.openweathermap.org'});
         } else {
           return res.status(400).json({
             status: {
               code: 400,
               errorType: 'I failed to look up the city name.'}});
         }})
      }
});

	  


const request = require('request');

const apiaiApp = require('apiai')('2436f5e16f8d4cffbda5e4449173d694');

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
  
  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat' // use any arbitrary id
  });

  apiai.on('response', (response) => {
    let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: 'EAADDm6gBoY8BAJLq86Iu8MskQCjF2BoQEf3qg6GkeTJI6xOjFl7y6k4lSDbE6GXUfiG1RvaBEcdCCgZCJWQZBxZAlzFrcJhvjw1haxWTRPnzFBHB7Y7nfSZCJiFFz2cQj1DndZAMTZCTaSEwxko1kbuaJM25iv8GMR8Di547xHmZAt1arAmHnED'},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });

 });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}
