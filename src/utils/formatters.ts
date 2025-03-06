/**
 * Format large numbers in a compact way (e.g., 5000 -> 5K, 1000000 -> 1M)
 */
export const formatCompact = (value: number): string => {
  if (value >= 1000000) {
    return `${Math.floor(value / 1000000)}M`;
  } else if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  } else {
    return value.toString();
  }
};

/**
 * Format numbers with commas as thousands separators
 */
export const formatWithCommas = (value: number): string => {
  return value.toLocaleString();
};
