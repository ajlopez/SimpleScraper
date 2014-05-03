
function isLetter(ch) {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
}

function isDigit(ch) {
    return ch >= '0' && ch <= '9';
}

function isLetterOrDigit(ch) {
    return isLetter(ch) || isDigit(ch);
}

function isSpace(ch) {
    return ch <= ' ';
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
        
        for (var k = position; k < length && (isLetter(text[k]) || isDigit(text[k])); k++)
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

var TokenType = { Name: 1, Integer: 2, String: 3, Delimiter: 4 };

function Parser(text, start) {
    var position = start;
    var length = text.length;
    
    this.nextToken = function () {
        skipSpaces();
        
        if (position >= length)
            return null;
            
        var ch = text[position++];
        
        if (isLetter(ch))
            return nextName(ch);
            
        if (ch == '"' || ch == "'")
            return nextString(ch);
            
        return { value: ch, type: TokenType.Delimiter };
    }
    
    function skipSpaces() {
        while (position < length && isSpace(text[position]))
            position++;
    }
    
    function nextName(ch) {
        var value = ch;
        
        while (position < length && isLetterOrDigit(text[position]))
            value += text[position++];
            
        return { value: value, type: TokenType.Name };
    }
    
    function nextString(delimiter) {
        var value = '';
        
        while (position < length && text[position] != delimiter)
            value += text[position++];
            
        if (position >= length)
            throw new Error('Unclosed string');
        else
            position++;
            
        return { value: value, type: TokenType.String };
    }
}

function Element(text, start) {
    var end = -1;
    var self = this;
    var tagname = null;
    var attributes = null;
    
    if (!text || text[0] != '<')
        throw new Error("Invalid element");
        this.tag = function () {
        if (tagname)
            return tagname;
                    var name = '';                for (var k = start + 1; text[k] && (isLetter(text[k]) || isDigit(text[k])); k++)            name += text[k];                    tagname = name.toLowerCase();
        
        return tagname;    }
    
    this.text = function () {
        return getText(this.toString());
    }
    
    this.length = function () {
        if (end < 0)
            calculateEnd();
            
        return end - start;
    }
    
    this.toString = function () {
        if (end < 0)
            calculateEnd();
            
        return text.substring(start, end + 1);
    }
    
    this.attribute = function (name) {
        if (!attributes)
            this.attributes();
            
        if (attributes.hasOwnProperty(name))
            return attributes[name];
            
        return null;
    }
    
    this.attributes = function () {
        if (attributes)
            return attributes;
            
        var result = { };
        
        var parser = new Parser(text, start);
        
        parser.nextToken(); // '<'
        parser.nextToken(); // tag name
        
        var token = parser.nextToken();
        
        while (token && token.type == TokenType.Name) {
            var name = token.value;
            
            token = parser.nextToken();
            
            if (token && token.type == TokenType.Delimiter && token.value == '=') {
                token = parser.nextToken();
                result[name] = token.value;
                token = parser.nextToken();
            }
            else
                result[name] = true;
        }
        
        attributes = result;
        
        return result;
    }
    
    function calculateEnd() {
        var tagname = self.tag();
        
        for (var k = start + 1; text[k]; k++) {
            if (text[k] == '/' && text[k + 1] == '>') {
                end = k + 1;
                return;
            }
            
            if (text[k] == '<' && text[k + 1] == '/') {
                if (text.substring(k + 2, k + 2 + tagname.length) != tagname) {
                    end = k - 1;
                    return;
                }
                
                if (text[k + 2 + tagname.length] != '>') {
                    end = k - 1;
                    return;
                }
                
                end = k + 2 + tagname.length;
                return;
            }
            
            if (text[k] == '<') {
                var innertag = new Element(text, k);
                var innerlength = innertag.length();
                k = k + innerlength - 1;
            }
        }
        
        end = k - 1; 
    }
}

function ElementIterator(text, filter) {
    var l = text ? text.length : 0;
    var pos = 0;
    var fn;
    
    if (filter)
        if (typeof filter == "string")
            if (filter[0] == '.')
                fn = function (element) { return element.attributes().class == filter.substring(1) };
            else
                fn = function (element) { return element.tag() == filter; };

    this.next = function () {
        for (; pos < l; pos++)
            if (text[pos] == '<' && isLetter(text[pos+1])) {
                var tag = new Element(text, pos++);
                
                if (fn && !fn(tag))
                    continue;
                    
                return tag;
            }
        
        return null;
    }
    
    this.reset = function () {
        pos = 0;
    }
}

function Find(doc, filter) {
    var iterator = new ElementIterator(doc.toString(), filter);
    
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

function Document(text) {
    this.toString = function () { return text; }        this.find = function (filter) { return new Find(this, filter); }
    
    this.text = function () { return getText(text); };
}

function getText(text) {
    var result = '';
    var l = text.length;
    var level = 0;
    
    for (var k = 0; k < l; k++) {
        var ch = text[k];
        if (ch == '<')
            level++;
        else if (ch == '>')
            level--;
        else if (level <= 0)
            result += ch;
    }
    
    return result;
}

function doc(text) {
    return new OldDocument(text);
}

function createDocument(text) {
    return new Document(text);
}

function createElement(text) {
    return new Element(text, 0);
}

module.exports = {
    doc: doc,
    document: createDocument,
    element: createElement
}
