
var ss = require('..');

var text;
var elem;
    
exports['Create document and to string'] = function (test) {
    text = '<div>Hello</div>';
    elem = ss.element(text);
    
    test.ok(elem);
    test.ok(typeof elem == 'object');
    test.equal(elem.toString(), text);
    test.equal(elem.tag(), "div");
}

exports['Get text'] = function (test) {
    test.equal(elem.text(), "Hello");
}

