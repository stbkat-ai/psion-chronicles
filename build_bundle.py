#!/usr/bin/env python3
"""Bundle the Psion Chronicles app into ONE self-contained HTML file.

Inlines styles.css + all 5 scripts into the index.html body markup, producing
dist/psion_chronicles.html — a single file with zero external requests, suitable
for publishing as a Claude Artifact or dropping on any static host.

The output is BODY CONTENT ONLY (no <!doctype>/<html>/<head>/<body> tags), because
the Artifact publisher wraps it in its own document skeleton. It still renders fine
as a standalone file in any browser.

Run:  python build_bundle.py
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(ROOT, "app")
JS_ORDER = ["data.js", "items.js", "rules.js", "app.js", "play.js"]


def read(name):
    with open(os.path.join(APP, name), encoding="utf-8") as f:
        return f.read()


def main():
    css = read("styles.css")
    html = read("index.html")

    # Body markup = everything between <body> and the first <script> tag.
    body = html.split("<body>", 1)[1]
    markup = body.split("<script", 1)[0].strip()

    # Defensive charset declaration — harmless when the host/head already sets UTF-8,
    # but prevents em-dash/emoji mojibake when the file is opened or served standalone.
    parts = ['<meta charset="utf-8">', "<style>\n" + css + "\n</style>", markup]
    for name in JS_ORDER:
        js = read(name)
        # Defensive: a literal </script> inside JS would close the block early.
        js = js.replace("</script", "<\\/script")
        parts.append("<!-- " + name + " -->\n<script>\n" + js + "\n</script>")

    out = "\n\n".join(parts)
    dist = os.path.join(ROOT, "dist")
    os.makedirs(dist, exist_ok=True)
    dest = os.path.join(dist, "psion_chronicles.html")
    with open(dest, "w", encoding="utf-8") as f:
        f.write(out)
    print("wrote %s (%d bytes)" % (dest, len(out)))


if __name__ == "__main__":
    main()
