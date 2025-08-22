/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero24)'];

  // --- Background Asset Extraction ---
  let bgAsset = '';
  const videoWrapper = element.querySelector('.herov2__video-wrapper');
  if (videoWrapper) {
    const videoEl = videoWrapper.querySelector('video');
    if (videoEl) {
      const sourceEl = videoEl.querySelector('source');
      if (sourceEl && sourceEl.src) {
        const link = document.createElement('a');
        link.href = sourceEl.src;
        link.textContent = sourceEl.src;
        bgAsset = link;
      }
    } else {
      const desktopPosterStyle = videoWrapper.style.getPropertyValue('--desktopPoster');
      if (desktopPosterStyle) {
        const match = desktopPosterStyle.match(/url\(([^)]+)\)/);
        if (match && match[1]) {
          const img = document.createElement('img');
          img.src = match[1].trim();
          bgAsset = img;
        }
      }
    }
  } else {
    const imgEl = element.querySelector('img');
    if (imgEl) {
      bgAsset = imgEl;
    }
  }
  const backgroundRow = [bgAsset || ''];

  // --- Content Extraction (robustly gather all hero text blocks) ---
  let contentEls = [];
  const contentWrapper = element.querySelector('.herov2__content-wrapper');
  if (contentWrapper) {
    // Aggregate all first-level block elements with text, preserving order
    const blocks = Array.from(contentWrapper.children).filter(el => el.textContent && el.textContent.trim().length > 0);
    if (blocks.length > 0) {
      contentEls = blocks;
    } else {
      // If nothing at first level, go deeper for headings/paragraphs with content
      const deepBlocks = Array.from(contentWrapper.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div')).filter(el => el.textContent && el.textContent.trim().length > 0);
      if (deepBlocks.length > 0) {
        contentEls = deepBlocks;
      }
    }
  }
  // Fallback: all block-level text in the element
  if (contentEls.length === 0) {
    contentEls = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6, p')).filter(el => el.textContent && el.textContent.trim().length > 0);
  }
  // Last resort: if still empty, put the element itself in
  if (contentEls.length === 0) {
    contentEls = [element];
  }

  // The content row contains ALL blocks, not just the first one
  const contentRow = [contentEls.length === 1 ? contentEls[0] : contentEls];

  // Build table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
