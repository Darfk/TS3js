TS3js
===
Teamspeak3 Server Query for NodeJS
---

Example usage
---

    var ts3 = new require('./TS3.js').TS3("HOSTNAME");

    var credentials = {
      client_login_name: "SERVER QUERY USER",
      client_login_password: "SERVER QUERY PASSWORD"
    };

    ts3.exec('login', credentials, console.log);

    // Provide a callback with the signature (error, response)
    ts3.exec('version', console.log);
    // -> null null
    
    // Set parameters using objects
    ts3.exec('use', {sid:'1'}, console.log);
    // -> null null
    
    // Set flags using arrays
    ts3.exec('clientlist', ['away'], console.log);
    // -> null [ { clid: '8',
    // cid: '11',
    // client_database_id: '2',
    // client_nickname: 'Tom',
    // client_type: '0',
    // client_away: '1',
    // client_away_message: 'Busy Programming' } ]
    
    // Wrap everything up
    // .end() closes the socket
    ts3.exec('logout', function () {
      ts3.end();
    });


