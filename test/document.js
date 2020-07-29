
const ss = require('..');

exports['Create document and to string'] = function (test) {
    const text = '<h1><div>Hello</div><div>World</div></h1>';
    const doc = ss.document(text);
    
    test.ok(doc);
    test.ok(typeof doc == 'object');
    test.equal(doc.toString(), text);
}

exports['Get text'] = function (test) {
    const text = '<h1><div>Hello</div><div>World</div></h1>';
    const doc = ss.document(text);

    test.equal(doc.text(), "HelloWorld");
}


