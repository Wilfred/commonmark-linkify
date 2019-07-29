# Linkify for commonmark.js

This package offers an AST transformer for converting bare URLs to
links in commonmark.

## Usage

```javascript
var commonmark = require("commonmark");
var linkifyTransform = require("commonmark-linkify");

var src = "foo http://example.com bar";

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();

var parsed = reader.parse(src);
var transformed = linkifyTransform(parsed);

var htmlSrc = writer.render(transformed);
```
