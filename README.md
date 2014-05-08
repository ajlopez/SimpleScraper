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


TBD

## Development

```
git clone git://github.com/ajlopez/SimpleScraper.git
cd SimpleScraper
npm install
npm test
```

## Samples

TBD

## References

- [HTML as an Application of SGML](http://www.w3.org/MarkUp/html-spec/html-spec_3.html) 
- [Names](http://www.w3.org/MarkUp/html-spec/html-spec_3.html#SEC3.2.3) A name consists of a letter followed by letters, digits, periods, or hyphens...Element and attribute names are not case sensitive, but entity names are...
- [Attributes](http://www.w3.org/MarkUp/html-spec/html-spec_3.html#SEC3.2.4)

## License

MIT

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleScraper) and submit
[pull requests](https://github.com/ajlopez/SimpleScraper/pulls) — contributions are
welcome<

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

