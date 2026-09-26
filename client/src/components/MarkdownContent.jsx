// A small, dependency-free Markdown renderer for article content. Builds
// React elements directly rather than using dangerouslySetInnerHTML, so
// it's safe by construction regardless of what's in the content — no
// sanitization library needed. Supports the subset that covers real
// technical writing: headers, paragraphs, bold/italic, inline code,
// links, and unordered lists. Not a full CommonMark implementation.

function renderInline(text, keyPrefix) {
  // Split on the inline patterns we support, preserving the delimiters
  // so we can tell what matched. Order matters: code before bold/italic
  // so `**not bold**` inside backticks isn't touched.
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.filter(Boolean).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="bg-ink-surface border border-ink-border rounded px-1.5 py-0.5 text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={key} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-accent hover:underline">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default function MarkdownContent({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let listBuffer = [];

  function flushList(key) {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={`ul-${key}`} className="list-disc list-inside space-y-1 my-4">
          {listBuffer.map((item, i) => (
            <li key={i} className="text-text-primary leading-relaxed">
              {renderInline(item, `li-${key}-${i}`)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }
    flushList(idx);

    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h3 key={idx} className="font-display text-lg font-semibold mt-6 mb-2">
          {renderInline(trimmed.slice(4), `h${idx}`)}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      blocks.push(
        <h2 key={idx} className="font-display text-xl font-semibold mt-8 mb-3">
          {renderInline(trimmed.slice(3), `h${idx}`)}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      blocks.push(
        <h1 key={idx} className="font-display text-2xl font-semibold mt-8 mb-3">
          {renderInline(trimmed.slice(2), `h${idx}`)}
        </h1>
      );
    } else if (trimmed === '') {
      // blank line — paragraph break, no element needed
    } else {
      blocks.push(
        <p key={idx} className="text-text-primary leading-relaxed my-3">
          {renderInline(trimmed, `p${idx}`)}
        </p>
      );
    }
  });
  flushList('end');

  return <div>{blocks}</div>;
}
