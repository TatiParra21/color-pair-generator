export const needsContrastHelp = (
  color: string,
  background = "#f6f7fb",
  threshold = 25
) => {
  const hexToRgb = (hex: string) => {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  };

  const a = hexToRgb(color);
  const b = hexToRgb(background);

  const distance = Math.sqrt(
    (a.r - b.r) ** 2 +
    (a.g - b.g) ** 2 +
    (a.b - b.b) ** 2
  );

  return distance < threshold;
};