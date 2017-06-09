
var scrap = require('../..');
var http = require('http');
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

function analyze(pageurl, cb) {
    read(pageurl, function (err, page) {
        if (err) {
            console.log(err);
            return;
        }
        
        var doc = scrap.document(page);
        var result = { articles: [] };
        
        var articles = doc.elements("article");
        
        for (var article = articles.next(); article; article = articles.next()) {
            var data = { };
            
            var img = article.element('img');
            
            if (img) {
                data.image = { };
                data.image.url = img.attribute('src');
                data.image.text = img.attribute('alt');
            }
            
            var h2 = article.element('h2');
            
            if (h2) {
                var link = h2.element('a');

				if (link) {
					data.title = link.text();
					data.url = link.attribute('href');
				}
            }
            
            if (Object.keys(data).length)
                result.articles.push(data);
        }
        
        console.log(JSON.stringify(result, null, 4));
    });
}

analyze(process.argv[2]);
