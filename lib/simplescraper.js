
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
        if (typeof filter == 'function')
            fn = filter;
        else if (typeof filter == 'string')
            fn = makefilters(filter);
        else
            throw "Invalid filter";

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
    
    function makefilters(text) {
        var filters = text.trim().split(/\s+/);
        var fn = null;
        
        filters.forEach(function (filter) {
            var fnf = makefilter(filter);
            
            if (fn)
                fn = makeand(fn, fnf);
            else
                fn = fnf;                
        });
        
        return fn;
        
        function makefilter(text) {
            if (text[0] == '.')
                return function (element) {
                    var classattr = element.attribute('class');
                    
                    if (!classattr)
                        return false;
                        
                    var classes = classattr.trim().split(/\s+/);
                    
                    return classes.indexOf(text.substring(1)) >= 0;
                };
                
            return function (element) {
                return element.tag() == text;
            };
        }
        
        function makeand(fn, fnf) {
            return function (element) {
                if (!fn(element))
                    return false;
                return fnf(element);
            }
        }
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

function createDocument(text) {
    return new Document(text);
}

function createElement(text) {
    return new Element(text, 0);
}

module.exports = {
    document: createDocument,
    element: createElement
}
