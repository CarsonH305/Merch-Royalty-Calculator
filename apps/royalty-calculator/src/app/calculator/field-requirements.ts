export const FIELD_REQUIREMENTS: Record<string, string> = {
  cost: 'optional',
  markupPercent: 'optional',
  revenue: 'optional',
  salePricePerUnit: 'optional',
  units: 'optional',
  returnsPercent: 'optional',
  shippingCost: 'optional',
  taxesAmount: 'optional',
  discountsAmount: 'optional',
  otherCosts: 'optional',
  royaltyPercent: 'optional',
  royaltyBase: 'optional',
  royaltyPerUnit: 'optional',
  royaltyType: 'optional',
};

export const SECTION_REQUIREMENTS: Record<string, string> = {
  'revenue-costs': 'Markup auto-adjusts when Cost & Sale Price are set',
  deductions: 'All optional',
  royalty: 'All optional',
};
