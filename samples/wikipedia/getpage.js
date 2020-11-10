
var scrap = require('../..');
var http = require('https');
var url = require('url');

function read(pageurl, cb) {
    var urldata = url.parse(pageurl);
    
    var options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36' }
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

function analyze(topic, cb) {
	var pageurl = 'https://en.wikipedia.org/wiki/' + topic;
	
    read(pageurl, function (err, page) {
        if (err) {
            console.log(err);
            return;
        }
		
        var doc = scrap.document(page);
        
        var content = doc.elements("#content").first();
		var title = content.elements('h1').first();
		var body = content.elements("#mw-content-text").first();
		var links = body.elements("a");
		var references = [];
		
		var link;
		
		while (link = links.next()) {
			var href = link.attribute('href');
			
			if (href && href.substring(0, 6) === '/wiki/')
				references.push(href.substring(6));
		}
		
		var data = {
			title: title.text(),
            content: content.text(),
			text: body.text(),
			references: references
		};
		        
        console.log(JSON.stringify(data, null, 4));
    });
}

analyze(process.argv[2]);
