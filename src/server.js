const express = require('express')
const createUserRequestHandlerModule = require('/home/ericoseid/party_playlists/src/requestHandlers/createUserRequestHandler.js');
const completeUserRequestHandler = require('./requestHandlers/users/completeUserRequestHandler');

const app = express();

app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/users/create', async (req, res) => {
  console.log(`Received Create User Request: ${JSON.stringify(req.body)}`);

  const body = req.body;

  const status = await createUserRequestHandlerModule.handleCreateUserRequest(body);

  res.sendStatus(status);
});

app.post('/users/complete', async (req, res) => {
  console.log(`Received Complete User Request`);

  const body = req.body;

  const status = await completeUserRequestHandler.handleCompleteUserRequest(body);
  
  res.sendStatus(status);
});

app.listen(3005);