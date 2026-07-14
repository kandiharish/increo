export const formatCurrency = (val: number | string | undefined): string => {
  if (val === undefined) return '₹0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹0';
  
  // Format as Indian Rupee (INR)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatPercentage = (val: number | string | undefined): string => {
  if (val === undefined) return '0%';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
};
