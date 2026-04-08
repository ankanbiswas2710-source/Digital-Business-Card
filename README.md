# Digital Business Card

A one-page digital business card with:

- Profile image section.
- Tap-to-call and tap-to-email actions.
- **Save Card to Gallery** button that exports a PNG business card image.
- **Save Contact (.vcf)** button that exports a contact file.
- Two sample website links.
- QR code that points to the current page URL.

## Run locally

Open `index.html` directly, or run any static server:

```bash
python3 -m http.server 8000
```

## Profile image

The repo now includes your profile photo embedded as a data URI in `profile-image.js` and applies it automatically on load.
If loading fails on any device, it falls back to `assets/profile-placeholder.svg`.
