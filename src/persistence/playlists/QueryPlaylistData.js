const  mysql = require('mysql');

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 
  'SELECT * FROM playlist_data WHERE playlist_id=?';

const queryPlaylistDataByPlaylistId = (playlistId) => {
  const connection = mysql.createConnection(CONNECTION_INFO);

  return new Promise((resolve, reject) => {
    connection.query(QUERY_STRING, [playlistId], (err, rows) => {
      connection.destroy();

      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

module.exports = queryPlaylistDataByPlaylistId;
