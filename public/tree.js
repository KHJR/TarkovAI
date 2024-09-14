const hoverElement = document.querySelector('.hover-element');
const tooltip = document.querySelector('.tooltip');

hoverElement.addEventListener('mousemove', (e) => {
  tooltip.style.display = 'block';
  tooltip.style.left = e.pageX + 10 + 'px'; // Offset slightly from the cursor
  tooltip.style.top = e.pageY + 10 + 'px';  // Offset slightly from the cursor
});

hoverElement.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none'; // Hide tooltip when cursor leaves element
});