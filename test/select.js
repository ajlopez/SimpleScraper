
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

exports['Get two divs as array'] = function (test) {
    var doc = ss.doc('<h1><div>Hello</div><div>World</div></h1>');
    var result = doc.select('div').toArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].tag(), 'div');
    test.equal(result[0].text(), 'Hello');
    test.equal(result[1].tag(), 'div');
    test.equal(result[1].text(), 'World');
}

exports['Get no div'] = function (test) {
    var doc = ss.doc('<h1>Hello world</h1>');
    var result = doc.select('div').first();
    
    test.equal(result, null);
    
    var result = doc.select('div').toArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
}

exports['Get composite text'] = function (test) {
    var doc = ss.doc('<h1><div>Hello</div><div>World</div></h1>');
    var result = doc.select('h1').first();
    
    test.ok(result);
    test.equal(result.text(), 'HelloWorld');
}

exports['Get divs using next'] = function (test) {
    var doc = ss.doc('<h1><div>Hello</div><div>World</div></h1>');
    var divs = doc.select('div');
    
    var result = divs.next();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), 'Hello');
    
    var result = divs.next();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), 'World');
    
    var result = divs.next();
    
    test.equal(result, null);
}
