# Product Gallery Static Site

This is a small, reusable product showcase template built with plain HTML, CSS, and browser JavaScript. It has three pages:

- `index.html` shows a featured product hero.
- `gallery.html` shows a searchable and filterable product gallery.
- `product.html?id=<product-id>` shows one product with images, description, features, specifications, pricing, contact details, and optional media.

There is no build step and no dependency install required.

## Project Structure

- `site-config.js` contains reusable site settings, page paths, category filter values, default contact details, CTA settings, and email signup configuration.
- `products.js` contains product catalog data only.
- `storefront.js` contains shared rendering logic for the home page, gallery, product detail page, filtering, and email signup handling.
- `style.css` contains all shared page and component styling.
- `images/` contains product and shared image assets.
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
node --check products.js
node --check storefront.js
```

## Configure

Edit `site-config.js` to change template-wide settings:

- `siteName` and `siteTagline`
- `featuredProductId`
- `pages`
- `categories`
- `specificationFilters`
- `defaultDistributorContact`
- `defaultCta` for the universal Contact us button label and destination URL
- `socialLinks` for up to 3 optional footer social media links and icon image paths
- `emailSignup`
- `text`

Category dropdown values and optional specification dropdowns come from `site-config.js`, so filter values can be added or renamed without changing component logic.

## Add Products

Edit `products.js` to add or update products. Each product supports:

- `id`
- `name`
- `image`
- `description`
- `features`
- `specifications`
- `price`
- `distributorContact`
- `category`
- `featured`
- `galleryImages`
- `tags`
- optional `accentColor` and `videoUrl`

Use image paths relative to the project root, such as `images/product-030-01.webp`.

## Email Signup

The footer signup form is frontend-only by default. Submission is isolated in `storefront.js` through `submitEmailSignup`, and `site-config.js` exposes `emailSignup.endpoint` for future services such as Mailchimp, ConvertKit, SendGrid, or a custom API.

When no endpoint is configured, the form validates the email and shows the configured success message without contacting an external service.

## Deploy

The existing `.cpanel.yml` copies the static files into `$HOME/public_html/`. For other hosts, deploy the HTML, CSS, JavaScript, and image files as static assets.
