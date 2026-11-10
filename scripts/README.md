# Sync scripts

Single sources live in this repository; the scripts copy them. Run from `HCDT_Guideline/` after editing a source:

| Source | Command | Copied to |
|---|---|---|
| `shared/hcdt-embed.css` (tokens, width contract, step guide, toolbar, frames, segmented control) | `node scripts/sync-shared.js` | `hcdt-embed.css` in every tool repository (sibling folders). The guideline pages link the source directly. |
| `assets/js/tool-frame.js` (editor frame height) | `node scripts/sync-tool-frame.js` | inlined between the `tool-frame` markers of `index.html` and `wordpress/visual-guideline-block.html` |

Do not edit the copies. Tool pages link `hcdt-embed.css` after their own `hcdt-ui.css`.
