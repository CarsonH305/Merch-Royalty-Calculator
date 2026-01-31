export const FIELD_TOOLTIPS: Record<string, string> = {
  cost: 'Cost of goods sold per unit—what you pay to produce each item.',
  markupPercent: 'Percentage added to cost to set your selling price. Auto-calculated when you enter Cost and Sale Price—changes to Sale Price will update Markup.',
  revenue: 'Total gross revenue from sales before any deductions.',
  salePricePerUnit: 'The price you charge per unit. When Cost and Sale Price are set, Markup auto-adjusts to keep the math in sync.',
  units: 'Number of units sold or projected to sell.',
  returnsPercent: 'Percentage of gross sales that are returned by customers. Typical range: 2–8%.',
  shippingCost: 'Total shipping and fulfillment costs.',
  taxesAmount: 'Sales tax, VAT, or other tax amounts.',
  discountsAmount: 'Total value of discounts and promotions given.',
  otherCosts: 'Packaging, fulfillment fees, royalties, or any other costs.',
  royaltyPercent: 'Percentage of revenue paid to the artist or licensor.',
  royaltyBase: 'Whether royalty is calculated on gross (total) or net (after deductions) revenue.',
  royaltyPerUnit: 'Fixed dollar amount paid to the artist per unit sold.',
  royaltyType: 'Percentage-based (% of revenue) or per-unit ($ per item) royalty structure.',
};

export const SECTION_TOOLTIPS: Record<string, string> = {
  'revenue-costs': 'Core pricing inputs. When both Cost and Sale Price are set, Markup auto-adjusts. With only two values, the third is calculated.',
  deductions: 'Amounts subtracted from gross revenue: returns, shipping, taxes, discounts.',
  royalty: 'Artist or licensor compensation—either a percentage of revenue or a fixed amount per unit.',
  results: 'Calculated outcomes based on your inputs.',
  summary: 'Input summary and potential areas for improvement.',
};

export const RESULT_TOOLTIPS: Record<string, string> = {
  grossRevenue: 'Total sales revenue before any deductions. Formula: Sale Price per unit × Units.',
  netRevenue: 'Revenue after deductions. Formula: Gross Revenue − Returns − Shipping − Taxes − Discounts.',
  artistRoyalty: 'Amount paid to the artist or licensor. Based on royalty % × (gross or net revenue), or per-unit rate × units.',
  companyProfit: 'What the merchandise company keeps after all costs. Formula: Net Revenue − COGS − Artist Royalty − Other Costs.',
  grossMargin: '(Revenue − COGS) ÷ Revenue × 100. Shows profit margin before deductions and royalties.',
  netMargin: 'Company Profit ÷ Net Revenue × 100. Shows your actual profit margin as a percentage.',
};
