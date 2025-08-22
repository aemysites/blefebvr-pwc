/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, exactly as required
  const headerRow = ['Hero (hero8)'];

  // The Hero8 block does not have a Section Metadata block per the provided example

  // 2nd row: Background image. None present in this HTML example, keep cell empty
  const imageRow = [''];

  // 3rd row: All text and CTA as structured content
  // Safely select inner container
  const inner = element.querySelector('.syc-banner--inner-container');
  let cellContent = [];
  if (inner) {
    const content = inner.querySelector('.syc-banner--content');
    if (content) {
      // Compose all textual elements in visual order as block children
      const text = content.querySelector('.syc-banner--text');
      if (text) {
        // Extract text nodes and element nodes in order
        text.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // Plain text node
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            cellContent.push(p);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'span') {
              // Use a <p> for span content
              const p = document.createElement('p');
              p.textContent = node.textContent.trim();
              cellContent.push(p);
            } else if (node.tagName.toLowerCase() === 'em') {
              // Use a <h2> for em content as subheading
              const h2 = document.createElement('h2');
              h2.textContent = node.textContent.trim();
              cellContent.push(h2);
            }
          }
        });
      }
      // Add CTA button (as is, reference directly)
      const cta = content.querySelector('.syc-banner--btn');
      if (cta) cellContent.push(cta);
    }
  }
  // Ensure at least something is present (to avoid empty cell)
  if (cellContent.length === 0) cellContent = [''];

  // Compose the table
  const cells = [
    headerRow, // 1 col, 1 row (header)
    imageRow,  // 1 col, 1 row (background image, or empty)
    [cellContent] // 1 col, 1 row (content)
  ];

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
