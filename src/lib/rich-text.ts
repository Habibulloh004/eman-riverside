export function sanitizeRichTextHtml(html: string): string {
  if (!html) return "";

  const allowedTags = new Set([
    "p",
    "br",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "span",
    "div",
  ]);

  const sanitizeInlineStyle = (rawStyle: string): string => {
    const declarations = rawStyle.split(";");
    const safe: string[] = [];

    declarations.forEach((declaration) => {
      const parts = declaration.split(":");
      if (parts.length < 2) return;

      const property = parts[0].trim().toLowerCase();
      const value = parts.slice(1).join(":").trim();
      if (!property || !value) return;

      const loweredValue = value.toLowerCase();
      if (
        loweredValue.includes("url(") ||
        loweredValue.includes("expression") ||
        loweredValue.includes("@import") ||
        loweredValue.includes("javascript:") ||
        loweredValue.includes("var(") ||
        loweredValue.includes("calc(")
      ) {
        return;
      }

      const isColor = /^(#[0-9a-f]{3,8}|[a-z]+|rgba?\(\s*[\d.\s,]+\))$/i.test(value);
      const isFontSize =
        /^(\d+(\.\d+)?(px|rem|em|%)|xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger)$/i.test(
          value
        );

      const validators: Record<string, boolean> = {
        color: isColor,
        "background-color": isColor,
        "font-weight": /^(normal|bold|bolder|lighter|[1-9]00)$/i.test(value),
        "font-style": /^(normal|italic|oblique)$/i.test(value),
        "text-decoration": /^(none|underline|line-through|overline)(\s+(underline|line-through|overline))*$/i.test(
          value
        ),
        "text-align": /^(left|right|center|justify|start|end)$/i.test(value),
        "font-size": isFontSize,
        "list-style-type": /^(disc|circle|square|decimal|lower-alpha|upper-alpha|lower-roman|upper-roman)$/i.test(
          value
        ),
      };

      if (validators[property]) {
        safe.push(`${property}:${value}`);
      }
    });

    return safe.join("; ");
  };

  const escapeAttribute = (value: string): string =>
    value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const getAttributeValue = (attrs: string, attrName: string): string => {
    const regex = new RegExp(`${attrName}\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))`, "i");
    const match = attrs.match(regex);
    return (match?.[2] || match?.[3] || match?.[4] || "").trim();
  };

  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (fullTag, rawTagName: string, rawAttrs: string) => {
      const tagName = rawTagName.toLowerCase();
      if (!allowedTags.has(tagName)) return "";

      const isClosingTag = /^<\s*\//.test(fullTag);
      if (isClosingTag) return `</${tagName}>`;

      if (tagName === "br") return "<br>";

      if (tagName === "a") {
        const href = getAttributeValue(rawAttrs, "href");
        const isSafeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(href);
        return isSafeHref
          ? `<a href="${escapeAttribute(href)}" rel="noopener noreferrer">`
          : "<a>";
      }

      const style = sanitizeInlineStyle(getAttributeValue(rawAttrs, "style"));
      return style ? `<${tagName} style="${escapeAttribute(style)}">` : `<${tagName}>`;
    })
    .trim();
}
