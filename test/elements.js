
const ss = require('..');

const text = '<h1><div title="hello" class="message hello">Hello</div><div id="world" class="message">World</div></h1>';
const doc = ss.document(text);

exports['Find elements'] = function (test) {
    const elements = doc.elements();
    
    test.ok(elements);
    test.equal(elements.count(), 3);
}

exports['Find first element'] = function (test) {
    const element = doc.elements().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find first element using elemnt'] = function (test) {
    const element = doc.element();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find first element in lower case'] = function (test) {
    const element = doc.elements().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find each element'] = function (test) {
    const elements = doc.elements();
    
    test.ok(elements);
    
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
    
    const element2 = elements.next();
    
    test.ok(element2);
    test.equal(element2.tag(), "div");
    
    const element3 = elements.next();
    
    test.ok(element3);
    test.equal(element3.tag(), "div");
    
    const element4 = elements.next();
    
    test.equal(element4, null);
}

exports['Get first element to string'] = function (test) {
    const elements = doc.elements();
    const element = elements.first();
    
    test.equal(element.toString(), text);
}

exports['Get second element to string'] = function (test) {
    const elements = doc.elements();
    
    elements.next();
    
    const element = elements.next();
    
    test.equal(element.toString(), '<div title="hello" class="message hello">Hello</div>');
}

exports['Get div elements'] = function (test) {
    const elements = doc.elements("div");
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    
    const element2 = elements.next();
    
    test.ok(element2);
    test.equal(element2.tag(), "div");
    test.equal(element2.text(), "World");
    
    test.equal(elements.next(), null);
}

exports['Get first div element'] = function (test) {
    const element = doc.element("div");
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
}

exports['Get elements with class message'] = function (test) {
    const elements = doc.elements(".message");
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attributes().class, "message hello");
    
    const element2 = elements.next();
    
    test.ok(element2);
    test.equal(element2.tag(), "div");
    test.equal(element2.text(), "World");
    test.equal(element2.attributes().class, "message");
    
    test.equal(elements.next(), null);
}

exports['Get first element with class message'] = function (test) {
    const element = doc.element(".message");
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attributes().class, "message hello");
}

exports['Get elements with class hello'] = function (test) {
    const elements = doc.elements(".hello");
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attributes().class, "message hello");
    
    test.equal(elements.next(), null);
}

exports['Get element by id'] = function (test) {
    const elements = doc.elements("#world");
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "World");
    test.equal(element.attributes().id, "world");
    
    test.equal(elements.next(), null);
}

exports['Get elements with attribute title'] = function (test) {
    const elements = doc.elements("@title");    
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attributes().title, "hello");
    
    test.equal(elements.next(), null);
}

exports['Get elements using a predicate'] = function (test) {
    const elements = doc.elements(function (element) { return element.attribute("title") == "hello"; });
    const element = elements.next();
    
    test.ok(element);
    test.equal(element.tag(), "div");
    test.equal(element.text(), "Hello");
    test.equal(element.attribute("title"), "hello");
    
    test.equal(elements.next(), null);
}

