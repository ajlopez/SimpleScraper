
var ss = require('..');

exports['Get simple div'] = function (test) {
    var doc = ss.doc('<div>Hello</div>');
    var result = doc.select('div').first();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), 'Hello');
}