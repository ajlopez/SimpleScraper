
const ss = require('..');

exports['Create document and to string'] = function (test) {
    const text = '<div class="message">Hello</div>';
    const elem = ss.element(text);
    
    test.ok(elem);
    test.ok(typeof elem == 'object');
    test.equal(elem.toString(), text);
    test.equal(elem.tag(), "div");
}

exports['Get element length'] = function (test) {
    const text = '<div class="message">Hello</div>';
    const elem = ss.element(text);
    
    test.equal(elem.length(), text.length);
}

exports['Get text'] = function (test) {
    const text = '<div class="message">Hello</div>';
    const elem = ss.element(text);
    
    test.equal(elem.text(), "Hello");
}

exports['To string'] = function (test) {
    const text = '<div class="message">Hello</div>';
    const elem = ss.element(text);
    
    test.equal(elem.toString(), text);
}

exports['Element with mixed case close'] = function (test) {
    const text = '<div class="message">Hello</DIV>';
    const elem = ss.element(text);
    
    test.ok(elem);
    test.ok(typeof elem == 'object');
    test.equal(elem.toString(), text);
    test.equal(elem.tag(), "div");
    test.equal(elem.length(), text.length);
    test.equal(elem.text(), "Hello");
}

exports['Get attributes'] = function (test) {
    const text = '<div class="message">Hello</DIV>';
    const elem = ss.element(text);
    const result = elem.attributes();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.class, 'message');
}

exports['Get attribute as flag'] = function (test) {
    const text = '<input required/>';
    const elem = ss.element(text);
    const result = elem.attributes();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.strictEqual(result.required, true);
}

exports['Get attribute by name'] = function (test) {
    const text = '<div class="message">Hello</div>';
    const elem = ss.element(text);

    test.equal(elem.attribute('class'), 'message');
    test.equal(elem.attribute('foo'), null);
}

exports['Find three elements'] = function (test) {
    const text = '<h1><div class="message hello">Hello</div><div id="world" class="message">World</div></h1>';
    const elem = ss.element(text);
    const elements = elem.elements();
    
    test.ok(elements);
    test.equal(elements.count(), 3);
}

exports['Find first div element'] = function (test) {
    const text = '<h1><div class="message hello">Hello</div><div id="world" class="message">World</div></h1>';
    const elem = ss.element(text);
    const element = elem.element('div');
    
    test.ok(element);
    test.equal(element.tag(), 'div');
    test.equal(element.text(), 'Hello');
    test.equal(element.attribute('class'), 'message hello');
}

