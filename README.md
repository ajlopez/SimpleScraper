# SimpleScraper

SimpleScraper define parsers.

## Installation

Via npm on Node:

```
npm install simplescraper
```

## Usage

Reference in your program:

```js
var ss = require('simplescraper');
```

Create a document:
```js
var doc = ss.document(doctext);
```

Find and process elements:
```js
var elems = doc.elements();

for (var elem = elems.next(); elem; elem = elems.next()) {
    // process element
}
```

Find elements by tag:
```js
var elems = doc.elements('div');

```

Find elements by class:
```js
var elems = doc.elements('.news');

```

Find elements by id:
```js
var elems = doc.elements('#content');
```

Combined filters:
```js
var elems = doc.elements('div .news');
```

Find first element (or null):
```js
var firstelem = doc.element('div');
var firstelem = doc.element('.news');
var firstelem = doc.element('#content');
```

Filter elements:
```js
var elems = doc.elements(function (element) { return element.attribute('style') != null; });
```


Get attribute in an element (or null value):
```js
var myattr = elem.attribute('myattr');
```

Get attributes (as a plain JavaScript object, each attribute name is a property):
```js
var attrs = elem.attributes();
// { class: 'news', type: 'text', ... }
```


Get element tag name as string:
```js
var tagname = elem.tag();
```


## Development

```
git clone git://github.com/ajlopez/SimpleScraper.git
cd SimpleScraper
npm install
npm test
```

## Samples

- [Clarin Argentinean news site](https://github.com/ajlopez/SimpleScraper/tree/master/samples/clarin)
- [La Nacion Argentinean news site](https://github.com/ajlopez/SimpleScraper/tree/master/samples/lanacion)

## References

- [HTML as an Application of SGML](http://www.w3.org/MarkUp/html-spec/html-spec_3.html) 
- [Names](http://www.w3.org/MarkUp/html-spec/html-spec_3.html#SEC3.2.3) A name consists of a letter followed by letters, digits, periods, or hyphens...Element and attribute names are not case sensitive, but entity names are...
- [Attributes](http://www.w3.org/MarkUp/html-spec/html-spec_3.html#SEC3.2.4)

## Versions

- 0.0.1: Published

## License

MIT

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleScraper) and submit
[pull requests](https://github.com/ajlopez/SimpleScraper/pulls) — contributions are
welcome<

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

