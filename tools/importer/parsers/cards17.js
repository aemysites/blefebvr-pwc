/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match the example exactly
  const headerRow = ['Cards (cards17)'];
  // Get all immediate child columns
  const colNodes = Array.from(element.querySelectorAll(':scope > .parsys_column'));
  const rows = [headerRow];
  colNodes.forEach((col) => {
    // Each card is under .cmp-container inside the column
    const container = col.querySelector('.cmp-container');
    if (!container) return;
    const textimage = container.querySelector('.textimage');
    if (!textimage) return;
    // First cell: image
    const img = textimage.querySelector('.textimage-image img');
    // Second cell: full .textimage-text contents (preserves heading, paragraphs, cta, etc)
    // Reference the whole .textimage-text div so we don't miss any content/formatting
    const textDiv = textimage.querySelector('.textimage-text');
    if (img || textDiv) {
      rows.push([
        img || '',
        textDiv || ''
      ]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
