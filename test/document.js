
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

exports['Get text'] = function (test) {
    test.equal(doc.text(), "HelloWorld");
}

exports['Get document content'] = function (test) {
    test.equal(doc.content(), text);
}


