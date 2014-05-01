
var ss = require('..');

var text = '<h1><div>Hello</div><div>World</div></h1>';
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

exports['Get first element content'] = function (test) {
    var elements = doc.find();
    var element = elements.first();
    
    test.equal(element.content(), text);
}

exports['Get second element content'] = function (test) {
    var elements = doc.find();
    elements.next();
    var element = elements.next();
    
    test.equal(element.content(), "<div>Hello</div>");
}

