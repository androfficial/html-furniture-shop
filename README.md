# Furniture Shop

Landing page for Funiro, a furniture store, where a visitor can add products to a cart, load more products from JSON and browse several sliders. Built in June 2021 as a learning project.

**Live demo:** [androfficial.github.io/html-furniture-shop](https://androfficial.github.io/html-furniture-shop/)

## Features

- "Add to cart" sends a copy of the product photo flying into the header cart, then updates the cart counter and the cart dropdown, where each product shows its quantity and a Delete link that removes one item at a time.
- "Show More" fetches `json/products.json`, appends four more product cards built from it and then disappears.
- Swiper sliders: the hero slider and the rooms slider with parallax captions, and the tips slider with 3, 2 or 1.1 slides per view. All of them loop and have arrows and clickable dots.
- With a mouse, the #FuniroFurniture photo wall pans sideways as the cursor moves across it; on touch screens it scrolls natively.
- The header gets a translucent background once the page scrolls past the top (IntersectionObserver). The Products and Rooms submenus open on hover, or with the arrow button on touch screens.
- Below 992 px the search field opens from its icon, and at 768 px and below a burger button opens the menu and locks page scroll. On touch phones the footer menus turn into accordions.

## Tech stack

- **Framework:** none, plain HTML and JavaScript
- **Data:** `fetch` of a local JSON file (`json/products.json`)
- **UI:** Swiper 6, lightgallery.js 1
- **Styling:** SCSS compiled to CSS (the SCSS sources are not in the repository), an icon font
- **Tooling:** built with Gulp 4, which produced the plain and minified bundles in `css/` and `js/`
- **Hosting:** GitHub Pages

## Getting started

The repository holds the compiled site, with no dependencies and no build step. "Show More" loads its data with `fetch`, which browsers block for `file://` pages, so serve the folder over HTTP, for example with `npx serve .` on Node.js 18 or later.

```bash
git clone https://github.com/androfficial/html-furniture-shop.git
cd html-furniture-shop
npx serve .
```

Then open the local address that `serve` prints.

## Notes

- The cart lives only in the page, so a reload empties it. The favourites, share and like links have no targets.
- lightgallery.js is attached to the photo wall, but its stylesheet is not included, so a clicked photo opens in an unstyled viewer.
- Cards loaded from JSON get `item-product__label_sale` and `item-product__label_new` classes, while the stylesheet styles `item-product__label--sale` and `--new`, so their labels have no background colour.
