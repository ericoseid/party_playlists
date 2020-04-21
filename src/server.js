const express = require('express')
const createUserRequestHandlerModule = require('/home/ericoseid/party_playlists/src/requestHandlers/createUserRequestHandler.js');

const app = express();

app.use(express.json())

app.post('/users/create', async (req, res) => {
  const body = req.body;

  try {
    await createUserRequestHandlerModule.handleCreateUserRequest(body);

    res.sendStatus(200);
  } catch (err) {
    if (err.message === 'request body not present' ||
        err.message === 'username not present in request') {
      res.sendStatus(400);
    } else {
      res.sendStatus(500);
    }
  }
})

app.listen(3005);