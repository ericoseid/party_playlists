const https = require('https');
const sinon = require('sinon');
const assert = require('assert');
const {EventEmitter} = require('events');
const playlists = require('/home/ericoseid/party_playlists/external/spotify/playlists/GetUserPlaylists.js');

describe('getUserPlaylists', () => {
  const USER_ID = 'userId';
  const AUTHORIZATION = 'authorization';
  const ERROR_EVENT = 'error';
  const ERROR_MESSAGE = 'errorMessage';
  const RESPONSE_DATA = '{\"testField\":1}';
  const REQUEST_OPTIONS = {
    hostname : 'api.spotify.com',
    path : `/v1/users/${USER_ID}`,
    headers : {
      'Authorization' : `Bearer ${AUTHORIZATION}`
    }
  }

  let response;
  let request;
  let createRequest;
  beforeEach(() => {
    response = new EventEmitter();
    response.setEncoding = sinon.fake();

    request = new EventEmitter();

    createRequest = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when the https request fails', () => {
    it('passes the error into the callback function', (done) => {
      createRequest.withArgs(REQUEST_OPTIONS, sinon.match.func)
                   .returns(request);
      sinon.replace(https, 'get', createRequest);
      setImmediate(() => {request.emit(ERROR_EVENT, ERROR_MESSAGE)});

      playlists.getUserPlaylists(USER_ID, AUTHORIZATION, (err, res) => {
        assert.strictEqual(ERROR_MESSAGE, err);

        done();
      });
    });
  });

  describe('when the request succeeds', () => {
    it('passes the data into the callback function', (done) => {
      createRequest.withArgs(REQUEST_OPTIONS, sinon.match.func)
                   .returns(request)
                   .yieldsAsync(response);
      sinon.replace(https, 'get', createRequest);
      setImmediate(() => {
        response.emit('data', RESPONSE_DATA);
        response.emit('end');
      });

      playlists.getUserPlaylists(USER_ID, AUTHORIZATION, (err, res) => {
        assert.strictEqual(1, res.testField);

        assert.strictEqual('utf8', response.setEncoding.firstArg);

        done();
      });
    });
  });
});
