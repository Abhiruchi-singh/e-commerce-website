export function computeOrderTotals(subtotal: number) {
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + shipping + tax;
  return { shipping, tax, grandTotal };
}
