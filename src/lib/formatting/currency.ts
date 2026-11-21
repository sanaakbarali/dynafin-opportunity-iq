/**
 * Indian Rupee (INR) Formatting Utilities
 * Strictly follows Indian Numbering System: Thousands, Lakhs, Crores
 * Format examples: ₹15,00,000 | ₹6,500 | ₹1.50 Lakh | ₹2.40 Cr
 */

export function formatINR(
  amount: number | null | undefined,
  options: {
    compact?: boolean;
    showSign?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  } = {}
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const {
    compact = false,
    showSign = false,
    decimals = 0,
    showSymbol = true,
  } = options;

  const symbol = showSymbol ? '₹' : '';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores
      const cr = (absAmount / 10000000).toFixed(decimals > 0 ? decimals : 2);
      return `${isNegative ? '-' : showSign ? '+' : ''}${symbol}${cr} Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs
      const lakh = (absAmount / 100000).toFixed(decimals > 0 ? decimals : 2);
      return `${isNegative ? '-' : showSign ? '+' : ''}${symbol}${lakh} Lakh`;
    }
    if (absAmount >= 1000) {
      const k = (absAmount / 1000).toFixed(decimals > 0 ? decimals : 1);
      return `${isNegative ? '-' : showSign ? '+' : ''}${symbol}${k}K`;
    }
  }

  // Standard Indian Numbering System: ##,##,###
  const numStr = Math.round(absAmount).toString();
  let result = '';

  if (numStr.length <= 3) {
    result = numStr;
  } else {
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${formattedOther},${lastThree}`;
  }

  return `${isNegative ? '-' : showSign ? '+' : ''}${symbol}${result}`;
}

/**
 * Format Indian Dates in DD/MM/YYYY or DD MMM YYYY
 */
export function formatIndianDate(
  dateInput: string | Date | null | undefined,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'short') {
    return `${day}/${month}/${year}`;
  }
  if (format === 'medium') {
    return `${day} ${months[d.getMonth()]} ${year}`;
  }
  return `${day} ${fullMonths[d.getMonth()]}, ${year}`;
}
