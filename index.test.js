const commonmark = require("commonmark");
const transform = require("./index");

function transformAndRender(src) {
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(src);

  return writer.render(transform(parsed)).trim();
}

test("Text without URL", () => {
  expect(transformAndRender("foo")).toBe("<p>foo</p>");
});

test("Multiple URLs", () => {
  expect(transformAndRender("http://foo.com http://bar.com")).toBe(
    '<p><a href="http://foo.com">http://foo.com</a> <a href="http://bar.com">http://bar.com</a></p>'
  );
});

test("HTTP URL", () => {
  expect(transformAndRender("http://example.com")).toBe(
    '<p><a href="http://example.com">http://example.com</a></p>'
  );
});

test("HTTPS URL", () => {
  expect(transformAndRender("https://example.com")).toBe(
    '<p><a href="https://example.com">https://example.com</a></p>'
  );
});

test("URL with path and parameters", () => {
  expect(
    transformAndRender("http://example.com/foo?bar=baz&amp;biz=42#more-stuff")
  ).toBe(
    '<p><a href="http://example.com/foo?bar=baz&amp;biz=42#more-stuff">http://example.com/foo?bar=baz&amp;biz=42#more-stuff</a></p>'
  );
});

test("Trailing punctuation", () => {
  expect(transformAndRender("Foo http://example.com. Bar.")).toBe(
    '<p>Foo <a href="http://example.com">http://example.com</a>. Bar.</p>'
  );
});

test("Ignore existing links", () => {
  expect(transformAndRender("[foo](http://example.com)")).toBe(
    '<p><a href="http://example.com">foo</a></p>'
  );
});
