const assert = require('assert');
const sinon = require('sinon');
const https = require('https');
const {EventEmitter} = require('events');
const {refreshAccessCredentials} = require(`/home/ericoseid/party_playlists/external/spotify/authorization/AccessCredentialRefresher.js`);

describe('AccessCredentialRefresher', () => {
const REFRESH_TOKEN = 'refreshToken';
const POST_DATA = `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`;
const APP_CREDENTIALS = 'appCredentials';
const ERROR_EVENT = 'error';
const ERROR_MESSAGE = 'errorMessage';
const DATA_EVENT = 'data';
const END_EVENT = 'end';
const RESPONSE_DATA = '{\"testField\":1}';
const UTF8_ENCODING = 'utf8';
const REQUEST_OPTIONS = {
  hostname : 'accounts.spotify.com',
	path : '/api/token',
	method : 'POST',
	headers: {
    'Content-Type' : 'application/x-www-form-urlencoded',
    'Content-Length' : POST_DATA.length,
    'Authorization' : `Basic ${APP_CREDENTIALS}`
  }
}

let request;
let fakeRequest;
beforeEach(() => {
  request = new EventEmitter();
  request.write = sinon.fake();
  request.end = sinon.fake();

  fakeRequest = sinon.stub();
  fakeRequest.returns(request);
  sinon.replace(https, 'request', fakeRequest);
});

afterEach(() => sinon.restore());

describe('refreshAccessCredentials', () => {
  describe('when the https call fails', () => {
    it('passes the error to the callback', (done) => {
      setImmediate(() => request.emit(ERROR_EVENT, ERROR_MESSAGE));

      refreshAccessCredentials(REFRESH_TOKEN, (err, res) => {
        assert.equal(ERROR_MESSAGE, err);

        assert.equal(1, request.write.callCount);
        assert.equal(POST_DATA, request.write.firstArg);

        assert.equal(1, request.end.callCount);

        done();
      });      
    });
  });

  describe('When the https call succeeds', () => {
    it('passes the response data to the callback', (done) => {
      let response = new EventEmitter();
      response.setEncoding = sinon.fake();

      fakeRequest.yieldsAsync(response);

      setImmediate(() => {
        response.emit(DATA_EVENT, RESPONSE_DATA);
        response.emit(END_EVENT);
      })

      refreshAccessCredentials(REFRESH_TOKEN, (err, res) => {
        assert.equal(1, res.testField);

        assert.equal(1, response.setEncoding.callCount);
        assert.equal(UTF8_ENCODING, response.setEncoding.firstArg);

        assert.equal(1, request.write.callCount);
        assert.equal(POST_DATA, request.write.firstArg);

        assert.equal(1, request.end.callCount);

        done();
      })
    })
  })
});
});
