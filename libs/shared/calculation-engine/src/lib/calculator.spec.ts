import { calculate } from './calculator';

describe('calculate', () => {
  it('should compute sale price from cost and markup', () => {
    const result = calculate({
      mode: 'merch-only',
      cost: 10,
      markupPercent: 50,
      units: 100,
    });
    expect(result.revenue).toBe(1500); // sale price 15 * 100 units
    expect(result.computed.revenue).toBe(true);
  });

  it('should compute markup from cost and sale price', () => {
    const result = calculate({
      mode: 'merch-only',
      cost: 10,
      salePricePerUnit: 15,
      units: 100,
    });
    expect(result.markupPercent).toBe(50);
    expect(result.computed.markupPercent).toBe(true);
  });

  it('when all 3 are set and lastEdited is salePrice, markup is derived', () => {
    const result = calculate({
      mode: 'merch-only',
      cost: 10,
      markupPercent: 99,
      salePricePerUnit: 15,
      units: 100,
      pricingFieldLastEdited: 'salePrice',
    });
    expect(result.cost).toBe(10);
    expect(result.revenue).toBe(1500); // 15 * 100
    expect(result.markupPercent).toBe(50); // derived from cost and sale price
    expect(result.computed.markupPercent).toBe(true);
  });

  it('when all 3 are set and lastEdited is markup, sale price is derived', () => {
    const result = calculate({
      mode: 'merch-only',
      cost: 10,
      markupPercent: 30,
      salePricePerUnit: 10.30, // will be overwritten
      units: 100,
      pricingFieldLastEdited: 'markup',
    });
    expect(result.cost).toBe(10);
    expect(result.markupPercent).toBe(30);
    expect(result.revenue).toBe(1300); // 13 * 100
    expect(result.computed.revenue).toBe(true);
  });

  it('should compute cost from markup and sale price', () => {
    const result = calculate({
      mode: 'merch-only',
      markupPercent: 50,
      salePricePerUnit: 15,
      units: 100,
    });
    expect(result.cost).toBe(10);
    expect(result.computed.cost).toBe(true);
  });

  it('should calculate net revenue with deductions', () => {
    const result = calculate({
      mode: 'merch-only',
      cost: 10,
      markupPercent: 50,
      units: 100,
      returnsPercent: 5,
      shippingCost: 50,
    });
    expect(result.revenue).toBe(1500);
    expect(result.returnsAmount).toBe(75);
    expect(result.totalDeductions).toBe(125);
    expect(result.netRevenue).toBe(1375);
  });

  it('should calculate artist royalty on net revenue', () => {
    const result = calculate({
      mode: 'artist-label',
      cost: 10,
      markupPercent: 50,
      units: 100,
      royaltyPercent: 10,
      royaltyBase: 'net',
    });
    expect(result.revenue).toBe(1500);
    expect(result.royaltyAmount).toBe(150); // 10% of 1500 (no deductions)
  });

  it('should calculate per-unit royalty', () => {
    const result = calculate({
      mode: 'artist-label',
      salePricePerUnit: 15,
      cost: 10,
      units: 100,
      royaltyType: 'per-unit',
      royaltyPerUnit: 0.50,
    });
    expect(result.royaltyAmount).toBe(50); // 100 * 0.50
  });

  it('should calculate merch company net', () => {
    const result = calculate({
      mode: 'artist-label',
      cost: 10,
      markupPercent: 50,
      units: 100,
      royaltyPercent: 10,
      royaltyBase: 'gross',
    });
    const expectedRoyalty = 150; // 10% of 1500
    const expectedMerchNet = 1500 - 1000 - 150; // revenue - COGS - royalty
    expect(result.royaltyAmount).toBe(expectedRoyalty);
    expect(result.merchCompanyNet).toBe(expectedMerchNet);
  });
});
