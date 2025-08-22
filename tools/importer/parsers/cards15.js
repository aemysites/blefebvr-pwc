/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find the card articles (each card is an article)
  const cardArticles = element.querySelectorAll('article.listing_collection_article');
  cardArticles.forEach(article => {
    // Each card is a link (anchor)
    const anchor = article.querySelector('a.listing_collection_card');

    // Get image element (reference the actual element)
    let img = null;
    const imgContainer = anchor && anchor.querySelector('.listing_collection_card_image_container');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Get content container
    const contentDiv = anchor && anchor.querySelector('.listing_collection_card_content');
    const titleDiv = contentDiv && contentDiv.querySelector('.listing_collection_card_title');
    let titleElem = null;
    if (titleDiv) {
      // Use the heading inside the titleDiv
      titleElem = titleDiv.querySelector('h1, h2, h3, h4, h5, h6');
    }

    // Get description paragraph
    let descElem = null;
    const descDiv = contentDiv && contentDiv.querySelector('.listing_collection_card_description');
    if (descDiv) {
      descElem = descDiv.querySelector('p');
    }

    // Get date/time element (may be present)
    let metaElem = null;
    const timeChip = contentDiv && contentDiv.querySelector('.listing_collection_card_title_chips .collection_time_date');
    if (timeChip) {
      metaElem = document.createElement('div');
      // Add all <time> and text nodes
      Array.from(timeChip.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TIME') {
          metaElem.appendChild(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // wrap text in a span for safety
          const span = document.createElement('span');
          span.textContent = node.textContent;
          metaElem.appendChild(span);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
          // Some times are in spans
          metaElem.appendChild(node);
        }
      });
      // Add class for semantics
      metaElem.className = 'card-meta';
    }

    // Build text cell: meta, title, description
    const textContent = [];
    if (metaElem && metaElem.textContent.trim()) {
      textContent.push(metaElem);
    }
    if (titleElem) {
      textContent.push(titleElem);
    }
    if (descElem) {
      textContent.push(descElem);
    }

    // Compose row: [image, text content]
    rows.push([img || '', textContent]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
