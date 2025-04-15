export function getRandomHSLColor() {
  const hue = Math.floor(Math.random() * 361);
  const saturation = Math.floor(Math.random() * 101);
  return `hsl(${hue}, ${saturation}%, 60%)`;
}
