const https = require('https');

function buildRequestOptions(accessToken) {
  return (
    {
      hostname : 'api.spotify.com',
      path : '/v1/me',
      headers : {
        'Authorization' : `Bearer ${accessToken}`
      }
    }
  );
}

function getUserData(accessToken, callback) {
  const requestOptions = buildRequestOptions(accessToken);

  const request = https.get(requestOptions, (res) => {
    res.setEncoding('utf8');

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      setImmediate(callback, undefined, data);
    });
  });

  request.on('error', (e) => {
    setImmediate(callback, e, undefined);
  });
}

const accessToken = 'BQAW_RyaTxYM_b-1RouLSGggz-gI8QjOEGURd1Fc_f0cA0RVqo9abkC29u_rFansUp1ejLy1aNih6DIc7FCbLrkZGCKCBvArlmjxuEcZAtaS6fJPF2wgc6aWgX7wOgXVz71kzdy8od4bXcdm';

getUserData(accessToken, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
});
