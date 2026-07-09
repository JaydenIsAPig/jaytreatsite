# JayTreats Static Site

JayTreats is a small static dessert site with three pages, this project also has 2 other sites as branches, Jewlery-Site to show off what the template is capable of and template for others to use and me to repurpose:

- `index.html` shows the featured treat.
- `gallery.html` shows a searchable archive.
- `treat.html?id=<treat-id>` shows one treat with ingredients, allergens, images, and an optional YouTube embed.

The project uses plain HTML, CSS, and browser JavaScript. There is no build step and no npm dependency install required.

## Project Structure

- `site-config.js` contains reusable site settings: featured treat, price, page paths, social links, payment settings, and shared copy.
- `treats.js` contains the treat catalog only.
- `gallery.js` contains shared rendering logic for the home page, archive, and detail page.
- `style.css` contains all shared page and component styling.
- `images/` contains treat and social media images.
- `scripts/validate-site.js` runs lightweight sanity checks.

## Run Locally

Open `index.html` directly in a browser, or serve the folder locally:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Validate

Run the dependency-free validation script:

```sh
node scripts/validate-site.js
```

Useful extra syntax checks:

```sh
node --check site-config.js
node --check treats.js
node --check gallery.js
```

## Configure

Edit `site-config.js` to change the reusable site settings:

- `featuredTreatId`: the treat shown on the home page.
- `featuredPrice`: the preorder amount.
- `defaultOrderNote`: the note added to payment links.
- `pages`: local page names.
- `social`: Instagram URL and icon path.
- `payment`: payment provider base URL and username.
- `text`: shared labels and page copy.

Edit `treats.js` to add or update treats. Each treat should include:

- `name`
- `vibe`
- `ingredients`
- `allergens`
- `images`
- optional `youtubeID`

Use image paths relative to the project root, such as `images/example-main.webp`.

## Deploy

The existing `.cpanel.yml` copies the project files into `/home/jaytreat/public_html/`. Because this is a static site, deployment only needs the HTML, CSS, JS, and image files.

## Repurpose

To adapt this for another catalog-style site, replace the content in `site-config.js`, swap the records in `treats.js`, and update the assets in `images/`. The render functions in `gallery.js` are intentionally separated from the catalog so the same structure can be reused for other product, menu, portfolio, or archive pages.
