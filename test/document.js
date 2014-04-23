
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
