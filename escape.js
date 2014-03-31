var searchTo = {
  backslash: /\\/g,
  slash: /\//g,
  whitespace: / /g,
  pipe: /\|/g,
  bell: /\x07/g,
  backspace: /\x08/g,
  formfeed: /\x0c/g,
  nl: /\x0a/g,
  cr: /\x0d/g,
  htab: /\x09/g,
  vtab: /\x0b/g
};

var replaceTo = {
  backslash: '\\\\',
  slash: '\\/',
  whitespace: '\\s',
  pipe: '\\p',
  bell: '\\a',
  backspace: '\\b',
  formfeed: '\\f',
  nl: '\\n',
  cr: '\\r',
  htab: '\\t',
  vtab: '\\v'
};

var searchFrom = {
  backslash: /\\\\/g,
  slash: /\\\//g,
  whitespace: /\\s/g,
  pipe: /\\p/g,
  bell: /\\a/g,
  backspace: /\\b/g,
  formfeed: /\\f/g,
  nl: /\\n/g,
  cr: /\\r/g,
  htab: /\\t/g,
  vtab: /\\v/g
};

var replaceFrom = {
  backslash: '\\',
  slash: '/',
  whitespace: ' ',
  pipe: '|',
  bell: '\x07',
  backspace: '\x08',
  formfeed: '\x0c',
  nl: '\x0a',
  cr: '\x0d',
  htab: '\x09',
  vtab: '\x0b'
};

exports.escape = function (data) {
  for(var i in searchTo) {
    data = data.replace(searchTo[i], replaceTo[i]);
  }
  return data;
};

exports.unescape = function (data) {
  for(var i in searchFrom) {
    data = data.replace(searchFrom[i], replaceFrom[i]);
  }
  return data;
};
