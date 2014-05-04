
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
        var result = { };
        
        var hdart = doc.find(".hd_article").first();
        
        if (hdart) {
            var cat = hdart.find("a").first();
            
            if (cat)
                result.category = cat.text();
            
            var author = hdart.find(".signmail").first();
            
            if (author)
                result.author = author.text();
                
            var title = hdart.find("h2").first();
            
            if (title)
                result.title = title.text().trim();
                
            var brief = hdart.find("h5").first();
            
            if (brief)
                result.brief = brief.text().trim();
        }

        var bdart = doc.find(".article_bd").first();
        
        if (bdart) {
            var text = '';
            var pars = bdart.find("p");
            
            for (var par = pars.next(); par; par = pars.next()) {
                if (par.hasClass('info')) {
                    result.published = par.text().trim();
                    continue;
                }
                    
                if (text.length)
                    text += '\n';
                    
                text += par.text();
            }
            
            result.text = text;
        }
        
        console.log(JSON.stringify(result, null, 4));
    });
}

analyze(process.argv[2]);
