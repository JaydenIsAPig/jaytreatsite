# Linden & Light Jewelry Static Site

This is a small, accessible jewelry storefront built with plain HTML, CSS, and browser JavaScript. It has three pages:

- `index.html` introduces the shop, explains the three-step shopping path, shows featured pieces, and includes the seller story.
- `gallery.html` shows a searchable and filterable jewelry collection.
- `product.html?id=<product-id>` shows one piece with price, purchase guidance, selectable images, details, and contact information.

There is no build step and no dependency install required.

## Project Structure

- `site-config.js` contains reusable site settings, page paths, category filter values, default contact details, CTA settings, and email signup configuration.
- `products.js` contains product catalog data only.
- `storefront.js` contains shared rendering logic for the home page, gallery, product detail page, filtering, and email signup handling.
- `style.css` contains all shared page and component styling.
- `images/` contains product and shared image assets.
- `scripts/validate-site.js` runs lightweight sanity checks.
- `docs/MAINTENANCE.md` is the full architecture, customization, extension, and verification guide.

For future changes, start with [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md). It includes a change matrix, product schema, HTML hooks, renderer flow, loading strategy, responsive contracts, and recipes for extending the storefront.

## Rebrand Implementation Notes

- The existing product image files and their product ID mappings are intentionally unchanged.
- Site-wide brand wording, navigation labels, contact details, categories, and reusable interface text live in `site-config.js`.
- Jewelry names, prices, descriptions, searchable tags, and piece details live in `products.js`.
- `storefront.js` renders the featured home content, collection cards, product-specific purchase links, selectable product views, filters, and email form behavior.
- The home featured carousel is built from every product whose `featured` boolean is `true`. Each slide renders only its linked image and title, lingers for four seconds, then softly blurs and fades into the next item. It also supports arrows and horizontal touch swipes.
- Featured images are requested on demand. After the current image renders, only the neighboring images are preloaded and decoded to keep manual navigation responsive without loading the full image catalog.
- Elements marked with `data-reveal` use `initScrollReveal` for the brief seller-story fade-in. Reduced-motion preferences are respected in `style.css`.
- The header keeps Home, Shop jewelry, and Our story visible at all screen sizes instead of hiding navigation behind a menu.
- The CSS uses larger type, strong focus states, generous touch targets, and responsive one-, two-, and three-column layouts for phone and laptop use.
- The shared color system in `style.css` uses a Tucson-summer palette led by brilliant sky blues, hot sun yellows, and violet desert-sunset tones.

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
node --check products.js
node --check storefront.js
```

## Configure

Edit `site-config.js` to change shop-wide settings:

- `siteName` and `siteTagline`
- `featuredProductId`
- `pages`
- `categories`
- `specificationFilters`
- `defaultDistributorContact` for the shared seller contact record
- `defaultCta` for the universal purchase-inquiry label and destination URL
- `socialLinks` for up to 3 optional footer social media links and icon image paths
- `emailSignup`
- `text`

Category dropdown values and optional specification dropdowns come from `site-config.js`, so filter values can be added or renamed without changing component logic. The `featured` dropdown value matches pieces whose `featured` boolean is `true`.

## Add Products

Edit `products.js` to add or update jewelry pieces. Each record supports:

- `id`
- `name`
- `image`
- `description`
- `features`
- `specifications`
- `price`
- `distributorContact`
- `category`
- `featured` boolean, which defaults to `false` when omitted
- `galleryImages`
- `tags`
- optional `accentColor` and `videoUrl`

Use image paths relative to the project root, such as `images/product-030-01.webp`.

## Email Signup

The footer signup form is frontend-only by default. Submission is isolated in `storefront.js` through `submitEmailSignup`, and `site-config.js` exposes `emailSignup.endpoint` for future services such as Mailchimp, ConvertKit, SendGrid, or a custom API.

When no endpoint is configured, the form validates the email and shows the configured success message without contacting an external service.

## Deploy

The existing `.cpanel.yml` copies the static files into `$HOME/public_html/`. For other hosts, deploy the HTML, CSS, JavaScript, and image files as static assets.
