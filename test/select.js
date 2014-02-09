
var ss = require('..');

exports['Get simple div'] = function (test) {
    var doc = ss.doc('<div>Hello</div>');
    var result = doc.select('div').first();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), 'Hello');
}

exports['Get simple div with empty text'] = function (test) {
    var doc = ss.doc('<div></div>');
    var result = doc.select('div').first();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), '');
}

exports['Get simple div without text'] = function (test) {
    var doc = ss.doc('<div/>');
    var result = doc.select('div').first();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), null);
}

exports['Get div inside h1'] = function (test) {
    var doc = ss.doc('<h1><div>Hello</div></h1>');
    var result = doc.select('div').first();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), 'Hello');
}
