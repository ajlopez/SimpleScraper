
var scrap = require('../..');
var http = require('http');
var url = require('url');

function read(pageurl, cb) {
    var urldata = url.parse(pageurl);
    
    var options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        method: 'GET'
    };
    
    var req = http.request(options, function(res) {
        var buffer = '';

        res.on('data', function(d) {
            var text = d.toString();
            buffer += text;
        });

        res.on('err', function(err) {
            cb(err);
        });

        res.on('end', function(d) {
            if (d) {
                var text = d.toString();
                buffer += text;
            }

            cb(null, buffer);
        });
    });

    req.end();    
}

function analyze(pageurl, cb) {
    read(pageurl, function (err, page) {
        if (err) {
            console.log(err);
            return;
        }
        
        var doc = scrap.document(page);
        var result = { articles: [] };
        
        var notes = doc.elements(".nota");
        
        for (var note = notes.next(); note; note = notes.next()) {
            var title = note.element('h3');
            
            if (title)
                result.articles.push({ title: title.text() });
        }
        
        console.log(JSON.stringify(result, null, 4));
    });
}

analyze(process.argv[2]);
