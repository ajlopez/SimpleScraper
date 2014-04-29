
var ss = require('..');

exports['Create document and to string'] = function (test) {
    var text = '<h1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
    test.ok(doc);
    test.ok(typeof doc == 'object');
    test.equal(doc.toString(), text);
}

exports['Find tags'] = function (test) {
    var text = '<h1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
    var elements = doc.find();
    
    test.ok(elements);
    test.equal(elements.count(), 3);
}

exports['Find first tag'] = function (test) {
    var text = '<h1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
    var element = doc.find().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find first tag in lower case'] = function (test) {
    var text = '<H1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
    var element = doc.find().first();
    
    test.ok(element);
    test.equal(element.tag(), "h1");
}

exports['Find each tag'] = function (test) {
    var text = '<h1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
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
    var text = '<h1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
    test.equal(doc.text(), "HelloWorld");
}

