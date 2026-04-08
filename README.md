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

If you want your real profile picture shown, add your file at:

`assets/profile.jpg`

Then change the image path in `index.html` from `assets/profile-placeholder.svg` to `assets/profile.jpg`.
