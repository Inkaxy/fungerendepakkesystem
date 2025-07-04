/**
 * Calculate basket display information for a product quantity
 * @param totalQuantity Total quantity to pack
 * @param basketQuantity Number of items per basket/container
 * @returns Object with basket calculation info
 */
export const calculateBasketDisplay = (totalQuantity: number, basketQuantity?: number) => {
  if (!basketQuantity || basketQuantity <= 0) {
    return null;
  }

  const fullBaskets = Math.floor(totalQuantity / basketQuantity);
  const remainingItems = totalQuantity % basketQuantity;

  return {
    fullBaskets,
    remainingItems,
    hasRemainder: remainingItems > 0,
    basketDisplay: remainingItems > 0 ? `${fullBaskets}+${remainingItems}` : `${fullBaskets}`
  };
};

/**
 * Format quantity display with basket information
 * @param quantity Total quantity
 * @param basketQuantity Items per basket
 * @param format Display format preference
 * @param unit Unit of measurement
 * @returns Formatted display string
 */
export const formatQuantityWithBasket = (
  quantity: number,
  basketQuantity: number | undefined,
  format: 'total_first' | 'basket_first',
  unit: string = 'stk'
): string => {
  const totalDisplay = `${quantity} ${unit}`;
  const basketInfo = calculateBasketDisplay(quantity, basketQuantity);

  if (!basketInfo) {
    return totalDisplay;
  }

  const basketDisplay = `(${basketInfo.basketDisplay})`;

  return format === 'total_first' 
    ? `${totalDisplay} ${basketDisplay}`
    : `${basketInfo.basketDisplay} (${totalDisplay})`;
};