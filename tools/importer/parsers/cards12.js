/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Select all the direct <article> children for the cards
  const cards = element.querySelectorAll(':scope > article');

  cards.forEach((card) => {
    // Find the <a> (card container)
    const a = card.querySelector('a');
    if (!a) return; // Defensive: Skip if link missing

    // Find the image in the card
    const img = a.querySelector('img');

    // Find heading and description
    const heading = a.querySelector('h3');
    const desc = a.querySelector('p');

    // Compose the text content cell
    const textContent = [];
    if (heading) textContent.push(heading);
    if (desc) textContent.push(desc);
    // If both missing, skip this card:
    if (!img && textContent.length === 0) return;

    rows.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
