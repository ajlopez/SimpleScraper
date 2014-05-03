
var ss = require('..');

var text;
var elem;
    
exports['Create document and to string'] = function (test) {
    text = '<div class="message">Hello</div>';
    elem = ss.element(text);
    
    test.ok(elem);
    test.ok(typeof elem == 'object');
    test.equal(elem.toString(), text);
    test.equal(elem.tag(), "div");
}

exports['Get text'] = function (test) {
    test.equal(elem.text(), "Hello");
}

exports['Get attributes'] = function (test) {
    var result = elem.attributes();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.class, 'message');
}

exports['Get attribute as flag'] = function (test) {
    var text = '<input required/>';
    var elem = ss.element(text);
    var result = elem.attributes();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.strictEqual(result.required, true);
}

exports['Get attribute by name'] = function (test) {
    test.equal(elem.attribute('class'), 'message');
    test.equal(elem.attribute('foo'), null);
}

