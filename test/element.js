
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

exports['Find three elements'] = function (test) {
    var text = '<h1><div class="message hello">Hello</div><div id="world" class="message">World</div></h1>';
    var elem = ss.element(text);
    var elements = elem.elements();
    
    test.ok(elements);
    test.equal(elements.count(), 3);
}

exports['Find first div element'] = function (test) {
    var text = '<h1><div class="message hello">Hello</div><div id="world" class="message">World</div></h1>';
    var elem = ss.element(text);
    var element = elem.element('div');
    
    test.ok(element);
    test.equal(element.tag(), 'div');
    test.equal(element.text(), 'Hello');
    test.equal(element.attribute('class'), 'message hello');
}
