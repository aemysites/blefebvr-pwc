/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column controller (two columns)
  const columnControl = element.querySelector('.columnControl');
  if (!columnControl) return;
  const columns = Array.from(columnControl.querySelectorAll(':scope > .parsys_column'));
  // Sometimes there is a single container: .pwccol2-longform with two .parsys_column children
  let columnGroups = columns;
  if (columns.length === 0) {
    // Try inside a pwccol2-longform
    const innerLongform = columnControl.querySelector('.pwccol2-longform');
    if (innerLongform) {
      columnGroups = Array.from(innerLongform.querySelectorAll(':scope > .parsys_column'));
    }
  }
  if (columnGroups.length !== 2) return;

  // --- Column 1: text and quote ---
  const col0 = columnGroups[0];
  const col0Content = [];
  const textComponent = col0.querySelector('.text-component');
  if (textComponent) col0Content.push(textComponent);
  const quote = col0.querySelector('.quote');
  if (quote) col0Content.push(quote);

  // --- Column 2: video ---
  const col1 = columnGroups[1];
  const col1Content = [];
  // Find video info (poster, link)
  const videoJs = col1.querySelector('.video-js');
  if (videoJs && videoJs.dataset && videoJs.dataset.videoUrl) {
    const videoUrl = videoJs.dataset.videoUrl;
    const videoTitle = videoJs.dataset.videoTitle || 'Video';
    // Find poster image
    const posterImg = videoJs.querySelector('.vjs-poster img');
    if (posterImg && posterImg.src) {
      col1Content.push(posterImg);
    }
    // Create a link to the video
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoTitle;
    videoLink.target = '_blank';
    col1Content.push(videoLink);
  }
  // Find video description if present
  const videoDesc = col1.querySelector('.videojs-description');
  if (videoDesc) {
    col1Content.push(videoDesc);
  }

  // --- Compose Cells ---
  // According to the spec, header must be 'Columns (columns3)'
  // Row 2 must have two columns, matching the screenshot/markdown (text+quote | video)
  const cells = [
    ['Columns (columns3)'],
    [col0Content, col1Content]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
