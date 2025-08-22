/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns
  // The source HTML has: div.columnControl > div.parsys_column.pwccol2-longform > div.parsys_column.pwccol2-longform-c0 and -c1
  const columnControl = element.querySelector('.columnControl');
  if (!columnControl) return;
  const longform = columnControl.querySelector('.parsys_column.pwccol2-longform');
  if (!longform) return;
  const leftCol = longform.querySelector('.parsys_column.pwccol2-longform-c0');
  const rightCol = longform.querySelector('.parsys_column.pwccol2-longform-c1');
  if (!leftCol || !rightCol) return;

  // For robustness, create wrappers for each column's content
  // leftCol and rightCol both contain their respective content blocks
  // This assures all text, buttons, etc. are preserved
  const cells = [
    ['Columns (columns23)'],
    [leftCol, rightCol]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
