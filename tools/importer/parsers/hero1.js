/* global WebImporter */
export default function parse(element, { document }) {
  // Table Header: block name and variant
  const headerRow = ['Hero (hero1)'];

  // --- Row 2: Background image ---
  // Locate image asset in hero block
  let imageEl = null;
  const assetWrapper = element.querySelector('.herov2__asset-wrapper');
  if (assetWrapper) {
    // Prefer <picture> for responsive handling
    imageEl = assetWrapper.querySelector('picture');
    if (!imageEl) {
      // Fallback: use <img> if no <picture>
      imageEl = assetWrapper.querySelector('img');
    }
  }
  // If no asset-wrapper, try top-level for img/picture
  if (!imageEl) {
    imageEl = element.querySelector('picture') || element.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- Row 3: Text Content (title, subtitle, cta) ---
  let contentEls = [];
  const contentWrapper = element.querySelector('.herov2__content-wrapper');
  if (contentWrapper) {
    // Subtitle (optional)
    const subtitle = contentWrapper.querySelector('.herov2__subtitle');
    if (subtitle) contentEls.push(subtitle);
    // Title (optional, usually <h1>)
    const title = contentWrapper.querySelector('.herov2__title');
    if (title) contentEls.push(title);
    // Any additional paragraphs or CTA
    Array.from(contentWrapper.children).forEach((child) => {
      if (
        child !== subtitle &&
        child !== title &&
        (child.tagName === 'P' || child.tagName === 'A' || child.tagName === 'BUTTON')
      ) {
        contentEls.push(child);
      }
    });
  }
  // Fallback for alternate markup (no contentWrapper)
  if (contentEls.length === 0) {
    // Accept all headings and paragraphs at block level
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = element.querySelectorAll('p');
    contentEls = [...headings, ...paragraphs];
  }
  const contentRow = [contentEls.length > 0 ? contentEls : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
