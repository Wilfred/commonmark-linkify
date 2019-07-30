const commonmark = require("commonmark");

function textNode(text) {
  const node = new commonmark.Node("text", undefined);
  node.literal = text;
  return node;
}

function linkNode(text, url) {
  const urlNode = new commonmark.Node("link", undefined);
  urlNode.destination = url;
  urlNode.appendChild(textNode(text));

  return urlNode;
}

function splitMatches(text, regexp) {
  // Regexp must be sticky.
  regexp = new RegExp(regexp, "gm");

  let i = 0;
  const result = [];

  let match = regexp.exec(text);
  while (match) {
    const matchText = match[0];

    if (match.index > i) {
      result.push([text.substring(i, match.index), false]);
    }

    result.push([matchText, true]);
    i = match.index + matchText.length;

    match = regexp.exec(text);
  }

  if (i < text.length) {
    result.push([text.substring(i, text.length), false]);
  }

  return result;
}

const urlRegexp = new RegExp("https?://[^ ]+[^ .,]");

function splitURLs(textNodes) {
  const text = textNodes.map(n => n.literal).join("");
  const parts = splitMatches(text, urlRegexp);

  return parts.map(part => {
    if (part[1]) {
      return linkNode(part[0], part[0]);
    } else {
      return textNode(part[0]);
    }
  });
}

function transform(parsed) {
  const walker = parsed.walker();
  let event;

  let nodes = [];
  while ((event = walker.next())) {
    const node = event.node;
    if (event.entering && node.type === "text") {
      nodes.push(node);
    } else {
      if (nodes.length > 0) {
        splitURLs(nodes)
          .reverse()
          .forEach(newNode => {
            nodes[0].insertAfter(newNode);
          });

        nodes.forEach(n => n.unlink());
        nodes = [];
      }
    }
  }

  if (nodes.length > 0) {
    splitURLs(nodes)
      .reverse()
      .forEach(newNode => {
        nodes[0].insertAfter(newNode);
      });
    nodes.forEach(n => n.unlink());
  }

  return parsed;
}

module.exports = transform;
