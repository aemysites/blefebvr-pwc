/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Find all card blocks: direct children with class 'textimage'
  const cardDivs = Array.from(element.querySelectorAll('.parsys > .textimage'));
  cardDivs.forEach((card) => {
    // Image is always present in left column
    const img = card.querySelector('.textimage-image img');
    // Text block on right
    const textComp = card.querySelector('.textimage-text .text-component');
    // Collect title, description, cta
    let textCellContent = [];
    if (textComp) {
      // Title: first <a> as <strong>
      const link = textComp.querySelector('a');
      if (link) {
        const strong = document.createElement('strong');
        strong.appendChild(link); // reference, not clone
        textCellContent.push(strong);
      }
      // Description: the first <p> after the link (typically second <p>)
      const ps = textComp.querySelectorAll('p');
      if (ps.length > 1) {
        textCellContent.push(ps[1]); // reference, not clone
      }
      // If only one <p>, and it doesn't contain the link, use it as description
      if (ps.length === 1 && !ps[0].contains(link)) {
        textCellContent.push(ps[0]);
      }
    }
    // If no textComp or nothing in textCellContent, fallback to full text
    if (!textComp || textCellContent.length === 0) {
      // Try to grab all text from right cell
      const txtPart = card.querySelector('.textimage-text');
      if (txtPart) textCellContent.push(txtPart);
      else textCellContent.push('');
    }
    // Compose row: [img, text content]
    cells.push([
      img,
      textCellContent.length > 1 ? textCellContent : textCellContent[0]
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
