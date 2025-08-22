/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column control that holds columns
  const columnControl = element.querySelector('.columnControl');
  if (!columnControl) return;

  // Columns are immediate .parsys_column children of .columnControl .pwccol2-longform
  const parsysColumns = columnControl.querySelectorAll('.pwccol2-longform > .parsys_column');
  if (parsysColumns.length === 0) return;

  // Build column cells by extracting each column's container content
  const columnCells = Array.from(parsysColumns).map(col => {
    // Each col probably has a single .cmp-container as the direct child
    const cmp = col.querySelector(':scope > .cmp-container');
    if (!cmp) {
      // fallback: if no container, return an empty div
      return document.createElement('div');
    }
    // Gather all children of this container
    const children = Array.from(cmp.children);
    if (children.length === 1) {
      return children[0];
    }
    // If multiple child elements, group as fragment
    const frag = document.createDocumentFragment();
    children.forEach(child => frag.appendChild(child));
    return frag;
  });

  // Assemble the block table, following the required header
  const cells = [
    ['Columns (columns5)'],
    columnCells
  ];

  // Create the block table via helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block
  element.replaceWith(table);
}
