
var ss = require('..');

exports['Get attributes from element without attributes'] = function (test) {
    var doc = ss.doc('<h1><div>Hello</div><div>World</div></h1>');
    var divs = doc.where(function(item) { return item.text() == 'Hello'; });
    var div = divs.first();
    
    test.ok(div);
    
    var attributes = div.attributes();
    
    test.ok(attributes);
    test.equal(Object.keys(attributes).length, 0);
}
