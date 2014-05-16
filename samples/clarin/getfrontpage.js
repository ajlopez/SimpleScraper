
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
        
        var articles = doc.elements("article");
        
        for (var article = articles.next(); article; article = articles.next()) {
            if (!article.hasClass('nota') && !article.hasClass('nota-img'))
                continue;
                
            var data = {};
                
            var link = article.element('a');
            
            if (link) {
                data.url = link.attribute('href');
                data.title = link.attribute('title');
            }
            
            var figure = article.element('figure');
            
            if (figure) {
                var img = figure.element('img');
                
                if (img) {
                    data.image = { };
                    
                    data.image.url = img.attribute('src');
                    data.image.text = img.attribute('alt');
                }
            }
            
            var p = article.element('p');
            
            if (p)
                data.text = p.text();
                
            result.articles.push(data);
        }
        
        console.log(JSON.stringify(result, null, 4));
    });
}

analyze(process.argv[2]);
