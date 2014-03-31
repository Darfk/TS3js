var EventEmitter = require('events').EventEmitter;
var Socket = require('net').Socket;
var LineInputStream = require('line-input-stream');

var TS3 = function (hostname, port) {
  var self = this;
  this.hostname = hostname || 'localhost';
  this.port = port || '10011';
  this.socket = new Socket();
  this.stream = new LineInputStream(this.socket);
  this.stream.setDelimiter('\n\r');
  this.queue = [];
  this.cur;
  this.events = new EventEmitter();
  this.ready = false;
  this.events.on('next', function () {
    var cmdpkg = self.queue.shift();
    if(cmdpkg) {
      self.cur = cmdpkg;
      self.execCmdPkg(cmdpkg);
    }
  });

  this.on = function () {
    this.events.on.apply(this.events, arguments);
  };

  this.end = function () {
    this.socket.end.apply(this.socket, arguments);
  };

  this.socket.setEncoding('utf8');
  this.socket.connect(this.port, this.hostname);
  
  this.initLineCount = 2;
  this.stream.on('line', function () {
    if(!--self.initLineCount){
      delete self.initLineCount;
      self.stream.removeAllListeners('line');
      self.stream.on('line', self.dispatchResponse);
      self.ready = true;
      self.events.emit('ready');
    }
  });

  this.dispatchResponse = function (data) {
    if(data.indexOf('error') === 0 && self.cur) {
      self.cur.error = TS3.parseResponse(data);
      self.cur.error = self.cur.error.shift();
      delete self.cur.error.error;
      if(self.cur.callback) {
        self.cur.callback.call(self.cur,
                               self.cur.error.id == 0 ? null : self.cur.error,
                               typeof self.cur.response === 'undefined' ? null : self.cur.response);
        self.cur = null;
        self.events.emit('next');
      }
    }else if(data.indexOf('notify') === 0){
      //TODO
    }else if(self.cur){
      self.cur.response = TS3.parseResponse(data);
    }
  };

};

TS3.prototype.execCmdPkg = function (cmdpkg) {
  var self = this;
  if(cmdpkg.command) {
    this.socket.write(TS3.generateCommandString(cmdpkg.command, cmdpkg.params, cmdpkg.flags) + '\n');
  }
};

TS3.generateCommandString = function (command, params, flags) {
  flags = flags ? flags.reduce(function (a, i) {
      return a + ' -' + i;
    }, '')
  : '' ;

  var p = [];
  if(params) {
    for(var i in params) {
      p.push(i+'='+TS3.escape(params[i]));
    }
    return command + ' ' + p.join(' ') + flags;
  }
  return command + flags;
};

TS3.parseResponse = function (data) {
  var res;
  res = data.split('|');
  res = res.map(function(i){
    return i.split(' ').reduce(function (a, i) {
      var s = i.split('=');
      a[s[0]] = s[1]?TS3.unescape(s[1]):null;
      return a;
    }, {});
  });

  return res;
};

TS3.prototype.exec = function (command, params, flags, callback) {
  var a, cmdpkg = {};
  for (var i in arguments) {
    a = arguments[i];
    if(typeof a === 'string') {
      cmdpkg.command = a;
    }
    if(typeof a === 'function') {
      cmdpkg.callback = a;
    }
    if(typeof a === 'object') {
      if(Array.isArray(a)) {
        cmdpkg.flags = a;
      }else{
        cmdpkg.params = a;
      }
    }
  }
  this.queue.push(cmdpkg);
  this.start();
};

TS3.prototype.start = function () {
  var self = this;
  if(this.ready) {
    this.events.emit('next');
  }else if (EventEmitter.listenerCount(this.events, 'ready') === 0) {
    this.events.on('ready', function(){
      self.events.removeAllListeners('ready');
      self.events.emit('next');
    });
  }
};

TS3.escape = require('./escape.js').escape;
TS3.unescape = require('./escape.js').unescape;

exports.TS3 = TS3;
