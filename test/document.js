
var ss = require('..');

var text;
var doc;
    
exports['Create document and to string'] = function (test) {
    text = '<h1><div>Hello</div><div>World</div></h1>';
    doc = ss.document(text);
    
    test.ok(doc);
    test.ok(typeof doc == 'object');
    test.equal(doc.toString(), text);
}

exports['Find tags'] = function (test) {
    var elements = doc.find();
    
    test.ok(elements);
    test.equal(elements.count(), 3);
}

exports['Find first tag'] = function (test) {
    var element = doc.find().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find first tag in lower case'] = function (test) {
    var element = doc.find().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find each tag'] = function (test) {
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

exports['Get text'] = function (test) {
    test.equal(doc.text(), "HelloWorld");
}

exports['Get document content'] = function (test) {
    test.equal(doc.content(), text);
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

