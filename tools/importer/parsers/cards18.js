/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the Cards (cards18) header as required
  const headerRow = ['Cards (cards18)'];

  // Find all card articles
  const cardArticles = Array.from(element.querySelectorAll('article.collection__item'));
  const rows = [headerRow];

  cardArticles.forEach(article => {
    // Get the image (mandatory for cards18)
    const imgWrapper = article.querySelector('.collection__item-image-wrapper');
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;
    // Get the text content container
    const content = article.querySelector('.collection__item-content');
    if (!img || !content) return; // Skip cards missing required pieces

    const textParts = [];
    // The date (if present)
    const dateP = content.querySelector('.collection__item-sub-heading');
    if (dateP) textParts.push(dateP);

    // The heading/title (if present)
    const heading = content.querySelector('h4');
    if (heading) textParts.push(heading);

    // The description (if present)
    // Note: this is a <p class="paragraph">
    const desc = content.querySelector('p.paragraph');
    if (desc) textParts.push(desc);

    // Note: the link in this markup is always wrapping the card, not a CTA in the cell.

    // Each row: [img, [date, heading, description]]
    rows.push([img, textParts]);
  });

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
