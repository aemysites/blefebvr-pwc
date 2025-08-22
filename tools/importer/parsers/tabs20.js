/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab group container
  const filterContainer = element.querySelector('.ceo-filter-container');
  if (!filterContainer) return;
  // Find the visible tab group (the actual tabs selector)
  const tabGroup = filterContainer.querySelector('.coe-filter');
  if (!tabGroup) return;
  // Find all tab buttons - each represents a tab label
  const tabButtons = Array.from(tabGroup.querySelectorAll('.filter-button-item'));
  // Table header: exactly 'Tabs'
  const headerRow = ['Tabs'];
  // Build tab rows - each row is [tab label, tab content]
  // There is no tab content in the given HTML, so we leave content blank for each
  const tabRows = tabButtons.map(btn => [btn, '']); // Reference the actual button element
  // Compose table
  const tableRows = [headerRow, ...tabRows];
  // Create table block
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
