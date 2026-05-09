# ANJ Construction Website

This project is a static website served from the `website` folder inside the renamed `anj` workspace.

## Main Files

- `index.html` - page structure and business content
- `styles.css` - layout, colors, responsive design, and visual styling
- `script.js` - mobile navigation, project filters, service tabs, footer year, and form demo behavior

You can open `index.html` directly in a browser. For a local server, run commands from `anj/website`:

```powershell
npm run dev
```

Then visit:

```text
http://localhost:5173
```

## Editing

Most content is directly in `index.html`. Search for `TODO` to find values that still need real business details:

- Formspree form ID
- Office address
- Phone number and hours
- Email addresses
- License numbers

The contact form stays in demo mode until `TODO_FORM_ID` is replaced with a real Formspree ID.

## Project Structure

The workspace is intentionally small. The website is separate from the reusable brand assets:

```text
anj/
|-- assets/
|   |-- anj-logo-horizontal.svg
|   |-- anj-logo-primary.svg
|   `-- anj-mark-square.svg
`-- website/
    |-- index.html
    |-- about.html
    |-- projects.html
    |-- reviews.html
    |-- contact.html
    |-- services.html
    |-- styles.css
    |-- script.js
    |-- package.json
    `-- README.md
```
