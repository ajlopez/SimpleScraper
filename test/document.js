
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
    test.equal(elements.tag(), "h1");
}

exports['Find each tag'] = function (test) {
    var text = '<h1><div>Hello</div><div>World</div></h1>';
    var doc = ss.document(text);
    
    var iterator = doc.find().iterator();
    
    test.ok(iterator);
    
    var element = iterator.next();
    
    test.ok(element);
    test.equal(elements.tag(), "h1");
    
    var element = iterator.next();
    
    test.ok(element);
    test.equal(elements.tag(), "div");
    
    var element = iterator.next();
    
    test.ok(element);
    test.equal(elements.tag(), "div");
    
    var element = iterator.next();
    
    test.equal(element, null);
}

