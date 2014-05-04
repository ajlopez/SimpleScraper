
var ss = require('..');

var text = '<h1><div class="message hello">Hello</div><div id="world" class="message">World</div></h1>';
var doc = ss.document(text);

exports['Find elements'] = function (test) {
    var elements = doc.find();
    
    test.ok(elements);
    test.equal(elements.count(), 3);
}

exports['Find first element'] = function (test) {
    var element = doc.find().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find first element in lower case'] = function (test) {
    var element = doc.find().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find each element'] = function (test) {
    var elements = doc.find();
    
    test.ok(elements);
    
    var element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
    
    var element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    
    var element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    
    var element = elements.next();
    
    test.equal(element, null);
}

exports['Get first element to string'] = function (test) {
    var elements = doc.find();
    var element = elements.first();
    
    test.equal(element.toString(), text);
}

exports['Get second element to string'] = function (test) {
    var elements = doc.find();
    elements.next();
    var element = elements.next();
    
    test.equal(element.toString(), '<div class="message hello">Hello</div>');
}

exports['Get div elements'] = function (test) {
    var elements = doc.find("div");
    
    var element = elements.next();
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    
    var element = elements.next();
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "World");
    
    test.equal(elements.next(), null);
}

exports['Get elements with class message'] = function (test) {
    var elements = doc.find(".message");
    
    var element = elements.next();
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attributes().class, "message hello");
    
    var element = elements.next();
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "World");
    test.equal(element.attributes().class, "message");
    
    test.equal(elements.next(), null);
}

exports['Get elements with class hello'] = function (test) {
    var elements = doc.find(".hello");
    
    var element = elements.next();
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attributes().class, "message hello");
    
    test.equal(elements.next(), null);
}

exports['Get element by id'] = function (test) {
    var elements = doc.find("#world");
    
    var element = elements.next();
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "World");
    test.equal(element.attributes().id, "world");
    
    test.equal(elements.next(), null);
}

