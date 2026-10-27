# The Hessian Notebook

Personal, interactive study notes on computational chemistry, from coordinates and vectors to the Hessian, DFT, QTAIM, MD, QM/QM′ and machine learning.

## Files

```
index.html                            contents page (built from contents.js)
assets/contents.js                    list of parts and topics: edit this to add a lesson
assets/style.css                      shared styles
assets/theme.js                       light/dark toggle
assets/home.js                        renders the contents page
lessons/_template.html                starting point for a new lesson
lessons/coordinates-displacement.html lesson 1.1
```

## Publish on GitHub Pages (once)

1. Create a repository and push these files to `main`.
2. **Settings → Pages → Deploy from a branch → `main` / root.**
3. The site appears at `https://<username>.github.io/<repository>/`.

## Add a lesson

1. Copy `lessons/_template.html` to `lessons/<slug>.html` and write it.
2. In `assets/contents.js`, add `href: "lessons/<slug>.html"` to that topic.
3. Commit and push.

Topics can be added, removed or reordered at any time; numbering follows the order in `contents.js`.

## Lesson structure

1. **See it**: an interactive figure without heavy math
2. **Calculate it**: a small numerical example worked by hand
3. **Apply it to chemistry**: where the idea appears in optimizations, frequencies, transition states and beyond
4. **Test understanding**: short questions with explanations

Math is written in LaTeX: `\( … \)` inline and `\[ … \]` for display (rendered by MathJax).
