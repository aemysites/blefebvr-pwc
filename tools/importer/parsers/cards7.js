/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing all contacts cards
  const contactsSection = element.querySelector('section.contactModule');
  if (!contactsSection) return;

  // Cards (cards7) block header row - exactly as in the example
  const cells = [['Cards (cards7)']];

  // Select all card columns
  const contactCols = contactsSection.querySelectorAll('.contactCol');

  contactCols.forEach(card => {
    // First cell: image (reference existing element)
    const img = card.querySelector('img.contact_image');

    // Second cell: gathering all visible text content and action links
    const cellContent = document.createElement('div');

    const contactContent = card.querySelector('.contact-content');
    if (contactContent) {
      // Extract name
      const nameEl = contactContent.querySelector('.contact-name');
      if (nameEl) {
        const strong = document.createElement('strong');
        strong.textContent = nameEl.textContent.trim();
        cellContent.appendChild(strong);
      }
      // Extract info
      const infoEl = contactContent.querySelector('.contact-info');
      if (infoEl) {
        Array.from(infoEl.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            cellContent.appendChild(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            cellContent.appendChild(document.createTextNode(node.textContent));
          }
        });
      }
      // Extract all action links (linkedin, twitter, email) and place at the bottom
      const linksEl = contactContent.querySelector('.contact-link');
      if (linksEl) {
        // Place CTA links on their own line and reference existing elements
        const linksContainer = document.createElement('div');
        Array.from(linksEl.children).forEach(link => {
          linksContainer.appendChild(link);
          linksContainer.appendChild(document.createTextNode(' ')); // space
        });
        cellContent.appendChild(linksContainer);
      }
    }
    // Add the card row only if we have meaningful content in both cells
    if (img && cellContent.innerHTML.trim()) {
      cells.push([img, cellContent]);
    }
  });

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
