/**
 * Generates a random number between min and max
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns Random number in range
 */
export function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
