/* global WebImporter */
export default function parse(element, { document }) {
  // The block must have a header row with exactly one column, matching the example
  const headerRow = ['Columns (columns14)'];

  // Extract all top-level links in the block
  const links = Array.from(element.querySelectorAll(':scope > a.strip-btn'));

  // Arrange links into two rows of two columns each
  const row1 = [];
  const row2 = [];

  if (links.length >= 2) {
    row1.push(links[0], links[1]);
  } else {
    // fill missing columns with empty cells
    row1.push(links[0] || document.createElement('span'));
    row1.push(document.createElement('span'));
  }
  if (links.length >= 4) {
    row2.push(links[2], links[3]);
  } else {
    if (links.length > 2) {
      row2.push(links[2]);
    } else {
      row2.push(document.createElement('span'));
    }
    if (links.length > 3) {
      row2.push(links[3]);
    } else {
      row2.push(document.createElement('span'));
    }
  }

  // Compose table rows: header (one column), then content (two columns per row)
  const cells = [
    headerRow,
    row1,
    row2
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
