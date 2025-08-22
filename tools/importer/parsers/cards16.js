/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block
  const headerRow = ['Cards (cards16)'];
  const cells = [headerRow];

  // Helper: Extract image from background-image
  function createImgFromBg(div) {
    if (!div) return '';
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (match) {
      const img = document.createElement('img');
      img.src = match[1];
      img.alt = '';
      return img;
    }
    return '';
  }

  // Get all direct child elements
  const children = Array.from(element.children);
  let i = 0;
  while (i < children.length) {
    const btn = children[i];
    // Only process the card start element
    if (!btn.classList.contains('coe-article')) {
      i++;
      continue;
    }
    // Image
    const imgContainer = btn.querySelector('.coe-article-image-container');
    const bgImgDiv = imgContainer && imgContainer.querySelector('.coe-article-image');
    const img = createImgFromBg(bgImgDiv);

    // Category/subtitle
    const categoryDiv = imgContainer && imgContainer.querySelector('.coe-article-location');
    const categoryText = categoryDiv ? categoryDiv.textContent.trim() : '';

    // Company name (title)
    const companyDiv = children[i+2];
    const companyText = (companyDiv && companyDiv.classList.contains('coe-article-company')) ? companyDiv.textContent.trim() : '';

    // Description/content
    const bodyDiv = children[i+3];
    const descriptionArr = [];
    if (bodyDiv && bodyDiv.classList.contains('coe-article-content-body')) {
      // Collect all direct children (paragraphs, lists, etc)
      Array.from(bodyDiv.childNodes).forEach(node => {
        // Use only existing nodes, don't clone or create new content
        if (node.nodeType === 1) {
          descriptionArr.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          descriptionArr.push(p);
        }
      });
    }

    // CTA link
    const controlsDiv = children[i+4];
    let link = '';
    if (controlsDiv && controlsDiv.classList.contains('coe-article-controls')) {
      const linkEl = controlsDiv.querySelector('a');
      if (linkEl) link = linkEl;
    }

    // Compose text cell
    const textCellArr = [];
    if (companyText) {
      const strong = document.createElement('strong');
      strong.textContent = companyText;
      textCellArr.push(strong);
    }
    if (categoryText) {
      const em = document.createElement('em');
      em.textContent = categoryText;
      textCellArr.push(em);
    }
    if (descriptionArr.length > 0) {
      textCellArr.push(...descriptionArr);
    }
    if (link) {
      textCellArr.push(link);
    }

    // Add table row: [image, text cell]
    cells.push([
      img ? img : '',
      textCellArr
    ]);
    i += 6; // Each card uses 6 direct child elements
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
