export type CircleSize = "small" | "medium" | "large";

// Meters
export const CircleSizeLengths: Record<CircleSize, number> = {
  small: 50,
  medium: 75,
  large: 100,
};

// Average number of meters in one degree of latitude
export const MetersPerDegreeLat = 111320;

export function offsetCoord(
  origin: { latitude: number; longitude: number },
  dx: number,
  dy: number,
): { latitude: number; longitude: number } {
  const metersPerDegreeLng =
    MetersPerDegreeLat * Math.cos((origin.latitude * Math.PI) / 180);

  return {
    latitude: origin.latitude + dy / MetersPerDegreeLat,
    longitude: origin.longitude + dx / metersPerDegreeLng,
  };
}

export function rotatePoint(
  x: number,
  y: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  };
}

export function getCircleCenter(
  origin: { latitude: number; longitude: number },
  headingDeg: number,
  radiusMeters: number,
): { latitude: number; longitude: number } {
  const forwardOffset = radiusMeters * 0.6;
  const rotated = rotatePoint(0, forwardOffset, headingDeg);
  return offsetCoord(origin, rotated.x, rotated.y);
}
