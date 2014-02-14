
var ss = require('..');

exports['Get element using doc where'] = function (test) {
    var doc = ss.doc('<h1><div>Hello</div><div>World</div></h1>');
    var divs = doc.where(function(item) { return item.text() == 'Hello'; });
    
    var result = divs.next();
    
    test.ok(result);
    test.equal(result.tag(), 'div');
    test.equal(result.text(), 'Hello');
    
    var result = divs.next();
    
    test.equal(result, null);
}
