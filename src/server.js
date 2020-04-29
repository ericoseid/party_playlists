const express = require('express')
const createUserRequestHandlerModule = require('/home/ericoseid/party_playlists/src/requestHandlers/createUserRequestHandler.js');

const app = express();

app.use(express.json())

app.post('/users/create', async (req, res) => {
  const body = req.body;

  const status = await createUserRequestHandlerModule.handleCreateUserRequest(body);

  res.sendStatus(status);
})

app.listen(3005);