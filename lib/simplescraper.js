
function isletter(ch) {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
}

function isdigit(ch) {
    return ch >= '0' && ch <= '9';
}

function Item(text, position) {
    var length = text.length;
    var tag = getTag(position + 1);
    
    this.tag = function () {
        return tag;
    }
    
    this.text = function () {
        var result = '';
        var nopened = 0;
        
        var k = position;

        while (true) {
            for (; k < length && text[k] != '>'; k++)
                ;
                
            if (text[k - 1] == '/' && nopened == 0)
                return null;
            
            nopened++;        
            k++;
                
            for (; k < length && text[k] != '<'; k++)
                result += text[k];
                
            if (k < length)
                if (text[k + 1] == '/') {
                    var closedtag = getTag(k + 2);
                    if (closedtag == tag)
                        return result;
                }
        }
    }
    
    this.attributes = function () {
        return { };
    }
    
    function getTag(position) {
        var tagname = '';
        
        for (var k = position; k < length && (isletter(text[k]) || isdigit(text[k])); k++)
            tagname += text[k];
        
        return tagname.toLowerCase();
    }
}

function Iterator(text) {
    var position = 0;
    var length = text.length;
    
    this.next = function () {
        while (true) {
            while (position < length && text[position] != '<')
                position++;
                
            if (position >= length)
                return null;

            if (text[position + 1] != '/')
                return new Item(text, position++);        
                
            position++;
        }
    }
    
    this.first = function () {
        position = 0;
        return this.next();
    }
    
    this.reset = function () { position = 0; }
}

function Where(iterator, fn) {
    iterator.reset();
    
    this.first = function () {
        iterator.reset();
        
        return this.next();
    }
    
    this.next = function () {
        for (var item = iterator.next(); item; item = iterator.next())
            if (fn(item))
                return item;
                
        return null;
    }
    
    this.reset = function() {
        iterator.reset();
    }
    
    this.where = function (fn) {
        return new Where(this, fn);
    }
    
    this.toArray = function () {
        this.reset();
        
        var result = [];

        for (var item = this.next(); item; item = this.next())
            result.push(item);
                
        return result;
    }
}

function OldDocument(text) {
    var iterator = new Iterator(text);
    
    this.select = function (tag) {
        tag = tag.toLowerCase();
        return new Where(iterator, function (item) { return item.tag() == tag });
    };
    
    this.reset = function () {
        iterator.reset();
    }
    
    this.next = function() {
        return iterator.next();
    }
    
    this.where = function (fn) {
        return new Where(this, fn);
    }
}

function Tag(text, start) {    this.tag = function () {        var name = '';                for (var k = start + 1; text[k] && (isletter(text[k]) || isdigit(text[k])); k++)            name += text[k];                    return name.toLowerCase();    }
}

function TagIterator(text) {
    var l = text ? text.length : 0;
    var pos = 0;

    this.next = function () {
        for (; pos < l; pos++)
            if (text[pos] == '<' && isletter(text[pos+1]))
                return new Tag(text, pos++);
        
        return null;
    }
    
    this.reset = function () {
        pos = 0;
    }
}

function Find(doc) {
    var iterator = new TagIterator(doc.toString());
    
    this.count = function () {
        iterator.reset();
        
        var n = 0;
        
        while (iterator.next())
            n++;
            
        return n;
    }
    
    this.next = function () {
        return iterator.next();
        return new TagIterator(doc.toString());
    }
    
    this.first = function () {
        iterator.reset();
        return iterator.next();
    }
}

function isletter(ch)
{
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
}function isdigit(ch){    return ch >= '0' && ch <= '9';}

function Document(text) {
    this.toString = function () { return text; }        this.find = function () { return new Find(this); }
}

function doc(text) {
    return new OldDocument(text);
}

function document(text) {
    return new Document(text);
}

module.exports = {
    doc: doc,
    document: document
}
