
"use strict"

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

function isTagStart(text, position) {
    if (!text)
        return false;
        
    if (text[position] !== '<')
        return false;
        
    if (!isLetter(text[position + 1]))
        return false;
        
    return true;
}

function isTagEnd(text, position) {
    if (!text)
        return false;
        
    if (text[position] !== '/')
        return false;
        
    if (text[position + 1] !== '>')
        return false;
        
    return true;
}

function isTagStartClose(text, position) {
    if (!text)
        return false;
        
    if (text[position] !== '<')
        return false;
        
    if (text[position + 1] !== '/')
        return false;
        
    return true;
}

const TokenType = { Name: 1, Integer: 2, String: 3, Delimiter: 4 };

function Parser(text, start) {
    let position = start;
    const length = text.length;
    
    this.nextToken = function () {
        skipSpaces();
        
        if (position >= length)
            return null;
            
        const ch = text[position++];
        
        if (isLetter(ch))
            return nextName(ch);
            
        if (ch === '"' || ch === "'")
            return nextString(ch);
            
        return { value: ch, type: TokenType.Delimiter };
    }
    
    function skipSpaces() {
        while (position < length && isSpace(text[position]))
            position++;
    }
    
    function nextName(ch) {
        let value = ch;
        
        while (position < length && isLetterOrDigit(text[position]))
            value += text[position++];
            
        return { value: value, type: TokenType.Name };
    }
    
    function nextString(delimiter) {
        let value = '';
        
        while (position < length && text[position] !== delimiter)
            value += text[position++];
            
        if (position >= length)
            throw new Error('Unclosed string');
        else
            position++;
            
        return { value: value, type: TokenType.String };
    }
}

function Element(text, start) {
    let end = -1;
    const self = this;
    let tagname = null;
    let attributes = null;
    let classes = null;
    
    if (!text || text[start] !== '<')
        throw new Error("Invalid element: " + text.substring(start, start + 30) + "...");
        this.tag = function () {
        if (tagname)
            return tagname;
                    let name = '';                for (let k = start + 1; text[k] && (isLetter(text[k]) || isDigit(text[k])); k++)            name += text[k];                    tagname = name.toLowerCase();
        
        return tagname;    }
    
    this.text = function () {
        return getText(this.toString());
    }
    
    this.length = function () {
        if (end < 0)
            calculateEnd();
            
        return end - start + 1;
    }
    
    this.elements = function (filter) {
        const doc = createDocument(this.toString());
        
        return doc.elements(filter);
    }
    
    this.element = function (filter) {
        const doc = createDocument(this.toString());
        
        return doc.elements(filter).first();
    }
    
    this.hasClass = function (classname) {
        if (!classes) {
            const attrclass = this.attribute('class');
            
            if (!attrclass)
                return false;
                
            classes = attrclass.trim().split(/\s+/);
        }
        
        return classes.indexOf(classname) >= 0;
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
            
        const result = { };
        
        const parser = new Parser(text, start);
        
        parser.nextToken(); // '<'
        parser.nextToken(); // tag name
        
        let token = parser.nextToken();
        
        while (token && token.type === TokenType.Name) {
            const name = token.value;
            
            token = parser.nextToken();
            
            if (token && token.type === TokenType.Delimiter && token.value === '=') {
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
        const tagname = self.tag();
        
        for (let k = start + 1; text[k]; k++) {
            if (isTagEnd(text, k)) {
                end = k + 1;
                return;
            }
            
            if (isTagStartClose(text, k)) {
                if (text.substring(k + 2, k + 2 + tagname.length).toLowerCase() !== tagname) {
                    end = k - 1;
                    return;
                }
                
                if (text[k + 2 + tagname.length] !== '>') {
                    end = k - 1;
                    return;
                }
                
                end = k + 2 + tagname.length;
                
                return;
            }
            
            if (isTagStart(text, k)) {
                const innertag = new Element(text, k);
                const innerlength = innertag.length();

                k = k + innerlength - 1;
            }
        }
        
        end = k - 1; 
    }
}

function ElementIterator(text, filter) {
    const l = text ? text.length : 0;
    let pos = 0;
    let fn;
    
    if (filter)
        if (typeof filter === 'function')
            fn = filter;
        else if (typeof filter === 'string')
            fn = makefilters(filter);
        else
            throw "Invalid filter";

    this.next = function () {
        for (; pos < l; pos++)
            if (isTagStart(text, pos)) {
                const tag = new Element(text, pos++);
                
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
        const filters = text.trim().split(/\s+/);
        let fn = null;
        
        filters.forEach(function (filter) {
            const fnf = makefilter(filter);
            
            if (fn)
                fn = makeand(fn, fnf);
            else
                fn = fnf;                
        });
        
        return fn;
        
        function makefilter(text) {
            if (text[0] === '.') {
                const classname = text.substring(1);
                
                return function (element) {
                    return element.hasClass(classname);
                };
            }

            if (text[0] === '#') {
                const idname = text.substring(1);
                
                return function (element) {
                    return element.attribute('id') === idname;
                };
            }

            if (text[0] === '@') {
                const attrname = text.substring(1);
                
                return function (element) {
                    return element.attribute(attrname) != null;
                };
            }
                
            return function (element) {
                return element.tag() === text;
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
    const iterator = new ElementIterator(doc.toString(), filter);
    
    this.count = function () {
        iterator.reset();
        
        let n = 0;
        
        while (iterator.next())
            n++;
            
        return n;
    }
    
    this.next = function () {
        return iterator.next();
    }
    
    this.first = function () {
        iterator.reset();
        
        return iterator.next();
    }
}

function Document(text) {
    this.toString = function () { return text; }        this.elements = function (filter) { return new Find(this, filter); }
    
    this.element = function (filter) { return (new Find(this, filter)).first(); }

    this.text = function () { return getText(text); };
}

function getText(text) {
    let result = '';
    const l = text.length;
    let level = 0;
    
    for (let k = 0; k < l; k++) {
        const ch = text[k];

        if (ch === '<')
            level++;
        else if (ch === '>')
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

