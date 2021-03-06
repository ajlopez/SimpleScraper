
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
        var result = { };
        
        var note = doc.elements("article").first();
        
        if (note) {
            var sections = note.elements("a");
            
            for (var section = sections.next(); section; section = sections.next()) {
                var sectitle = section.attribute("title");
                
                if (sectitle && sectitle != "lanacion.com") {
                    result.section = sectitle;
                    break;
                }
            }
        }
        
        var header = doc.elements("#encabezado").first();
        
        if (header) {
            var date = header.elements(".fecha").first();
            
            if (date)
                if (date.attributes().content)
                    result.published = date.attributes().content;
                else
                    result.published = date.text().trim();
                    
            var title = header.elements("h1").first();
            
            if (title)
                result.title = title.text().trim();
                
            var brief = header.elements(".bajada").first();
            
            if (brief)
                result.brief = brief.text().trim();
        }
        
        var body = doc.elements("#cuerpo").first();
        
        if (body) {
            var photo = body.elements(".foto").first();
            
            if (photo) {
                var url = null;
                var caption = null;
                
                var img = photo.elements("img").first();

                if (img)
                    url = img.attribute("src");

                var figcaption = photo.elements("figcaption").first();
                
                if (figcaption)
                    caption = figcaption.text().trim();
                    
                if (url || caption)
                    result.image = { };
                    
                if (url)
                    result.image.url = url;
                if (caption)
                    result.image.caption = caption;
            }
            
            var intext = false;
            var elems = body.elements();
            var text = ''
            
            for (var elem = elems.next(); elem; elem = elems.next()) {
                if (elem.tag() == "p" && elem.hasClass("primero"))
                    intext = true;
                    
                if (!intext)
                    continue;
                    
                if (elem.tag() != "p" && elem.tag() != "h2")
                    continue;
                    
                if (text.length)
                    text += '\n';
                    
                text += elem.text().trim();
                
                if (elem.tag() == 'h2')
                    text += '\n';
            }
            
            if (text == '') {
                var elems = body.elements();
                for (var elem = elems.next(); elem; elem = elems.next()) {
                    if (elem.tag() != "p" && elem.tag() != "h2")
                        continue;
                        
                    if (text.length)
                        text += '\n';
                        
                    text += elem.text().trim();
                    
                    if (elem.tag() == 'h2')
                        text += '\n';
                }
            }
            
            result.text = text;
        }
        
        console.log(JSON.stringify(result, null, 4));
    });
}

analyze(process.argv[2]);
