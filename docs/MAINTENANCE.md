# Storefront Maintenance Guide

This document is the implementation map for the Linden & Light Jewelry site. Use it to find the correct edit point, preserve the existing data flow, and extend the storefront without duplicating configuration or page logic.

## Architecture At A Glance

The site is a dependency-free static storefront. Every page loads the same three scripts in this order:

1. `site-config.js` creates `window.StorefrontConfig`.
2. `products.js` creates `window.StorefrontProducts`.
3. `storefront.js` reads both objects, hydrates shared HTML, and renders whichever page mounts are present.

The renderer is intentionally mount-driven. `storefront.js` runs all page initializers, but each initializer exits immediately when its page-specific root element is absent. This keeps one shared script usable across all three pages.

```text
site-config.js ---------+
                        |
products.js ------------+--> storefront.js --> existing HTML mount points
                                                   |
style.css <----------------------------------------+
```

There is no bundler, package manager, template engine, or framework runtime.

## Current Feature Inventory

The current redesign includes the following implemented behavior.

### Brand And Visual System

- Linden & Light Jewelry branding and seller-focused copy
- Tucson-summer colors led by sky blue, sun yellow, and desert purple
- Large readable typography and generous control sizing
- Clear keyboard focus styles and high-contrast interactive states
- Responsive phone and laptop layouts
- Persistent Home, Shop jewelry, and Our story navigation

### Home Page

- Shop introduction and direct collection call to action
- Three-step shopping explanation
- Featured carousel controlled by each product's `featured` boolean
- Linked carousel image and linked product title
- Four-second autoplay interval
- Soft blur-fade transition
- Previous and next arrow controls
- Horizontal pointer and touch swipe navigation
- Current-image rendering with adjacent featured-image preloading
- Seller story with a brief scroll reveal

### Collection Page

- Product search across names, descriptions, categories, features, tags, and specifications
- Config-driven category dropdown
- Config-driven specification dropdowns
- Featured-product filter using the product boolean
- Live result count and empty-result message
- Responsive product-card grid
- Viewport-based lazy loading for gallery card images

### Product Detail Page

- Query-string product selection
- Selectable product image thumbnails
- Product description, price, features, and specifications
- Clear purchase panel and product-specific inquiry subject
- Shared seller contact with optional product override
- Optional YouTube media support
- Missing-product fallback

### Shared Site Behavior

- Config-hydrated navigation, text, links, footer, and social profiles
- Frontend email validation with an optional JSON endpoint
- Reduced-motion handling
- Dependency-free validation script
- Static-hosting compatibility

### Preserved Asset Decisions

- Existing files in `images/` remain the active product library.
- Product IDs stay aligned with the existing image filenames.
- A product's primary image remains the first image in its gallery.
- Assets are loaded only when referenced by configuration, catalog data, HTML, or CSS.

## Change Matrix

| Goal | Primary edit point | Notes |
| --- | --- | --- |
| Change shop name, tagline, navigation, or reusable wording | `site-config.js` | Prefer `text` keys over hard-coded HTML changes. |
| Change page paths | `site-config.js` `pages` | All links marked with `data-page-link` are hydrated from this object. |
| Add or edit a product | `products.js` | Keep product IDs unique and image paths valid. |
| Mark a product as featured | `products.js` `featured` | Use a boolean. Do not create a featured category or tag. |
| Change the first featured item | `site-config.js` `featuredProductId` | The product must also have `featured: true`. |
| Change carousel timing or blur-fade duration | Constants at the top of `storefront.js` | `FEATURED_ROTATION_MS`, `FEATURED_FADE_OUT_MS`, and `FEATURED_FADE_IN_MS`. |
| Change categories | `site-config.js` `categories` | Product category values must match configured values. |
| Add a generated specification filter | `site-config.js` `specificationFilters` | The filter key must exist in product `specifications`. |
| Change colors, spacing, radii, or widths | `style.css` `:root` | Reuse tokens instead of adding isolated values where practical. |
| Change responsive layout | Bottom of `style.css` | Current breakpoints are 980px, 720px, and 420px. |
| Change seller contact details | `site-config.js` `defaultDistributorContact` | A product can optionally override this object. |
| Change the purchase action | `site-config.js` `defaultCta` | Mail links automatically receive a product-specific subject. |
| Connect the email form | `site-config.js` `emailSignup` and `submitEmailSignup` in `storefront.js` | The default behavior is frontend-only. |
| Add or change footer social links | `site-config.js` `socialLinks` | The shared renderer displays up to three links. |
| Add a new page section | Page HTML plus `style.css` | Add JavaScript only when the section needs dynamic behavior. |
| Add a new page | New HTML file plus `site-config.js` if it needs a named path | Load scripts in the standard order and use the shared data attributes. |

## File Responsibilities

### `index.html`

Owns the home page structure:

- Announcement and shared header
- Intro and shopping steps
- `#featured-product-container`, the featured carousel mount
- Collection link
- `#about`, the seller story
- Shared footer and email signup

The carousel's product markup is generated by `renderHomePage`; do not duplicate slide markup in the HTML.

### `gallery.html`

Owns the collection page structure:

- Collection heading
- Search input
- Category selector
- `#specification-filters`, the generated filter mount
- `#gallery-results-summary`, the result count
- `#product-gallery`, the product-card mount

Search and filter events are attached by `renderGalleryPage`.

### `product.html`

Owns the product detail shell:

- `#main-product-image`, the selected large image
- `#product-info`, the generated product copy, price, purchase panel, and contact details
- `#extra-images-container`, selectable image thumbnails
- `#media-slot`, optional YouTube media

The selected record comes from the `id` query parameter:

```text
product.html?id=product-001
```

### `site-config.js`

Owns site-wide settings and text. It should not contain individual product descriptions or product image lists.

The object is exposed as:

```js
window.StorefrontConfig
```

Important groups:

- `pages`: canonical static page paths.
- `categories`: gallery category values and labels.
- `specificationFilters`: product specification keys that become dropdowns.
- `defaultDistributorContact`: seller information used unless a product overrides it.
- `defaultCta`: the shared purchase action.
- `socialLinks`: up to three footer links.
- `emailSignup`: enablement, endpoint, and status messages.
- `text`: reusable interface copy hydrated into HTML.

`storefront.js` contains a fallback configuration so the UI fails gracefully if optional fields are omitted. The real settings should still be maintained in `site-config.js`.

### `products.js`

Owns catalog data only. `createProduct` normalizes every record and supplies defaults for optional arrays, objects, and booleans.

The catalog is exposed as an ID-keyed object:

```js
window.StorefrontProducts
```

Product schema:

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | Yes | Unique URL-safe key, such as `product-030`. |
| `name` | Yes | Display title and image alternative text. |
| `description` | Yes | Gallery and detail copy. |
| `features` | Yes | Array shown under "What makes it special." |
| `specifications` | Yes | Key-value object used by details and optional filters. |
| `price` | Yes | Number, or `null` to display "Contact for price." |
| `category` | Yes | Must match a category value in `site-config.js`. |
| `featured` | Recommended | Boolean controlling carousel and featured filtering. Defaults to `false`. |
| `imageCount` | Conditional | Generates convention-based image paths when `galleryImages` is omitted. |
| `galleryImages` | Conditional | Explicit ordered image paths. Overrides `imageCount`. |
| `image` | No | Explicit primary image. Defaults to the first gallery image. |
| `tags` | No | Search-only terms that are not necessarily displayed. |
| `accentColor` | No | Product-level CSS accent. |
| `distributorContact` | No | Product-specific contact override. |
| `videoUrl` | No | Supported YouTube watch, short, embed, or `youtu.be` URL. |

Convention-based image example:

```js
createProduct({
  id: "product-030",
  name: "Example Pendant",
  description: "A concise customer-facing description.",
  features: ["First feature", "Second feature"],
  specifications: {
    availability: "In stock",
    material: "Gold tone",
    size: "18-inch chain",
  },
  price: 72,
  category: "necklaces",
  featured: false,
  imageCount: 3,
  tags: ["gold", "pendant"],
  accentColor: "#8a5ac7",
});
```

This expects:

```text
images/product-030-01.webp
images/product-030-02.webp
images/product-030-03.webp
```

Explicit image example:

```js
galleryImages: [
  "images/custom-front.webp",
  "images/custom-side.webp",
]
```

### `storefront.js`

Owns behavior and generated markup. Its sections run in this order:

1. Configuration and data access
2. Shared DOM and formatting helpers
3. Shared header/footer hydration
4. Home carousel
5. Gallery filtering and cards
6. Product details and media
7. Email signup
8. Scroll reveal
9. Application initialization and public API

The public API is available at `window.Storefront`. It exposes the three page renderers, selected utilities, and the email submission function for testing or future integration.

### `style.css`

Owns all visual presentation. It is organized in the same broad order as the pages:

1. Design tokens and global element defaults
2. Announcement, header, and navigation
3. Home intro and buttons
4. Featured carousel
5. About section
6. Gallery filters and cards
7. Product detail layout
8. Footer and email form
9. Reveal animation and reduced-motion handling
10. Responsive breakpoints

Use the `:root` custom properties for broad visual changes. Some historical token names such as `--color-sage` now hold blue palette values; they remain named this way to avoid unnecessary selector churn.

### `scripts/validate-site.js`

Checks:

- Required scripts and shared footer hooks exist in every page.
- HTML IDs are not duplicated.
- Configuration contains required paths, categories, contacts, and social data.
- Product IDs, categories, booleans, arrays, and image paths are valid.
- Product primary images match the first gallery image.
- Shared utility behavior remains intact.

Run it after data, configuration, HTML, or renderer changes.

## Shared HTML Hooks

`hydrateSharedElements` connects HTML to `site-config.js`.

| Hook | Behavior |
| --- | --- |
| `data-site-name` | Inserts `siteName`. |
| `data-current-year` | Inserts the browser's current year. |
| `data-config-text="key"` | Inserts `config.text[key]`. |
| `data-config-placeholder="key"` | Inserts a placeholder from `config.text[key]`. |
| `data-page-link="key"` | Inserts a URL from `config.pages[key]`. |
| `data-social-links` | Mounts configured social links. |
| `data-email-signup` | Marks a shared signup form. |
| `data-email-status` | Receives signup feedback. |
| `data-reveal` | Opts an element into scroll reveal. |

When adding reusable copy, add a `text` key in `site-config.js` and reference it with `data-config-text`. Keep meaningful fallback text in the HTML so the page remains understandable before scripts run.

## Featured Carousel

`renderHomePage` builds the carousel from:

```js
products.filter((product) => product.featured === true)
```

Behavior:

- `featuredProductId` is moved to the first position only when that record is also featured.
- Each slide renders one linked primary image and one linked title.
- Autoplay begins a transition every four seconds.
- The current slide softly blurs and fades out; the next slide blurs and fades in.
- Previous and next controls wrap around the featured list.
- Pointer and mouse gestures support horizontal swiping.
- Autoplay pauses during pointer, hover, focus, and hidden-tab interaction.
- Reduced-motion users receive immediate slide changes.

Loading strategy:

- Only the current slide is added to the DOM.
- The first image receives high fetch priority.
- Adjacent featured images preload after the current image is ready.
- The cache stores image readiness promises so repeat navigation does not create duplicate requests.

To adjust behavior, edit the constants at the top of `storefront.js`. Keep JavaScript durations synchronized with the matching animation durations in `style.css`.

## Gallery Search And Loading

Gallery search includes:

- Product name
- Description
- Display category
- Features
- Tags
- Specification values
- The word `featured` when `featured` is true

Product-card images start as a transparent placeholder. An `IntersectionObserver` assigns the real `data-src` shortly before a card reaches the viewport. Browsers without `IntersectionObserver` load the image immediately.

To add a filter:

1. Add a consistent key to product `specifications`.
2. Add `{ key: "yourKey", label: "Your label" }` to `specificationFilters`.
3. Run validation and test the generated dropdown.

## Product Detail Rendering

`renderProductDetailPage`:

1. Reads `id` from the query string.
2. Finds the matching record.
3. Sets the page title and product accent.
4. Renders name, description, price, and purchase action.
5. Adds feature, specification, and contact sections when data exists.
6. Mounts the main image and selectable thumbnails.
7. Mounts optional YouTube media.

Missing products receive a clear message and a collection link. Empty optional sections are not rendered.

## Contact And Purchase Links

The default purchase button comes from:

```js
defaultCta: {
  label: "Ask to purchase",
  url: "mailto:hello@lindenandlight.com",
}
```

When the URL starts with `mailto:`, `getContactCta` adds the selected product name as the email subject. Non-email URLs are used unchanged.

Contact information resolves in this order:

1. `product.distributorContact`
2. `config.defaultDistributorContact`

## Email Signup Integration

With an empty endpoint, the form validates locally and displays the configured success message without a network request.

To connect a service:

1. Set `emailSignup.endpoint` in `site-config.js`.
2. Confirm the provider accepts a JSON `POST` body containing the form fields.
3. If the provider requires a different request shape, update only `submitEmailSignup`.
4. Keep success and failure UI inside `initEmailSignup`.

Do not place secret API keys in this static client. Use a serverless function or backend endpoint when authentication is required.

## Accessibility Contracts

Preserve these behaviors while extending the site:

- Visible keyboard focus styles for links, controls, inputs, and selectors.
- Meaningful image alternative text.
- Buttons for carousel and thumbnail actions; links for navigation.
- `aria-live` result counts and carousel status.
- Minimum comfortable control sizes.
- Persistent main navigation at phone widths.
- Reduced-motion overrides in the `prefers-reduced-motion` media query.
- Heading order that starts with one page-level `h1`.

## Responsive Contracts

Current breakpoints:

- Above 980px: wide home, gallery, and sticky product layouts.
- 980px and below: primary layouts collapse to one column; carousel controls move inward.
- 720px and below: compact header, three-column navigation, single-column cards and forms.
- 420px and below: tighter product metrics and thumbnail grids.

Test at minimum:

- 390 x 844 phone viewport
- 1280 x 800 laptop viewport

Check navigation wrapping, carousel controls, image cropping, filter widths, product details, and horizontal overflow.

## Adding A New Dynamic Section

Use the existing mount pattern:

1. Add a semantic HTML root with a unique ID.
2. Add a render or initializer function in the appropriate `storefront.js` section.
3. Exit immediately when the root does not exist.
4. Call the function from `init`.
5. Add styles near the related page section in `style.css`.
6. Add configurable copy to `site-config.js`.
7. Add validation when the new feature introduces a required contract.

Example initializer shape:

```js
function renderExampleSection(documentRef, config, data) {
  const root = documentRef.getElementById("example-section");

  if (!root) {
    return;
  }

  // Render only the data this mount needs.
}
```

## Verification Checklist

Run:

```sh
node --check site-config.js
node --check products.js
node --check storefront.js
node scripts/validate-site.js
git diff --check
```

Then preview through a local server:

```sh
python3 -m http.server 8080
```

Verify:

- Home carousel autoplay, arrows, links, blur-fade, and swipe.
- Gallery search, category filters, generated specification filters, and lazy images.
- Product image selection, price, purchase action, contact details, and optional media.
- Footer signup success and validation messages.
- Keyboard focus and reduced-motion behavior.
- Phone and laptop layouts.

## Current Design Decisions

The current redesign intentionally uses:

- A bright Tucson-summer palette led by blues, yellows, and purples.
- Large readable type, high-contrast controls, and straightforward navigation for an older audience.
- Product imagery as the primary visual focus.
- A simple Home to Collection to Product to Purchase path.
- A compact featured carousel containing only an image and title.
- Existing product image files and product ID mappings.
- Static hosting compatibility with no build step.

When extending the site, preserve these decisions unless the design direction is explicitly changed.
