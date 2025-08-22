/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');
  const rows = [['Accordion']];
  
  items.forEach(item => {
    // Title cell: always reference the .cmp-accordion__title span
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (titleSpan) {
      titleCell = titleSpan;
    } else {
      // fallback: use button text
      const btn = item.querySelector('.cmp-accordion__button');
      titleCell = document.createElement('span');
      titleCell.textContent = btn ? btn.textContent.trim() : '';
    }
    // Content cell: find the visible content of the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // The panel usually contains a .cmp-container, which contains the full content structure
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        contentCell = cmpContainer;
      } else {
        // fallback: use panel directly
        contentCell = panel;
      }
    } else {
      // fallback: empty div
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
