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
