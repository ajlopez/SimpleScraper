
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
        
        var hdart = doc.elements(".hd_article").first();
        
        if (hdart) {
            var section = hdart.elements("a").first();
            
            if (section)
                result.section = section.text().trim();
            
            var author = hdart.elements(".signmail").first();
            
            if (author)
                result.author = author.text();
                
            var title = hdart.elements("h2").first();
            
            if (title)
                result.title = title.text().trim();
                
            var brief = hdart.elements("h5").first();
            
            if (brief)
                result.brief = brief.text().trim();
        }

        var bdart = doc.elements(".article_bd").first();
        
        if (bdart) {
            var text = '';
            var pars = bdart.elements("p");
            
            for (var par = pars.next(); par; par = pars.next()) {
                if (par.hasClass('info')) {
                    result.published = par.text().trim();
                    continue;
                }
                    
                if (text.length)
                    text += '\n';
                    
                text += par.text();
            }
            
            if (text == '') {
                var divs = bdart.elements("div");
                
                for (var div = divs.next(); div; div = divs.next()) {
                    if (div.attribute('class'))
                        continue;
                        
                    if (text.length)
                        text += '\n';
                        
                    text += div.text();
                }
            }
            
            result.text = text;
        }
        
        console.log(JSON.stringify(result, null, 4));
    });
}

analyze(process.argv[2]);
