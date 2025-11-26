export function getRandomNumbers(n: number) {
  /**
   * Generate a random array of numbers from 1 to n.
   * Returns minimum 3 numbers (if possible) and maximum 1/3 of n numbers.
   * If n < 3, returns all numbers from 1 to n.
   *
   * @param {number} n - The upper bound number
   * @returns {number[]} Array of random numbers within the specified constraints
   */

  // Handle edge cases
  if (n <= 0) return [];
  if (n <= 3) return Array.from({ length: n }, (_, i) => i + 1);

  // Calculate maximum numbers to return (1/3 of n)
  const maxNumbers = Math.max(3, Math.min(Math.floor(n / 3), n));

  // Generate random count between 3 and maxNumbers
  const count = Math.floor(Math.random() * (maxNumbers - 2)) + 3;

  // Create array of all possible numbers
  const numbers = Array.from({ length: n }, (_, i) => i + 1);

  // Shuffle array and take first 'count' elements
  return numbers.sort(() => Math.random() - 0.5).slice(0, count);
}

export function getRandomNumber(n: number) {
  /**
   * Returns a single number:
   * - If n is 1, returns 1
   * - If n > 1, returns a random number between 1 and n (inclusive)
   *
   * @param {number} n - The upper bound number
   * @returns {number} A single number based on the conditions
   */
  if (n <= 1) return 1;
  return Math.floor(Math.random() * n) + 1;
}
