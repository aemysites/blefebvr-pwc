/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct column blocks (.columnControl) under element
  function getColumnControls(root) {
    // Handles both .parsys > .columnControl and direct .columnControl
    const controls = [];
    // Direct .columnControl children
    root.querySelectorAll(':scope > .columnControl').forEach(el => controls.push(el));
    // .parsys > .columnControl
    root.querySelectorAll(':scope > .parsys > .columnControl').forEach(el => controls.push(el));
    return controls;
  }

  // Helper: get all columns (.parsys_column*) under a .columnControl
  function getColumns(control) {
    return Array.from(control.querySelectorAll(':scope > .parsys_column'));
  }

  // Helper: extract all meaningful content from a column
  function extractColumnContent(col) {
    // Find all cmp-container inside column (these contain content blocks)
    const containers = Array.from(col.querySelectorAll(':scope > .cmp-container'));
    const blocks = [];
    if (containers.length) {
      containers.forEach(container => {
        // For each child of container, add if contains content
        Array.from(container.children).forEach(child => {
          // Filter out empty divs, divs with only whitespace
          if ((child.textContent && child.textContent.trim()) || child.querySelector('*')) {
            blocks.push(child);
          }
        });
      });
    } else {
      // If no containers, grab all direct children with content
      Array.from(col.children).forEach(child => {
        if ((child.textContent && child.textContent.trim()) || child.querySelector('*')) {
          blocks.push(child);
        }
      });
    }
    // If no blocks found, return empty string
    if (blocks.length === 0) return '';
    if (blocks.length === 1) return blocks[0];
    return blocks;
  }

  // Gather all columns from each control
  const allCols = [];
  const controls = getColumnControls(element);
  controls.forEach(control => {
    const cols = getColumns(control);
    cols.forEach(col => {
      const content = extractColumnContent(col);
      allCols.push(content);
    });
  });

  // Only create the block if we have columns with content
  if (allCols.length) {
    const headerRow = ['Columns (columns25)'];
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      allCols
    ], document);
    element.replaceWith(table);
  }
}
