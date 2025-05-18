export const getlineHeadPoints = (data?: number[]) => {
  if (!data) return;
  const dx = data[2] - data[0];
  const dy = data[3] - data[1];
  const angle = Math.atan2(dy, dx);
  const lineLength = 15;
  const lineAngle = Math.PI / 6;

  return [
    {
      x: data[2] - lineLength * Math.cos(angle - lineAngle),
      y: data[3] - lineLength * Math.sin(angle - lineAngle),
    },
    {
      x: data[2] - lineLength * Math.cos(angle + lineAngle),
      y: data[3] - lineLength * Math.sin(angle + lineAngle),
    },
  ];
};
