#!/usr/bin/env python3
"""Render master-cv.md into index.html (GitHub Pages). Run: python3 -I build.py

Source of truth is the markdown files in this folder. index.html is generated from
master-cv.md; cv-n8n.md is kept alongside but not rendered.
"""
import html
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "master-cv.md"
OUT = HERE / "index.html"


def inline(text: str) -> str:
    t = html.escape(text, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![*\w])\*([^*\n]+)\*(?![*\w])", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2">\1</a>', t)
    # unresolved placeholders stay visible while the CV is a draft
    t = re.sub(r"\[([^\]\n]+)\]", r'<span class="todo">[\1]</span>', t)
    return t


def contact(text: str) -> str:
    t = inline(text)
    t = re.sub(r"([\w.+-]+@[\w-]+\.[\w.]+)", r'<a href="mailto:\1">\1</a>', t)
    t = re.sub(r"(linkedin\.com/in/[\w-]+)", r'<a href="https://www.\1">\1</a>', t)
    return t


def render(md: str):
    lines = md.splitlines()
    name, contact_line = "Siimon Härm", ""
    body, notes = [], []
    i, para, in_ul, in_quote = 0, [], False, False

    def flush_para():
        nonlocal para
        if para:
            body.append("<p>" + "<br>".join(inline(p.rstrip()) for p in para) + "</p>")
            para = []

    def close_ul():
        nonlocal in_ul
        if in_ul:
            body.append("</ul>")
            in_ul = False

    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        if line.startswith("# "):
            name = line[2:].strip()
            # next non-empty line is the contact line
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            contact_line = lines[j].strip()
            i = j + 1
            continue
        if line.startswith(">"):
            flush_para(); close_ul()
            notes.append(line.lstrip("> ").strip())
        elif line.strip() == "---":
            flush_para(); close_ul()
        elif line.startswith("## "):
            flush_para(); close_ul()
            body.append(f"<h2>{inline(line[3:].strip())}</h2>")
        elif line.startswith("### "):
            flush_para(); close_ul()
            body.append(f'<h3>{inline(line[4:].strip())}</h3>')
        elif line.startswith("- "):
            flush_para()
            if not in_ul:
                body.append("<ul>")
                in_ul = True
            body.append(f"<li>{inline(line[2:].strip())}</li>")
        elif not line.strip():
            flush_para(); close_ul()
        else:
            close_ul()
            para.append(line)
        i += 1
    flush_para(); close_ul()
    return name, contact_line, notes, "\n".join(body)


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{name}: CV</title>
<meta name="description" content="CV of {name}: engineering manager, platform and AI infrastructure.">
<style>
:root{{--bg:#fbfaf7;--fg:#1c1f23;--muted:#5b6470;--accent:#1f5eff;--line:#e3e0d8;--card:#ffffff;--todo:#b45309;--todo-bg:#fff4e0}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#111418;--fg:#e8eaed;--muted:#9aa3ad;--accent:#7aa2ff;--line:#2a2f36;--card:#171b20;--todo:#fbbf6a;--todo-bg:#2a2012}}}}
:root[data-theme="dark"]{{--bg:#111418;--fg:#e8eaed;--muted:#9aa3ad;--accent:#7aa2ff;--line:#2a2f36;--card:#171b20;--todo:#fbbf6a;--todo-bg:#2a2012}}
*{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%}}
body{{margin:0;background:var(--bg);color:var(--fg);font:17px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}}
a{{color:var(--accent)}}
.hero{{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);min-height:420px;border-bottom:1px solid var(--line)}}
.hero .photo{{background:#222 url(cover.jpg) 46% 24%/cover no-repeat;min-height:420px}}
.hero .intro{{display:flex;flex-direction:column;justify-content:center;padding:48px clamp(24px,5vw,72px)}}
.hero h1{{margin:0 0 8px;font-size:clamp(34px,5vw,56px);line-height:1.05;letter-spacing:-.02em}}
.hero .contact{{color:var(--muted);margin:0}}
main{{max-width:760px;margin:0 auto;padding:40px 24px 80px}}
h2{{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:6px;margin:44px 0 16px}}
h3{{font-size:19px;margin:28px 0 2px}}
h3 + p em{{color:var(--muted)}}
p{{margin:8px 0}}
ul{{padding-left:20px;margin:8px 0}}
li{{margin:6px 0}}
code{{font:.9em ui-monospace,Menlo,monospace}}
.todo{{background:var(--todo-bg);color:var(--todo);border-radius:4px;padding:0 3px}}
.draft{{background:var(--card);border:1px dashed var(--line);border-radius:8px;padding:12px 16px;color:var(--muted);font-size:14px;margin-bottom:8px}}
footer{{max-width:760px;margin:0 auto;padding:0 24px 48px;color:var(--muted);font-size:13px}}
@media (max-width:760px){{
  .hero{{grid-template-columns:1fr}}
  .hero .photo{{min-height:300px;background-position:46% 22%}}
  .hero .intro{{padding:28px 16px}}
  main{{padding:24px 16px 64px}}
  footer{{padding:0 16px 40px}}
}}
@media print{{
  .hero{{grid-template-columns:140px 1fr;min-height:0}}
  .hero .photo{{min-height:140px}}
  .draft,footer{{display:none}}
  body{{font-size:11pt;background:#fff;color:#000}}
}}
</style>
</head>
<body>
<header class="hero">
  <div class="photo" role="img" aria-label="Siimon Härm speaking at an event"></div>
  <div class="intro">
    <h1>{name}</h1>
    <p class="contact">{contact}</p>
  </div>
</header>
<main>
{notes}
{body}
</main>
<footer>Source: <a href="master-cv.md">master-cv.md</a> · tailored: <a href="cv-n8n.md">cv-n8n.md</a></footer>
</body>
</html>
"""


def main():
    name, contact_line, notes, body = render(SRC.read_text(encoding="utf-8"))
    notes_html = "".join(f'<div class="draft">{inline(n)}</div>' for n in notes)
    OUT.write_text(
        TEMPLATE.format(name=html.escape(name), contact=contact(contact_line), notes=notes_html, body=body),
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
