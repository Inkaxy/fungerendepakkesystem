
// Remove leading zeros from ID strings
export const removeLeadingZeros = (id: string): string => {
  return id.replace(/^0+/, '') || '0';
};
