export function getCoordinates(
  e: MouseEvent,
  zoomLevel: number,
  stagePosition: { canvasX: number; canvasY: number }
) {
  const stage = e.target as HTMLDivElement; // Get the stage element
  const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

  // Calculate the position relative to the infinite canvas
  const canvasX = (e.clientX - rect.left - stagePosition.canvasX) / zoomLevel;
  const canvasY = (e.clientY - rect.top - stagePosition.canvasY) / zoomLevel;
  return { canvasX, canvasY };
}
