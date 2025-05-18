export function getCoordinates(
  e: MouseEvent,
  zoomLevel: number,
  stagePosition: { x: number; y: number }
) {
  const stage = e.target as HTMLDivElement; // Get the stage element
  const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

  // Calculate the position relative to the infinite canvas
  const canvasX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
  const canvasY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;
  return { canvasX, canvasY };
}
