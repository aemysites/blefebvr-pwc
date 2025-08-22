/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for this block exactly as specified
  const headerRow = ['Columns (columns19)'];

  // Get the two main .parsys_column children representing the columns
  const columns = element.querySelectorAll(':scope > .parsys_column');
  if (columns.length < 2) return; // Defensive: require at least 2 columns

  // --- First column: image block ---
  let col0Content = null;
  // Try to find the main image-containing block
  const imgBlock = columns[0].querySelector('.image');
  if (imgBlock) {
    col0Content = imgBlock;
  } else {
    // fallback: collect any content
    col0Content = columns[0];
  }

  // --- Second column: text block (list) ---
  let col1Content = null;
  // Try to find the main text component or any list or paragraph
  const textComp = columns[1].querySelector('.text-component');
  if (textComp) {
    col1Content = textComp;
  } else {
    // fallback: use all content
    col1Content = columns[1];
  }

  // Compose the rows as per example: header, then exactly one row with 2 columns
  const cells = [
    headerRow,
    [col0Content, col1Content]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
