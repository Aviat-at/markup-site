import { Fragment, type JSX, type ReactNode } from "react";
import type { MarkdownNode } from "@/lib/content";

function safeUrl(value?: string) {
  if (!value) return undefined;
  const normalized = value.trim();
  if (
    normalized.startsWith("/") ||
    normalized.startsWith("#") ||
    normalized.startsWith("./") ||
    normalized.startsWith("../") ||
    /^(https?:|mailto:)/i.test(normalized)
  ) {
    return normalized;
  }
  return undefined;
}

function children(node: MarkdownNode, key: string): ReactNode {
  return node.children?.map((child, index) => renderNode(child, `${key}-${index}`));
}

function renderNode(node: MarkdownNode, key: string): ReactNode {
  switch (node.type) {
    case "root":
      return <Fragment key={key}>{children(node, key)}</Fragment>;
    case "text":
      return node.value ?? "";
    case "paragraph":
      return <p key={key}>{children(node, key)}</p>;
    case "heading": {
      const level = Math.min(6, Math.max(1, node.depth ?? 2));
      const Heading = `h${level}` as keyof JSX.IntrinsicElements;
      return <Heading id={node.id} key={key}>{children(node, key)}</Heading>;
    }
    case "strong":
      return <strong key={key}>{children(node, key)}</strong>;
    case "emphasis":
      return <em key={key}>{children(node, key)}</em>;
    case "delete":
      return <del key={key}>{children(node, key)}</del>;
    case "inlineCode":
      return <code key={key}>{node.value}</code>;
    case "code":
      return <pre key={key}><code className={node.lang ? `language-${node.lang.replace(/[^a-z0-9_-]/gi, "")}` : undefined}>{node.value}</code></pre>;
    case "blockquote":
      return <blockquote key={key}>{children(node, key)}</blockquote>;
    case "list": {
      const List = node.ordered ? "ol" : "ul";
      return <List start={node.ordered ? node.start ?? undefined : undefined} key={key}>{children(node, key)}</List>;
    }
    case "listItem":
      return <li key={key}>{children(node, key)}</li>;
    case "link": {
      const href = safeUrl(node.url);
      return href ? <a href={href} title={node.title ?? undefined} key={key}>{children(node, key)}</a> : <span key={key}>{children(node, key)}</span>;
    }
    case "image": {
      const src = safeUrl(node.url);
      // Markdown can reference arbitrary remote hosts, so Next Image cannot know
      // the required allow-list at build time. URLs are protocol-validated above.
      // eslint-disable-next-line @next/next/no-img-element
      return src ? <img src={src} alt={node.alt ?? ""} title={node.title ?? undefined} key={key} /> : null;
    }
    case "break":
      return <br key={key} />;
    case "thematicBreak":
      return <hr key={key} />;
    case "table":
      return (
        <table key={key}>
          <thead>
            <tr>
              {(node.children?.[0]?.children ?? []).map((cell, index) => (
                <th key={`${key}-head-${index}`}>{children(cell, `${key}-head-${index}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(node.children ?? []).slice(1).map((row, rowIndex) => (
              <tr key={`${key}-row-${rowIndex}`}>
                {(row.children ?? []).map((cell, cellIndex) => (
                  <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>{children(cell, `${key}-cell-${rowIndex}-${cellIndex}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "tableRow":
      return <tr key={key}>{children(node, key)}</tr>;
    case "tableCell":
      return <td key={key}>{children(node, key)}</td>;
    case "html":
      return node.value ? <pre className="html-source" key={key}>{node.value}</pre> : null;
    default:
      return node.children ? <Fragment key={key}>{children(node, key)}</Fragment> : null;
  }
}

export default function MarkdownContent({ tree }: { tree: MarkdownNode }) {
  return <div className="prose-content">{renderNode(tree, "markdown-root")}</div>;
}
