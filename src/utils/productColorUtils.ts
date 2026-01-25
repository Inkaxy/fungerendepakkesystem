/**
 * Utility functions for consistent product coloring based on product ID.
 * Ensures the same product always displays with the same color across all views.
 */

/**
 * Generates a consistent color index (0, 1, or 2) based on product ID.
 * The same product will always get the same color regardless of order.
 * 
 * @param productId - The unique identifier of the product
 * @returns A number 0, 1, or 2 representing the color index
 */
export const getConsistentColorIndex = (productId: string): number => {
  if (!productId) return 0;
  
  // Simple hash function that sums character codes
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash) + productId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash % 3); // Return 0, 1, or 2
};

/**
 * Gets the color index for a product based on settings.
 * Uses consistent hash-based coloring if enabled, otherwise falls back to index-based.
 * 
 * @param productId - The product's unique identifier
 * @param index - The product's position in the list (fallback)
 * @param useConsistentColors - Whether to use consistent coloring
 * @returns A number 0, 1, or 2 representing the color index
 */
export const getProductColorIndex = (
  productId: string,
  index: number,
  useConsistentColors: boolean
): number => {
  if (useConsistentColors) {
    return getConsistentColorIndex(productId);
  }
  return index % 3;
};
