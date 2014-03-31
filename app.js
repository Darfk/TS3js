var config = require('./config.js')
var TS3 = require('./TS3.js').TS3;

var ts3 = new TS3(config.teamspeak.host);

var credentials = {
  client_login_name:config.teamspeak.user,
  client_login_password:config.teamspeak.pass
};

ts3.exec('login', credentials, console.log);

// Provide a callback with the signature (error, response)
ts3.exec('version', function (error, response) {
  if( ! error ) {
    console.log(response);
  }
});

// Set parameters using objects
ts3.exec('use', {sid:'1'}, console.log);

// Set flags using arrays
ts3.exec('clientlist', ['away'], console.log);

// Wrap everything up
// .end() closes the socket
ts3.exec('logout', function () {
  ts3.end();
});
