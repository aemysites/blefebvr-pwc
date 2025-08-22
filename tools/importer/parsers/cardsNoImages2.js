/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the table with 'Cards' as the header
  const cells = [['Cards']];

  // Find the section container inside the given element
  const parsys = element.querySelector('.parsys.sectionpar');
  if (!parsys) return;

  // Get all direct child .text.parbase.section elements (each is a block, first is h2 heading)
  const cardDivs = Array.from(parsys.querySelectorAll(':scope > div.text.parbase.section'));

  // Start at index 1 to skip the first block, which contains the main heading only
  for (let i = 1; i < cardDivs.length; i++) {
    const cardDiv = cardDivs[i];
    // Each card's content is in the .text-component
    const textComponent = cardDiv.querySelector('.text-component');
    if (textComponent && textComponent.textContent.trim().length > 0) {
      // Reference the textComponent directly for the table cell
      cells.push([textComponent]);
    }
  }

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
