/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate columns
  const columns = element.querySelectorAll(':scope > .parsys_column');
  if (columns.length < 2) return;

  // For each column, find its main content, reference the real element
  const colCells = [];
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    // Find the immediate cmp-container in this column
    const container = col.querySelector(':scope > .cmp-container');
    if (container) {
      // If it contains a .text-component, use that
      const text = container.querySelector(':scope > .text-component');
      if (text) {
        colCells.push(text);
        continue;
      }
      // If it contains an image, use the first <img>
      const img = container.querySelector(':scope img');
      if (img) {
        colCells.push(img);
        continue;
      }
      // If it contains a single block element, use it
      const onlyChild = container.children.length === 1 ? container.firstElementChild : null;
      if (onlyChild) {
        colCells.push(onlyChild);
        continue;
      }
      // Default: use the entire container
      colCells.push(container);
    } else {
      // Default: use col itself
      colCells.push(col);
    }
  }

  // Build the table
  const rows = [
    ['Columns (columns4)'],
    colCells
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
