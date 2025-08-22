/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns inside the columns block
  const parsys = element.querySelector('.parsys_column.pwccol2-longform');
  if (!parsys) return;

  // Select all direct child columns
  const columns = Array.from(parsys.querySelectorAll(':scope > .parsys_column'));
  // For each column, extract the main cmp-container's children (real content)
  const columnContent = columns.map(col => {
    // Only consider the first .cmp-container in each column
    const container = col.querySelector(':scope > .cmp-container');
    if (container) {
      // If only one child, return it directly
      const children = Array.from(container.children).filter(node => node.nodeType === 1 && !(node.tagName === 'DIV' && node.innerHTML.trim() === ''));
      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        // Wrap in a fragment if multiple elements
        const frag = document.createDocumentFragment();
        children.forEach(child => frag.appendChild(child));
        return frag;
      } else {
        // If no non-empty children, return an empty div for layout
        return document.createElement('div');
      }
    }
    // fallback: return empty div for layout
    return document.createElement('div');
  });

  // Instead of putting all columns in a single row,
  // create a row for each column's content,
  // so output is two rows, each with one column (to match the example)

  const cells = [
    ['Columns (columns21)'],
    [columnContent[0], columnContent[1]]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
