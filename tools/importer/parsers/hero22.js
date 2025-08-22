/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, EXACT match to example
  const headerRow = ['Hero (hero22)'];

  // 2. Find the .hero-v2 block
  const heroEl = element.querySelector('.hero-v2, .herov2');
  if (!heroEl) return;

  // 3. Extract the image (background image)
  // The image is inside .herov2__asset-wrapper > .herov2__image-wrapper > picture/img
  // We'll take the <picture> or <img> element directly.
  let imageEl = null;
  const assetWrapper = heroEl.querySelector('.herov2__asset-wrapper, .herov2__image-wrapper');
  if (assetWrapper) {
    imageEl = assetWrapper.querySelector('picture') || assetWrapper.querySelector('img');
  }
  if (!imageEl) {
    // fallback: find first picture or img inside heroEl
    imageEl = heroEl.querySelector('picture') || heroEl.querySelector('img');
  }

  // 4. Compose the first content row: image only
  const imageRow = [imageEl ? imageEl : ''];

  // 5. Extract the content: heading, subheading, CTA
  // According to supplied HTML, use herov2__content-wrapper
  const contentWrapper = heroEl.querySelector('.herov2__content-wrapper') || heroEl;
  const titleEl = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
  const subtitleEl = contentWrapper.querySelector('.herov2__subtitle, p');
  // CTA: any <a> or <button> inside contentWrapper
  const ctaEls = Array.from(contentWrapper.querySelectorAll('a, button'));

  // Compose the content cell, only include elements that exist
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subtitleEl && subtitleEl !== titleEl) contentCell.push(subtitleEl);
  if (ctaEls.length) contentCell.push(...ctaEls);
  // If nothing found, just leave blank
  const contentRow = [contentCell.length ? contentCell : ''];

  // 6. Final table structure
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];

  // 7. Replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
